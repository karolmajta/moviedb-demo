export const initialize = ({}) => {
    return (state, {}) => {
        return state.set('initialized', true);
    }
};