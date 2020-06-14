import axios from 'axios';
import moment from 'moment';
import { createConfig, getErrorMessage } from '../helpers/action-helper';

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
          var message = getErrorMessage(error);
          reject(message);
        })
    });
};

export const fetchCurrentUserBooks = (token) => {
  var url = `${bookUrl}/user`;
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.get(url, config)
        .then(response => {
          var data = response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          var message = getErrorMessage(error);
          reject(message);
        })
    });
};

export const getBook = (id) => {
  var url = `${bookUrl}/${id}`;
  return new Promise(
    (resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          var message = getErrorMessage(error);
          reject(message);
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
            var message = getErrorMessage(error);
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
          var message = getErrorMessage(error);
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
          var message = getErrorMessage(error);
          reject(message);
        })
  });
};