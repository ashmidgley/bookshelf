import { LOGIN, REGISTER } from '../actions/types';

const initialState = {
  token: null,
  user: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        error: action.error,
      };
    case REGISTER:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        error: action.error,
      };
    default:
      return state;
  }
}