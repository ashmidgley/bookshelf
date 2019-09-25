import { FETCH_CATEGORIES, NEW_CATEGORY, REMOVE_CATEGORY, UPDATE_CATEGORY } from '../actions/types';

const initialState = {
  items: null,
  item: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        items: action.payload,
        item: {},
        error: action.error
      };
    case NEW_CATEGORY:
      return {
        ...state,
        item: action.payload,
        error: action.error
      };
    case REMOVE_CATEGORY:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }
    case UPDATE_CATEGORY:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }

    default:
      return state;
  }
}