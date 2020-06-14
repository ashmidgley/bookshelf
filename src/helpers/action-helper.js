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
    // Network error
    return error.message;
  }
  
  if(error.response.data) {
    // 400: Bad request
    return error.response.data;
  }

  // 500: Internal server error
  return error.response.statusText;
}