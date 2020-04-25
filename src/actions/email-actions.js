import axios from 'axios';

let emailUrl = process.env.REACT_APP_API_URL + '/emails';

export const sendResetToken = (email) => {
  var url = `${emailUrl}/send-reset-token`;
  var data = { email };
  return new Promise(
    (resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error(error);
          var message = error.response ? error.response.data : error.message;
          reject(message);
        });
  });
}