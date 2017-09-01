import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from './miniredux';
import { createReducer } from './reducer';
import * as data from './data';
import * as actions from './actions';
import * as handlers from './handlers';
import Application from './components/Application.jsx';

const actionsToHandlers = {};
actionsToHandlers[actions.INITIALIZE] = handlers.initialize;

const reduceFn = createReducer(actionsToHandlers, {
    dispatch: (action) => store.dispatch(action)
});

const store = createStore(new data.ApplicationState(), reduceFn);

ReactDOM.render(React.createElement(Application, {store: store}), window.document.getElementById('app'));