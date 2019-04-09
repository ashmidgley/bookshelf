import { FETCH_BOOKS, NEW_BOOK, UPDATE_BOOK, REMOVE_BOOK } from './types';
import * as moment from 'moment';

const url = 'http://128.199.129.60:5000/api/books';

export const fetchBooks = () => dispatch => {
  fetch(url)
    .then(res => res.json())
    .then(books =>
      dispatch({
        type: FETCH_BOOKS,
        payload: books.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf())
      })
    );
};

export const createBook = postData => dispatch => {
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(book =>
      dispatch({
        type: NEW_BOOK,
        payload: book
      })
    );
};

export const updateBook = postData => dispatch => {
  fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(book =>
      dispatch({
        type: UPDATE_BOOK,
        payload: book
      })
    );
};

export const removeBook = id => dispatch => {
  fetch(url + '/' + id, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(book =>
      dispatch({
        type: REMOVE_BOOK,
        payload: book
      })
    );
};