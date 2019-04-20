import { GET_USERID } from '../actions/types'

const initialState = {
    Users: [

    ]
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_USERID:
            return {
                ...state
            }
        default:
            return state;
    }
}