import { FETCH_TOKEN } from './types';
import axios from 'axios';

let tokenUrl = process.env.REACT_APP_API_URL + '/token';

export const fetchToken = (login) => dispatch => {
    axios.post(tokenUrl, login)
    .then(response => {
      dispatch({
        type: FETCH_TOKEN,
        payload: response.data
      })
    })
    .catch(error => {
      console.error(error);
      dispatch({
        type: FETCH_TOKEN,
        error: error.message
      })
    })
};