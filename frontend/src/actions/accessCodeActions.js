import { GET_ACCESS_CODE, ADD_ACCESS_CODE } from './types';

export const getAccessCode = () => {
    return {
        type: GET_ACCESS_CODE,
    }
}

export const addAccessCode = (code) => {
    return {
        type: ADD_ACCESS_CODE,
        payload: code
    }
}