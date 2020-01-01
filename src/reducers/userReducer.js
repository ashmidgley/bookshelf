import { FETCH_TOKEN } from '../actions/types';

const initialState = {
  token: null,
  user: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TOKEN:
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