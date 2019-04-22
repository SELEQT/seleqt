import { combineReducers } from 'redux';
import itemReducers from './itemReducers';
import trackReducers from './trackReducers';
import userReducers from './userReducers';
import accessCodeReducers from './accessCodeReducers';

export default combineReducers({
    item: itemReducers,
    track: trackReducers,
    user: userReducers,
    accessCode: accessCodeReducers,
})