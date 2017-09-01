export function createReducer (reduceFunctionsMap, dependencies) {
    return (state, action) => {
        if (reduceFunctionsMap[action.type] !== undefined) {
            return reduceFunctionsMap[action.type](dependencies)(state, action.data);
        } else {
            console.warn(`Dispatched an unrecognized action "${action.type}"`);
            return state;
        }
    }
}