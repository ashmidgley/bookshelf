import axios from 'axios';
import moment from 'moment';
import { createConfig } from '../helpers/action-helper';

let bookUrl = process.env.REACT_APP_API_URL + '/books';

export const fetchBooks = (userId) => {
  var url = `${bookUrl}/user/${userId}`;
  return new Promise(
    (resolve, reject) => {
      axios.get(url)
        .then(response => {
          var data = response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          var message = error.response ? error.response.data : error.message;
          reject(message);
        })
    });
};

export const getBook = (id, token) => {
  var url = `${bookUrl}/${id}`;
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.get(url, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          reject(error.message);
        })
  });
}

export const searchBooks = (title, author, maxResults, token) => {
  var url = `${bookUrl}/search`;
  var data = { title, author, maxResults };
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.post(url, data, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          reject(error.message);
        })
  });
}

export const createBook = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
        axios.post(bookUrl, postData, config)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
            var message = error.response ? error.response.data : error.message;
            reject(message);
          })
    });
};

export const updateBook = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.put(bookUrl, postData, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          var message = error.response ? error.response.data : error.message;
          reject(message);
        })
  });
};

export const removeBook = (id, token) => {
  var url = `${bookUrl}/${id}`;
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.delete(url, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          var message = error.response ? error.response.data : error.message;
          reject(message);
        })
  });
};