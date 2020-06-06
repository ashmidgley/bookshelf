import axios from 'axios';
import { createConfig } from '../helpers/action-helper';

let searchUrl = process.env.REACT_APP_API_URL + '/search';

export const searchBooks = (title, author, maxResults, token) => {
    var data = { title, author, maxResults };
    var config = createConfig(token);
    return new Promise(
      (resolve, reject) => {
        axios.post(searchUrl, data, config)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
            reject(error.message);
          })
    });
}

export const searchBooksByTitle = (title, maxResults, token) => {
    var data = { title, maxResults };
    var url = `${searchUrl}/title`
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

export const searchBooksByAuthor = (author, maxResults, token) => {
    var data = { author, maxResults };
    var url = `${searchUrl}/author`
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


