import { FETCH_BOOKS, NEW_BOOK } from './types';
import * as moment from 'moment';

export const fetchBooks = () => dispatch => {
  fetch('http://128.199.129.60:5000/api/books')
    .then(res => res.json())
    .then(books =>
      dispatch({
        type: FETCH_BOOKS,
        payload: books.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf())
      })
    );
};

export const createBook = postData => dispatch => {
  fetch('http://128.199.129.60:5000/api/books', {
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