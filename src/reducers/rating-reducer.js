import { FETCH_RATINGS, NEW_RATING, REMOVE_RATING, UPDATE_RATING, CLEAR_RATINGS, RATING_ERROR } from '../actions/types';

const initialState = {
  items: null,
  item: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATINGS:
      return {
        ...state,
        items: action.payload,
        item: null
      };
    case NEW_RATING:
      return {
        ...state,
        item: action.payload
      };
    case REMOVE_RATING:
      return {
        ...state,
        item: action.payload
      };
    case UPDATE_RATING:
      return {
        ...state,
        item: action.payload
      };
    case CLEAR_RATINGS:
      return {
        ...state,
        items: null,
        item: null
      };
    case RATING_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}