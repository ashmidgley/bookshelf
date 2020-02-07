import { LOGIN, REGISTER, SET_USER, CLEAR_USER, GET_USERS } from './types';
import axios from 'axios';
import User from '../models/user';

let usersUrl = process.env.REACT_APP_API_URL + '/users';

export const login = (login) => dispatch => {
  axios.post(`${usersUrl}/login`, login)
    .then(response => {
      var payload = createPayload(response);
      persistToken(payload.token, payload.expiryDate, payload.user);
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
  axios.post(`${usersUrl}/register`, register)
    .then(response => {
      var payload = createPayload(response);
      persistToken(payload.token, payload.expiryDate, payload.user);
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

export const setUser = (data) => dispatch => {
  dispatch({
    type: SET_USER,
    payload: data
  });
};

export const clearUser = () => dispatch => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiryDate');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userisAdmin');
  dispatch({
      type: CLEAR_USER
  })
}

export const fetchUsers = (token) => dispatch => {
  var config = createConfig(token);
  axios.get(usersUrl, config)
    .then(response => {
      dispatch({
        type: GET_USERS,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: GET_USERS,
        error: error.message
      })
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

function persistToken(token, expiryDate, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('expiryDate', expiryDate);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userIsAdmin', user.isAdmin);
}

function createConfig(token) {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  return config;
}