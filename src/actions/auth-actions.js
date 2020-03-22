import { LOGIN, REGISTER } from './types';
import { persistToken, createUserPayload } from '../helpers/action-helper';
import axios from 'axios';

let authUrl = process.env.REACT_APP_API_URL + '/auth';

export const login = (login) => dispatch => {
    axios.post(`${authUrl}/login`, login)
        .then(response => {
            var payload = response.data;
            if(response.data.token) {
                payload = createUserPayload(response);
                persistToken(payload.token, payload.expiryDate, payload.user);
            }
            dispatch({
                type: LOGIN,
                payload: payload
            })
        })
        .catch(error => {
            console.error(error);
            dispatch({
                type: LOGIN,
                error: error.message
            })
        })
};
  
export const register = (register) => dispatch => {
    axios.post(`${authUrl}/register`, register)
        .then(response => {
            var payload = response.data;
            if(response.data.token) {
                payload = createUserPayload(response);
                persistToken(payload.token, payload.expiryDate, payload.user);
            }
            dispatch({
                type: REGISTER,
                payload: payload
                })
            })
        .catch(error => {
            console.error(error);
            dispatch({
                type: REGISTER,
                error: error.message
            })
        })
};

export const resetTokenValid = (userId, token) => {
    var url = `${authUrl}/reset-token-valid/${userId}/${token}`;
    axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
        })
    return false;
};