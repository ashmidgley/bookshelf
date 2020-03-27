import { FETCH_CATEGORIES, NEW_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY, CLEAR_CATEGORIES, CATEGORY_ERROR } from './types';
import { createConfig } from '../helpers/action-helper';
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
      type: CATEGORY_ERROR,
      error: error.response ? error.response.data : error.message
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
        type: CATEGORY_ERROR,
        error: error.response ? error.response.data : error.message
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
        type: CATEGORY_ERROR,
        error: error.response ? error.response.data : error.message
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
        type: CATEGORY_ERROR,
        error: error.response ? error.response.data : error.message
      })
    })
};

export const clearCategories = () => dispatch => {
  dispatch({
    type: CLEAR_CATEGORIES
  })
}