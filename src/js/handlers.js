import * as I from 'immutable';
import * as actions from './actions';
import * as data from './data';
import { parseSearchResult } from './parsers';

export const initialize = ({}) => {
    return (state, {}) => {
        return state.set('initialized', true);
    }
};

export const search = ({config, dispatch, http}) => {
    return (state, {searchTerm}) => {
        http.get(`${config.apiRoot}/search/multi`)
            .accept('application/json')
            .query({
                api_key: config.apiKey,
                language: 'en-US',
                query: searchTerm,
                include_adult: false
            })
            .end(function(err, res) {
                if (err) {
                    dispatch(actions.handleSearchError());
                } else {
                    dispatch(actions.handleSearchSuccess(res.body));
                }
            });
        return state
            .set('searchResult', null)
            .set('pendingResultPage', 1)
            .set('search', searchTerm);
    };
};

export const handleSearchSuccess = ({config}) => {
    return (state, {result}) => {
        return state
            .set('pendingResultPage', null)
            .set('searchResult', parseSearchResult(result, 1, config.imageRoot));
    };
};

export const handleSearchError = ({}) => {
    return (state, {}) => {
        return state
            .set('pendingResultPage', null)
            .set('recentError', 'Sorry. We were unable to search for this term.');
    };
};

export const fetchNextSearchPage = ({config, dispatch, http}) => {
    return (state, {page}) => {
        http.get(`${config.apiRoot}/search/multi`)
            .accept('application/json')
            .query({
                api_key: config.apiKey,
                language: 'en-US',
                query: state.search,
                include_adult: false,
                page: page
            })
            .end(function(err, res) {
                if (err) {
                    dispatch(actions.handleNextSearchPageError());
                } else {
                    dispatch(actions.handleNextSearchPageSuccess(res.body));
                }
            });
        return state.set('pendingResultPage', page);

    };
};

export const handleNextSearchPageSuccess = ({config}) => {
    return (state, {result}) => {
        const newResult = parseSearchResult(result, 1, config.imageRoot);
        const combinedResult = new data.SearchResult({
            totalPages: newResult.totalPages,
            fetchedPages: state.searchResult.fetchedPages + newResult.fetchedPages,
            results: I.List(I.Set(state.searchResult.results.concat(newResult.results))).sortBy((r) => r.id)
        });

        return state
            .set('pendingResultPage', null)
            .set('searchResult', combinedResult);
    };
};

export const handleNextSearchPageError = ({}) => {
    return (state, {}) => {
        return state
            .set('pendingResultPage', null)
            .set('recentError', 'Sorry. We were unable to fetch more results.');
    };
};

export const dismissError = ({}) => {
    return (state, {}) => {
        return state
            .set('recentError', null);
    };
};