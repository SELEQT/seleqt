import { combineReducers } from 'redux';
import itemReducers from './itemReducers';
import trackReducers from './trackReducers';
import userReducers from './userReducers';
import fbUserReducers from './fbUserReducers';

export default combineReducers({
    item: itemReducers,
    track: trackReducers,
    userId: userReducers,
    fbUser: fbUserReducers
})