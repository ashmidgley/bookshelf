import { LOGIN, REGISTER, SET_USER, CLEAR_USER, GET_USERS, UPDATE_USER, UPDATE_EMAIL, UPDATE_PASSWORD, DELETE_USER } from '../actions/types';

const initialState = {
  users: null,
  token: null,
  expiryDate: null,
  user: null,
  deletedUser: null,
  updatedUser: null,
  invalidAction: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      if(action.error) {
        return {
          ...state,
          error: action.error
        };
      }
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error
      };
    case REGISTER:
      if(action.error) {
        return {
          ...state,
          error: action.error
        };
      }
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error
      };
    case SET_USER:
      if(action.error) {
        return {
          ...state,
          error: action.error
        };
      }
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error
      };
    case CLEAR_USER:
      return {
        ...state,
        token: null,
        expiryDate: null,
        user: null,
        invalidAction: null,
        error: null
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        error: action.error
      };
    case UPDATE_USER:
      return {
        ...state,
        updatedUser: action.payload,
        error: action.error
      };
    case UPDATE_EMAIL:
      if(action.error) {
        return {
          ...state,
          error: action.error
        };
      }
      return {
        ...state,
        updatedUser: action.payload.user,
        invalidAction: action.payload.error
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedUser: action.payload,
        error: action.error
      };
    case DELETE_USER:
      return {
        ...state,
        deletedUser: action.payload,
        error: action.error
      };
    default:
      return state;
  }
}