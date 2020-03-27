import { LOGIN, REGISTER, SET_USER, CLEAR_USER, GET_USERS, UPDATE_USER, UPDATE_EMAIL, UPDATE_PASSWORD, DELETE_USER, RESET_TOKEN_VALID, USER_ERROR } from '../actions/types';

const initialState = {
  users: null,
  token: null,
  expiryDate: null,
  user: null,
  deletedUser: null,
  updatedUser: null,
  resetTokenValid: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user
      };
    case REGISTER:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user
      };
    case GET_USERS:
        return {
          ...state,
          users: action.payload
        };
    case UPDATE_USER:
      return {
        ...state,
        updatedUser: action.payload
      };
    case UPDATE_EMAIL:
      return {
        ...state,
        updatedUser: action.payload
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedUser: action.payload
      };
    case DELETE_USER:
      return {
        ...state,
        deletedUser: action.payload
      };
    case SET_USER:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user
      };
    case CLEAR_USER:
      return {
        ...state,
        token: null,
        expiryDate: null,
        user: null,
        error: null
      };
    case RESET_TOKEN_VALID:
      return {
        ...state,
        resetTokenValid: action.payload
      };
    case USER_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}