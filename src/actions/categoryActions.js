import { FETCH_CATEGORIES, NEW_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY } from './types';
import axios from 'axios';

export const fetchCategories = () => dispatch => {
  axios.get(process.env.REACT_APP_CATEGORY_API_URL)
  .then(response => {
    dispatch({
      type: FETCH_CATEGORIES,
      payload: response.data
    })
  })
  .catch(error => {
    console.log(error);
  })
};

export const createCategory = postData => dispatch => {
  axios.post(process.env.REACT_APP_CATEGORY_API_URL, postData)
    .then(response => {
      dispatch({
        type: NEW_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const updateCategory = postData => dispatch => {
  axios.put(process.env.REACT_APP_CATEGORY_API_URL, postData)
    .then(response => {
      dispatch({
        type: UPDATE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const removeCategory = id => dispatch => {
  axios.delete(process.env.REACT_APP_CATEGORY_API_URL + '/' + id)
    .then(response => {
      dispatch({
        type: REMOVE_CATEGORY,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};