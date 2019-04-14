import { combineReducers } from 'redux';
import itemReducers from './itemReducers';
import trackReducers from './trackReducers';

export default combineReducers({
    item: itemReducers,
    track: trackReducers
})