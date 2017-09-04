import * as React from 'react';
import * as actions from '../actions';
import ReactiveComponent from './ReactiveComponent.jsx';
import SearchInput from './SearchInput.jsx';
import SearchResult from './SearchResult.jsx';

export default class Application extends ReactiveComponent {
    componentDidMount () {
        super.componentDidMount();
        this.props.store.dispatch(actions.initialize());
    }

    render () {
        return (
            <div className="Application container">
                <div className="row">
                    <div className="col-xs-12">
                        <img src="images/logo.png" alt="MovieDB Demo" className="logo" />
                    </div>
                </div>
                {this.state.initialized ? this.renderSearch() : this.renderSpinner()}
                {this.state.search !== null ? this.renderSearchTitle() : null}
                {this.state.searchResult !== null ? this.renderSearchResult() :
                    this.state.pendingResultPage ? this.renderSpinner() : null}
                {this.state.recentError !== null ? this.renderError() : null}
            </div>
        );
    }

    mapState (source) {
        return {
            initialized: source.initialized,
            search: source.search,
            searchResult: source.searchResult,
            pendingResultPage: source.pendingResultPage,
            recentError: source.recentError
        }
    }

    renderSpinner () {
        return (
            <div className="row spinner">
                <div className="col-xs-12 text-center">
                    <i className="fa fa-5x fa-spinner fa-spin" />
                </div>
            </div>
        );
    }

    renderSearch () {
        return <SearchInput disabled={this.state.pendingResultPage !== null}
                            onSubmit={this.onSearchSubmit} />;
    }

    renderSearchTitle () {
        return (
            <div className="row search-title">
                <div className="col-xs-12 text-center">
                    <h1>{this.state.search}</h1>
                </div>
            </div>
        )
    }

    renderSearchResult () {
        return <SearchResult result={this.state.searchResult}
                             loading={this.state.pendingResultPage > 1}
                             disabled={this.state.pendingResultPage !== null}
                             onItemSelect={this.onItemSelect}
                             onRequestNextPage={this.onRequestNextPage} />
    }

    renderError () {
        return (
            <div className="alert alert-danger error-message" onClick={(e) => this.onDismissError()}>
                <span className="glyphicon glyphicon-exclamation-sign" />
                {' '}
                {this.state.recentError}
            </div>
        );
    }

    onSearchSubmit = (searchTerm) => {
        this.props.store.dispatch(actions.search(searchTerm));
    };

    onRequestNextPage = (page) => {
        this.props.store.dispatch(actions.fetchNextSearchPage(page));
    };

    onDismissError = () => {
        this.props.store.dispatch(actions.dismissError());
    }
}
