import { GET_TRACKS, ADD_TRACKS } from '../actions/types';

const initialState = {
    tracks: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_TRACKS:
            return {
                ...state
            };
        case ADD_TRACKS:

            const existsInArray = state.tracks.some(trackList => trackList.id === action.payloadId)
            if (existsInArray) {
                // alert(action.payload.name + " is already queued."); How to do this?
                return state;
            }
            else {
                console.log("false")
                return {
                    ...state,
                    tracks: [action.payload, ...state.tracks]
                }
            }

        default: 
            return state;
    }
}