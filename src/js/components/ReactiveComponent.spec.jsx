import * as React from 'react';
import ReactiveComponent from './ReactiveComponent.jsx';

describe('ReactiveComponent', () => {
    it('should prevent element creation when on store on props', () => {
        class WithoutStore extends ReactiveComponent {
            mapState (source) {}
        }

        expect(() => new WithoutStore({}, {})).toThrow();
    });

    it('should prevent element creation when no method `mapState` defined', () => {
        class WithoutMapState extends ReactiveComponent {}

        expect(() => new WithoutMapState({store: {}}, {})).toThrow();
    });

    it('should set initial state to result of mapState called with whatever is current state of store', () => {
        const immutableState = {};
        const store = {getState: jest.fn(() => immutableState)};

        class MyComponent extends ReactiveComponent {
            mapState (source) {
                expect(source).toBe(immutableState);
                return {a: 1, b: 'whatever'}
            }
        }

        const myComponent = new MyComponent({store: store}, {});

        expect(myComponent.state).toEqual({a: 1, b: 'whatever'});
    });

    it('should call listen on store and store unlisten function in componentDidMount', () => {
        const store = {listen: jest.fn(), getState: jest.fn()};

        class MyComponent extends ReactiveComponent {
            mapState (source) {}
        }

        const myComponent = new MyComponent({store: store}, {});

        myComponent.componentDidMount();

        expect(store.listen).toHaveBeenCalled();
    });

    it('should call the unlisten function in componentWillUnmount', () => {
        const unlisten = jest.fn();
        const store = {listen: jest.fn(() => unlisten), getState: jest.fn()};

        class MyComponent extends ReactiveComponent {
            mapState (source) {}
        }

        const myComponent = new MyComponent({store: store}, {});

        myComponent.componentDidMount();
        myComponent.componentWillUnmount();

        expect(unlisten).toHaveBeenCalled();
    });
});
