import { GET_ACCESS_CODE, ADD_ACCESS_CODE } from '../actions/types'

const initialState = {
    accessCodes: [

    ]
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ACCESS_CODE:
            return {
                ...state
            }
        case ADD_ACCESS_CODE:
            return {
                ...state,
                accessCodes: [action.payload, ...state.accessCodes]
            }
        default:
            return state;
    }
}