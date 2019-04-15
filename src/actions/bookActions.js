import { FETCH_BOOKS, NEW_BOOK, UPDATE_BOOK, REMOVE_BOOK } from './types';
import * as moment from 'moment';
import axios from 'axios';

export const fetchBooks = () => dispatch => {
  axios.get(process.env.REACT_APP_BOOKS_API_URL)
    .then(response => {
      dispatch({
        type: FETCH_BOOKS,
        payload: response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf())
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const createBook = postData => dispatch => {
  axios.post(process.env.REACT_APP_BOOKS_API_URL, postData)
    .then(response => {
      dispatch({
        type: NEW_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const updateBook = postData => dispatch => {
  axios.put(process.env.REACT_APP_BOOKS_API_URL, postData)
    .then(response => {
      dispatch({
        type: UPDATE_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};

export const removeBook = id => dispatch => {
  axios.delete(process.env.REACT_APP_BOOKS_API_URL + '/' + id)
    .then(response => {
      dispatch({
        type: REMOVE_BOOK,
        payload: response.data
      })
    })
    .catch(error => {
      console.log(error);
    })
};