import { FETCH_CATEGORIES, NEW_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY } from './types';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/categories';
let config = {
  headers: {
    'X-Api-Key': process.env.REACT_APP_API_KEY
  }
}

export const fetchCategories = () => dispatch => {
  axios.get(url, config)
  .then(response => {
    dispatch({
      type: FETCH_CATEGORIES,
      payload: response.data
    })
  })
  .catch(error => {
    dispatch({
      type: FETCH_CATEGORIES,
      error: error.message
    })
  })
};

export const createCategory = postData => dispatch => {
  axios.post(url, postData, config)
    .then(response => {
      dispatch({
        type: NEW_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: NEW_CATEGORY,
        error: error.message
      })
    })
};

export const updateCategory = postData => dispatch => {
  axios.put(url, postData, config)
    .then(response => {
      dispatch({
        type: UPDATE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: UPDATE_CATEGORY,
        error: error.message
      })
    })
};

export const removeCategory = id => dispatch => {
  axios.delete(url + '/' + id, config)
    .then(response => {
      dispatch({
        type: REMOVE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: REMOVE_CATEGORY,
        error: error.message
      })
    })
};