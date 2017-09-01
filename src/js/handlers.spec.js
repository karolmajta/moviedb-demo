import * as data from './data';
import { initialize } from './handlers';

describe('initialize', () => {
    it('shoudl assoc `initialized` true in state', function () {
        let state = new data.ApplicationState();
        expect(initialize({})(state, {})).toEqual(new data.ApplicationState({initialized: true}));
    });
});