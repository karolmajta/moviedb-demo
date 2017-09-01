import { createReducer } from './reducer';

describe('createReducer', () => {
    it('should return reducer function', () => {
        expect(typeof createReducer({}, {})).toEqual('function');
    });

    describe('reducer function', () => {
        it('should return state untouched if maching function was not found', () => {
            const mapping = {};
            const deps = {};
            const state = {};
            const reducerFn = createReducer(mapping, deps);
            const action = {type: 'whatever'};

            expect(reducerFn(state, action)).toBe(state);
        });

        it('should call a function matching action.type from mapping with dependencies', () => {
            const deps = {};
            const mapping = {
                matching: jest.fn(() => jest.fn()),
                notMatching: jest.fn(() => jest.fn())
            };
            const reducerFn = createReducer(mapping, deps);
            const action = {type: 'matching'};

            reducerFn({}, action);

            expect(mapping.notMatching.mock.calls).toEqual([]);
            expect(mapping.matching.mock.calls).toEqual([[deps]]);
        });

        it('should call the inner function with state and action.data and return whatever it returned', () => {
            const inner = jest.fn(() => 'return value');
            const mapping = {matching: jest.fn(() => inner)};
            const state = 'the state';
            const reducerFn = createReducer(mapping, {});
            const action = {type: 'matching', data: {a: 1, b: 'whatver'}};

            expect(reducerFn(state, action)).toEqual('return value');
            expect(inner.mock.calls).toEqual([[state, action.data]]);
        });
    });
});