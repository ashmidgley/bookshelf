import { FETCH_BOOKS, NEW_BOOK, UPDATE_BOOK, REMOVE_BOOK } from './types';
import * as moment from 'moment';
import axios from 'axios';

const url = 'http://128.199.129.60:5000/api/books';

export const fetchBooks = () => dispatch => {
  axios.get(url)
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
  axios.post(url, postData)
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
  axios.put(url, postData)
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
  axios.delete(url + '/' + id)
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