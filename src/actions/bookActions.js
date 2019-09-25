import { FETCH_BOOKS, NEW_BOOK, UPDATE_BOOK, REMOVE_BOOK } from './types';
import * as moment from 'moment';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/books';
let config = {
  headers: {
    'X-Api-Key': process.env.REACT_APP_API_KEY
  }
}

export const fetchBooks = () => dispatch => {
  axios.get(url, config)
    .then(response => {
      dispatch({
        type: FETCH_BOOKS,
        payload: response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf())
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: FETCH_BOOKS,
        error: error.message
      })
    })
};

export const createBook = postData => dispatch => {
  axios.post(url, postData, config)
    .then(response => {
      dispatch({
        type: NEW_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: NEW_BOOK,
        error: error.message
      })
    })
};

export const updateBook = postData => dispatch => {
  axios.put(url, postData, config)
    .then(response => {
      dispatch({
        type: UPDATE_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: UPDATE_BOOK,
        error: error.message
      })
    })
};

export const removeBook = id => dispatch => {
  axios.delete(url + '/' + id, config)
    .then(response => {
      dispatch({
        type: REMOVE_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: REMOVE_BOOK,
        error: error.message
      })
    })
};