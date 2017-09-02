import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as http from 'superagent';
import { createStore } from './miniredux';
import { createReducer } from './reducer';
import * as data from './data';
import * as actions from './actions';
import * as handlers from './handlers';
import Application from './components/Application.jsx';

const actionsToHandlers = {};
actionsToHandlers[actions.INITIALIZE] = handlers.initialize;
actionsToHandlers[actions.SEARCH] = handlers.search;
actionsToHandlers[actions.HANDLE_SEARCH_SUCCESS] = handlers.handleSearchSuccess;
actionsToHandlers[actions.HANDLE_SEARCH_ERROR] = handlers.handleSearchError;
actionsToHandlers[actions.FETCH_NEXT_SEARCH_PAGE] = handlers.fetchNextSearchPage;
actionsToHandlers[actions.HANDLE_NEXT_SEARCH_PAGE_SUCCESS] = handlers.handleNextSearchPageSuccess;
actionsToHandlers[actions.HANDLE_NEXT_SEARCH_PAGE_ERROR] = handlers.handleNextSearchPageError;
actionsToHandlers[actions.DISMISS_ERROR] = handlers.dismissError;

const reduceFn = createReducer(actionsToHandlers, {
    config: {
        apiRoot: window.document.body.getAttribute('data-api-root'),
        imageRoot: window.document.body.getAttribute('data-image-root'),
        apiKey: window.document.body.getAttribute('data-api-key')
    },
    dispatch: (action) => store.dispatch(action),
    http: http
});

const store = createStore(new data.ApplicationState(), reduceFn);

ReactDOM.render(React.createElement(Application, {store: store}), window.document.getElementById('app'));