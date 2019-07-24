import { FETCH_RATINGS, NEW_RATING, UPDATE_RATING, REMOVE_RATING } from './types';
import axios from 'axios';

export const fetchRatings = () => dispatch => {
  axios.get(process.env.REACT_APP_RATING_API_URL)
  .then(response => {
    dispatch({
      type: FETCH_RATINGS,
      payload: response.data
    })
  })
  .catch(error => {
    console.log(error);
  })
};

export const createRating = postData => dispatch => {
  axios.post(process.env.REACT_APP_RATING_API_URL, postData)
    .then(response => {
      dispatch({
        type: NEW_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const updateRating = postData => dispatch => {
  axios.put(process.env.REACT_APP_RATING_API_URL, postData)
    .then(response => {
      dispatch({
        type: UPDATE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const removeRating = id => dispatch => {
  axios.delete(process.env.REACT_APP_RATING_API_URL + '/' + id)
    .then(response => {
      dispatch({
        type: REMOVE_RATING,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};