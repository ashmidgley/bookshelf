import { SEND_RESET_TOKEN } from '../actions/types';

const initialState = {
  resetTokenSent: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_RESET_TOKEN:
      return {
        ...state,
        resetTokenSent: action.payload ? action.payload.error == null : false,
        error: action.payload ? action.payload.error : action.error
      };
    default:
      return state;
  }
}