import { LOGIN, REGISTER, CLEAR_USER } from './types';
import axios from 'axios';
import User from '../models/user';

let usersUrl = process.env.REACT_APP_API_URL + '/users';

export const login = (login) => dispatch => {
  axios.post(`${usersUrl}/login`, login)
    .then(response => {
      dispatch({
        type: LOGIN,
        payload: createPayload(response)
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
  axios.post(`${usersUrl}/register`, register)
    .then(response => {
      dispatch({
        type: REGISTER,
        payload: createPayload(response)
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

export const clearUser = () => dispatch => {
  dispatch({
      type: CLEAR_USER
  })
}

function createPayload(response) {
  var token = response.data.token;
  var payload = parseJwt(response.data.token);
  var expiryDate = payload.exp;
  var user = new User(parseInt(payload.Id), payload.Email, (payload.IsAdmin === 'True'));
  return { token, expiryDate, user };
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
};