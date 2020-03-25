import { LOGIN, REGISTER, RESET_TOKEN_VALID } from './types';
import { persistToken, createUserPayload } from '../helpers/action-helper';
import axios from 'axios';

let authUrl = process.env.REACT_APP_API_URL + '/auth';

export const login = (login) => dispatch => {
    axios.post(`${authUrl}/login`, login)
        .then(response => {
            var payload = createUserPayload(response.data);
            persistToken(payload.token, payload.expiryDate, payload.user);
            dispatch({
                type: LOGIN,
                payload: payload
            })
        })
        .catch(error => {
            console.error(error);
            var error = error.response ? error.response.data : error.message;
            dispatch({
                type: LOGIN,
                error: error
            })
        })
};
  
export const register = (register) => dispatch => {
    axios.post(`${authUrl}/register`, register)
        .then(response => {
            var payload = createUserPayload(response.data);
            persistToken(payload.token, payload.expiryDate, payload.user);
            dispatch({
                type: REGISTER,
                payload: payload
            })
        })
        .catch(error => {
            console.error(error);
            var error = error.response ? error.response.data : error.message;
            dispatch({
                type: REGISTER,
                error: error
            })
        })
};

export const resetTokenValid = (userId, token) => dispatch => {
    var url = `${authUrl}/reset-token-valid/${userId}/${token}`;
    axios.get(url)
        .then(response => {
            dispatch({
                type: RESET_TOKEN_VALID,
                payload: response.data
            })
        })
        .catch(error => {
            console.error(error);
            dispatch({
                type: RESET_TOKEN_VALID,
                error: error.message
            })
        });
};