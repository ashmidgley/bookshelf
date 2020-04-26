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

  var user = {
    id: parseInt(payload.Id),
    email: payload.Email,
    isAdmin: payload.IsAdmin === 'True'
  };

  return { token, expiryDate, user };
}