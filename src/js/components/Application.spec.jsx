import * as React from 'react';
import { shallow } from 'enzyme';
import * as data from '../data';
import Application from './Application.jsx';

describe('Application', () => {
    const store =  {
            getState: jest.fn(() => new data.ApplicationState()),
            listen: jest.fn(),
            dispatch: jest.fn()
    };

    it('should render a logo and spinner when state.initialized is false', () => {
        const wrapper = shallow(<Application store={store} />);
        wrapper.setState({initialized: false});
        expect(wrapper.find('.logo')).toHaveLength(1);
        expect(wrapper.find('.spinner')).toHaveLength(1);
    });

    it('should render a logo and SearchInput when state.initialized is true', () => {
        const wrapper = shallow(<Application store={store} />);
        wrapper.setState({initialized: true});
        expect(wrapper.find('.logo')).toHaveLength(1);
        expect(wrapper.find('SearchInput')).toHaveLength(1);
    });
});