import axios from "axios";
import { getErrorMessage } from "./utils.service";
import { persistToken, createUserPayload } from "./token.service";
import { identifyUserWithToken } from "./analytics.service";

let authUrl = process.env.REACT_APP_API_URL + "/auth";

export const login = (login) => {
  var url = `${authUrl}/login`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, login)
      .then((response) => {
        var payload = createUserPayload(response.data);
        persistToken(payload.token, payload.expiryDate);
        identifyUserWithToken(payload.token);
        resolve(payload.id);
      })
      .catch((error) => {
        console.error(error);
        var message = getErrorMessage(error);
        reject(message);
      });
  });
};

export const register = (register) => {
  var url = `${authUrl}/register`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, register)
      .then((response) => {
        var payload = createUserPayload(response.data);
        persistToken(payload.token, payload.expiryDate);
        identifyUserWithToken(payload.token);
        resolve(payload.id);
      })
      .catch((error) => {
        console.error(error);
        var message = getErrorMessage(error);
        reject(message);
      });
  });
};

export const resetTokenValid = (userId, token) => {
  var url = `${authUrl}/reset-token-valid/${userId}/${token}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        var message = getErrorMessage(error);
        reject(message);
      });
  });
};

export const updatePasswordUsingToken = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(authUrl, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        var message = getErrorMessage(error);
        reject(message);
      });
  });
};
