import { FETCH_CATEGORIES, NEW_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY } from './types';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/categories';

export const fetchCategories = (userId) => dispatch => {
  axios.get(url + `/user/${userId}`)
  .then(response => {
    dispatch({
      type: FETCH_CATEGORIES,
      payload: response.data
    })
  })
  .catch(error => {
    console.error(error);
    dispatch({
      type: FETCH_CATEGORIES,
      error: error.message
    })
  })
};

export const createCategory = (postData, token) => dispatch => {
  var config = createConfig(token);
  axios.post(url, postData, config)
    .then(response => {
      dispatch({
        type: NEW_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: NEW_CATEGORY,
        error: error.message
      })
    })
};

export const updateCategory = (postData, token) => dispatch => {
  var config = createConfig(token);
  axios.put(url, postData, config)
    .then(response => {
      dispatch({
        type: UPDATE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_CATEGORY,
        error: error.message
      })
    })
};

export const removeCategory = (id, token) => dispatch => {
  var config = createConfig(token);
  axios.delete(url + '/' + id, config)
    .then(response => {
      dispatch({
        type: REMOVE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: REMOVE_CATEGORY,
        error: error.message
      })
    })
};

function createConfig(token) {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  return config;
}