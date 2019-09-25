import { FETCH_RATINGS, NEW_RATING, UPDATE_RATING, REMOVE_RATING } from './types';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/ratings';
let config = {
  headers: {
    'X-Api-Key': process.env.REACT_APP_API_KEY
  }
}

export const fetchRatings = () => dispatch => {
  axios.get(url, config)
  .then(response => {
    dispatch({
      type: FETCH_RATINGS,
      payload: response.data
    })
  })
  .catch(error => {
    dispatch({
      type: FETCH_RATINGS,
      error: error.message
    })
  })
};

export const createRating = postData => dispatch => {
  axios.post(url, postData, config)
    .then(response => {
      dispatch({
        type: NEW_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: NEW_RATING,
        error: error.message
      })
    })
};

export const updateRating = postData => dispatch => {
  axios.put(url, postData, config)
    .then(response => {
      dispatch({
        type: UPDATE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: UPDATE_RATING,
        error: error.message
      })
    })
};

export const removeRating = id => dispatch => {
  axios.delete(url + '/' + id, config)
    .then(response => {
      dispatch({
        type: REMOVE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: REMOVE_RATING,
        error: error.message
      })
    })
};