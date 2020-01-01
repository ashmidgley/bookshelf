import { FETCH_RATINGS, NEW_RATING, UPDATE_RATING, REMOVE_RATING } from './types';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/ratings';

export const fetchRatings = (userId, token) => dispatch => {
  var config = createConfig(token);
  axios.get(url + `/user/${userId}`, config)
  .then(response => {
    dispatch({
      type: FETCH_RATINGS,
      payload: response.data
    })
  })
  .catch(error => {
    console.error(error);
    dispatch({
      type: FETCH_RATINGS,
      error: error.message
    })
  })
};

export const createRating = (postData, token) => dispatch => {
  var config = createConfig(token);
  axios.post(url, postData, config)
    .then(response => {
      dispatch({
        type: NEW_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: NEW_RATING,
        error: error.message
      })
    })
};

export const updateRating = (postData, token) => dispatch => {
  var config = createConfig(token);
  axios.put(url, postData, config)
    .then(response => {
      dispatch({
        type: UPDATE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_RATING,
        error: error.message
      })
    })
};

export const removeRating = (id, token) => dispatch => {
  var config = createConfig(token);
  axios.delete(url + '/' + id, config)
    .then(response => {
      dispatch({
        type: REMOVE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: REMOVE_RATING,
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