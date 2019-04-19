import firebase from '../firebase';
import { GET_TRACKS, ADD_TRACKS, TRACKS_LOADING } from './types';


/*  
    Take a snapshot of database and sort the payload by votes. Must convert firebase 
    snapshot to Object.values [{}] 
*/
export const getTracks = () => dispatch => {
    dispatch(setTracksLoading());
    firebase.database().ref('/queue').on("value", snapshot => {
        let orderedPayload = Object.values(snapshot.val())
        console.log(orderedPayload)
        orderedPayload.sort(function(a, b){
            return b.votes - a.votes
        });
        dispatch({
            type: GET_TRACKS,
            payload: orderedPayload
        })
    })
}

export const addTrack = (track, id) => {
    return {
        type: ADD_TRACKS,
        payload: track,
        payloadId: id
    }
}

export const setTracksLoading = () => {
    return {
        type: TRACKS_LOADING
    }
}
