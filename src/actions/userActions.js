import { LOGIN, REGISTER, LOGOUT } from './types';
import axios from 'axios';

let usersUrl = process.env.REACT_APP_API_URL + '/users';

export const login = (login) => dispatch => {
  axios.post(`${usersUrl}/login`, login)
    .then(response => {
      dispatch({
        type: LOGIN,
        payload: response.data
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
        payload: response.data
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

export const logout = () => dispatch => {
  dispatch({
      type: LOGOUT
  })
}