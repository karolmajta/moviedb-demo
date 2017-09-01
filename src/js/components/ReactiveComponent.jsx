import * as assert from 'assert';
import * as React from 'react';

export default class ReactiveComponent extends React.Component {
    constructor (props, context) {
        super(props, context);

        assert.ok(props.store !== undefined, '`ReactiveComponent` needs a store passed as prop');
        assert.ok(this.mapState !== undefined, '`ReactiveComponent`needs `mapState` method to be defined');

        this.state = this.mapState(props.store.getState());
    }

    componentDidMount () {
        this.unlisten = this.props.store.listen(() => {
            const storeState = this.props.store.getState();
            let componentState = this.mapState(storeState);
            this.setState(componentState);
        });
    }

    componentWillUnmount () {
        this.unlisten();
    }
}
