export function  createStore (initialState, reduceFn) {

    const listeners = new Set();
    let state = initialState;

    const dispatch = (action) => {
        state = reduceFn(state, action);
        listeners.forEach((l) => l());
    };

    const listen = (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
    };

    const getState = () => state;

    const getListeners = () => new Set(listeners);

    return {
        dispatch: dispatch,
        listen: listen,
        getState: getState,
        getListeners: getListeners,
    }
}