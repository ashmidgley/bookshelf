import { LOGIN, REGISTER, RESET_TOKEN_VALID, UPDATE_PASSWORD, USER_ERROR, CLEAR_TOKEN } from './types';
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
            dispatch({
                type: USER_ERROR,
                error: error.response ? error.response.data : error.message
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
            dispatch({
                type: USER_ERROR,
                error: error.response ? error.response.data : error.message
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
                type: USER_ERROR,
                error: error.response ? error.response.data : error.message
            })
        });
};

export const updatePasswordUsingToken = (data) => dispatch => {
    axios.put(authUrl, data)
      .then(response => {
        dispatch({
          type: UPDATE_PASSWORD,
          payload: response.data
        })
      })
      .catch(error => {
        console.error(error);
        dispatch({
          type: USER_ERROR,
          error: error.response ? error.response.data : error.message
        })
      });
}

export const clearToken = () => dispatch => {
    dispatch({
        type: CLEAR_TOKEN
    })
}