import { SEND_RESET_TOKEN } from './types';
import axios from 'axios';

let emailsUrl = process.env.REACT_APP_API_URL + '/emails';

export const sendResetToken = (email) => dispatch => {
    var data = { email };
    axios.post(`${emailsUrl}/send-reset-token`, data)
      .then(response => {
        dispatch({
          type: SEND_RESET_TOKEN,
          payload: response.data
        })
      })
      .catch(error => {
        console.error(error);
        dispatch({
          type: SEND_RESET_TOKEN,
          error: error.message
        })
      });
  }