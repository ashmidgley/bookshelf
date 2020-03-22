import { GET_USERS, UPDATE_USER, UPDATE_EMAIL, UPDATE_PASSWORD, DELETE_USER, SET_USER, CLEAR_USER } from './types';
import { createConfig } from '../helpers/action-helper';
import axios from 'axios';

let usersUrl = process.env.REACT_APP_API_URL + '/users';

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
    });
}

export const updateUser = (user, token) => dispatch => {
  var config = createConfig(token);
  axios.put(usersUrl, user, config)
    .then(response => {
      dispatch({
        type: UPDATE_USER,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_USER,
        error: error.message
      })
    });
}

export const updateEmail = (data, token) => dispatch => {
  var config = createConfig(token);
  axios.put(`${usersUrl}/email`, data, config)
    .then(response => {
      dispatch({
        type: UPDATE_EMAIL,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_EMAIL,
        error: error.message
      })
    });
}

export const updatePassword = (data, token) => dispatch => {
  var config = createConfig(token);
  axios.put(`${usersUrl}/password`, data, config)
    .then(response => {
      dispatch({
        type: UPDATE_PASSWORD,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_PASSWORD,
        error: error.message
      })
    });
}

export const deleteUser = (userId, token) => dispatch => {
  var config = createConfig(token);
  var url = `${usersUrl}?id=${userId}`;
  axios.delete(url, config)
    .then(response => {
      dispatch({
        type: DELETE_USER,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: DELETE_USER,
        error: error.message
      })
    });
}

export const updatePasswordUsingToken = (data) => dispatch => {
  axios.put(`${usersUrl}/password/token`, data)
    .then(response => {
      dispatch({
        type: UPDATE_PASSWORD,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_PASSWORD,
        error: error.message
      })
    });
}

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