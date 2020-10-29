import jwt_decode from "jwt-decode";

export const parseUser = (token) => {
  var data = jwt_decode(token);
  var user = {
    id: parseInt(data.Id),
    email: data.Email,
    isAdmin: data.IsAdmin === "True",
  };
  return user;
};

export const persistToken = (token, expiryDate) => {
  localStorage.setItem("token", token);
  localStorage.setItem("expiryDate", expiryDate);
};

export const tokenExpired = (expiryDate) => {
  var expiry = new Date(parseFloat(expiryDate) * 1000);
  var current = new Date();
  return expiry < current;
};
