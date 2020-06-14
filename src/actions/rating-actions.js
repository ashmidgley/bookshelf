import axios from 'axios';
import { createConfig, getErrorMessage } from '../helpers/action-helper';

let ratingUrl = process.env.REACT_APP_API_URL + '/ratings';

export const fetchRatings = (userId) => {
  var url = `${ratingUrl}/user/${userId}`;
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

export const fetchCurrentUserRatings = (token) => {
  var url = `${ratingUrl}/user`;
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

export const getRating = (id) => {
  var url = `${ratingUrl}/${id}`;
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

export const createRating = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.post(ratingUrl, postData, config)
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

export const updateRating = (postData, token) => {
  var config = createConfig(token);
  return new Promise(
    (resolve, reject) => {
      axios.put(ratingUrl, postData, config)
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

export const removeRating = (id, token) => {
  var url = `${ratingUrl}/${id}`;
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