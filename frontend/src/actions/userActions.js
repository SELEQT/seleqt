import { GET_USER, ADD_USER } from './types';


/*  
    Take a snapshot of database and sort the payload by votes. Must convert firebase 
    snapshot to Object.values [{}] 
*/
export const getUser = () => {
    return {
        type: GET_USER,
    }
    /* dispatch(setTracksLoading());
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
    }) */
}

export const addUser = (email, id) => {
    return {
        type: ADD_USER,
        payload: {email, id}
    }
}
