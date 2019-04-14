import { GET_TRACKS, ADD_TRACKS } from './types';

export const getTracks = () => {
    return {
        type: GET_TRACKS
    };
}

export const addTrack = (track, id) => {
    return {
        type: ADD_TRACKS,
        payload: track,
        payloadId: id
    }
}