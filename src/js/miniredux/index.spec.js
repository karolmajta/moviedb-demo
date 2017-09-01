import { createStore } from './index';

describe('createStore', () => {
    it('returns an object with 3 methods - `dispatch`, `listen` and `getState`', () => {
        const store = createStore(null, jest.fn());
        expect(typeof store.dispatch).toEqual('function');
        expect(typeof store.listen).toEqual('function');
        expect(typeof store.getState).toEqual('function');
    });

    describe('dispatch', () => {
        it('should call `reduceFn` with whatever is the internal state of store', () => {
            const reduceFn = jest.fn((s, a) => s+1);
            let store = createStore(0, reduceFn);
            store.dispatch('one');
            store.dispatch('two');
            store.dispatch('three');
            expect(reduceFn.mock.calls).toEqual([[0, 'one'], [1, 'two'], [2, 'three']]);
        });

        it('should call all registered listeners after each update', () => {
            const reduceFn = jest.fn((s, a) => s+1);
            const store = createStore(0, reduceFn);
            const [l1, l2, l3] = [jest.fn(), jest.fn(), jest.fn()];
            const [u1, _] = [store.listen(l1), store.listen(l2)];

            store.dispatch('one');

            expect(l1.mock.calls).toEqual([[]]);
            expect(l2.mock.calls).toEqual([[]]);
            expect(l3.mock.calls).toEqual([]);

            u1();
            store.listen(l3);
            store.dispatch('two');

            expect(l1.mock.calls).toEqual([[]]);
            expect(l2.mock.calls).toEqual([[], []]);
            expect(l3.mock.calls).toEqual([[]]);
        });
    });

    describe('listen', () => {
        it('should return an `unlisten` function', () => {
            const store = createStore(null, jest.fn());
            expect(typeof store.listen(jest.fn())).toEqual('function');
        });

        it('should add given function to listeners set', () => {
            const l1 = jest.fn();
            const l2 = jest.fn();
            const store = createStore(null, jest.fn());

            store.listen(l1);

            expect(store.getListeners().has(l1)).toBe(true);
            expect(store.getListeners().has(l2)).toBe(false);

            store.listen(l2);

            expect(store.getListeners().has(l1)).toBe(true);
            expect(store.getListeners().has(l2)).toBe(true);
        });

        describe('`unlisten` function', () => {
            it('should remove proper listener from listeners set', () => {
                const l1 = jest.fn();
                const l2 = jest.fn();
                const store = createStore(null, jest.fn());
                const u1 = store.listen(l1);
                const u2 = store.listen(l2);

                u1();

                expect(store.getListeners().has(l1)).toBe(false);
                expect(store.getListeners().has(l2)).toBe(true);

                u2();

                expect(store.getListeners().has(l1)).toBe(false);
                expect(store.getListeners().has(l2)).toBe(false);
            });
        });
    })
});