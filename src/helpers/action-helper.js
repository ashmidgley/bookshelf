import { parseJwt } from './auth-helper';

export const createConfig = (token) => {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  return config;
}

export const createUserPayload = (token) => {
  var payload = parseJwt(token);
  var expiryDate = payload.exp;
  var id = parseInt(payload.Id);
  return { token, expiryDate, id };
}

export const getErrorMessage = (error) => {
  if(!error.response) {
    return error.message;
  }
  
  switch(error.response.status) {
    case 400:
      return error.response.data;
    case 405:
      return "Method Not Allowed. Please confirm you have set the correct API URL in the configuration file.";
    case 500:
      return error.response.statusText;
    case 502:
      return "Request failed due to Bad Gateway";
    case 504:
      return "Request failed due to Gateway Time-out";
    default:
      return "An unexpected error occurred. Please refresh the page and try again.";
  }
}