import { FETCH_RATINGS, NEW_RATING, REMOVE_RATING, UPDATE_RATING } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATINGS:
      return {
        ...state,
        items: action.payload,
        item: {}
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
      }
    case UPDATE_RATING:
      return {
        ...state,
        item: action.payload
      }

    default:
      return state;
  }
}