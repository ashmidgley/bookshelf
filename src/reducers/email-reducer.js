import { SEND_RESET_TOKEN } from '../actions/types';

const initialState = {
  resetTokenSent: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_RESET_TOKEN:
      if(action.error) {
        return {
          ...state,
          error: action.error 
        };
      }
      
      return {
        ...state,
        resetTokenSent: action.payload.error == null,
        error: action.payload.error
      };
    default:
      return state;
  }
}