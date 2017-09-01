import * as React from 'react';
import * as actions from '../actions';
import ReactiveComponent from './ReactiveComponent.jsx';
import SearchInput from './SearchInput.jsx';

export default class Application extends ReactiveComponent {
    render () {
        return (
            <div className="Application">
                <img src="images/logo.png" alt="MovieDB Demo" className="logo" />
                {this.state.initialized ? this.renderSearch() : this.renderSpinner()}
            </div>
        );
    }

    componentDidMount () {
        super.componentDidMount();
        this.props.store.dispatch(actions.initialize());
    }

    mapState (source) {
        return {
            initialized: source.initialized
        }
    }

    renderSpinner () {
        return (
            <div className="spinner">
                <i className="fa fa-5x fa-spinner fa-spin" />
            </div>
        );
    }

    renderSearch () {
        return <SearchInput />;
    }
}
