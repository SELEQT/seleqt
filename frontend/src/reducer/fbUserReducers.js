import { GET_FB_USER } from '../actions/types'

const initialState = {
    fbUsers: [

    ]
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_FB_USER:
            return {
                ...state
            }
        default:
            return state;
    }
}