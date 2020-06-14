import axios from 'axios';
import { createConfig, getErrorMessage } from '../helpers/action-helper';

let categoryUrl = process.env.REACT_APP_API_URL + '/categories';

export const fetchCategories = (userId) => {
  var url = `${categoryUrl}/user/${userId}`;
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
};

export const fetchCurrentUserCategories = (token) => {
  var url = `${categoryUrl}/user`;
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.get(url, config)
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

export const getCategory = (id) => {
  var url = `${categoryUrl}/${id}`;
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

export const createCategory = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.post(categoryUrl, postData, config)
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

export const updateCategory = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.put(categoryUrl, postData, config)
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

export const removeCategory = (id, token) => {
  var url = `${categoryUrl}/${id}`;
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