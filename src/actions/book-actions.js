import { FETCH_BOOKS, NEW_BOOK, UPDATE_BOOK, REMOVE_BOOK, CLEAR_BOOKS, BOOK_ERROR, CLEAR_ERROR } from './types';
import { createConfig } from '../helpers/action-helper';
import moment from 'moment';
import axios from 'axios';

let url = process.env.REACT_APP_API_URL + '/books';

export const fetchBooks = (userId) => dispatch => {
  axios.get(url + `/user/${userId}`)
    .then(response => {
      dispatch({
        type: FETCH_BOOKS,
        payload: response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf())
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: BOOK_ERROR,
        error: error.response ? error.response.data : error.message
      })
    })
};

export const createBook = (postData, token) => dispatch => {
  var config = createConfig(token);
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
        type: BOOK_ERROR,
        error: error.response ? error.response.data : error.message
      })
    })
};

export const updateBook = (postData, token) => dispatch => {
  var config = createConfig(token);
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
        type: BOOK_ERROR,
        error: error.response ? error.response.data : error.message
      })
    })
};

export const removeBook = (id, token) => dispatch => {
  var config = createConfig(token);
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
        type: BOOK_ERROR,
        error: error.response ? error.response.data : error.message
      })
    })
};

export const clearBooks = () => dispatch => {
  dispatch({
    type: CLEAR_BOOKS
  })
}

export const clearError = () => dispatch => {
  dispatch({
    type: CLEAR_ERROR
  })
}