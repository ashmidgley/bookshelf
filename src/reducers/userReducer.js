import { LOGIN, REGISTER, SET_USER, CLEAR_USER } from '../actions/types';

const initialState = {
  token: null,
  expiryDate: null,
  user: null,
  invalidAction: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error,
        error: action.error,
      };
    case REGISTER:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error,
        error: action.error
      };
    case SET_USER:
      return {
        ...state,
        token: action.payload.token,
        expiryDate: action.payload.expiryDate,
        user: action.payload.user,
        invalidAction: action.payload.error,
        error: action.error,
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
    default:
      return state;
  }
}