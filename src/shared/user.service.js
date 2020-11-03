import axios from "axios";
import { createConfig } from "./token.service";
import { getErrorMessage } from "./utils.service";

let userUrl = process.env.REACT_APP_API_URL + "/users";

export const fetchUsers = (token) => {
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .get(userUrl, config)
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

export const getUser = (id, token) => {
  var url = `${userUrl}/${id}`;
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
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

export const updateUser = (user, token) => {
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .put(userUrl, user, config)
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

export const updateEmail = (data, token) => {
  var url = `${userUrl}/email`;
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, config)
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

export const updatePassword = (data, token) => {
  var url = `${userUrl}/password`;
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, config)
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

export const deleteUser = (userId, token) => {
  var url = `${userUrl}/${userId}`;
  var config = createConfig(token);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, config)
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

export const clearUser = () => {
  return new Promise((resolve) => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    resolve();
  });
};
