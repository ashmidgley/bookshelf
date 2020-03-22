import { FETCH_CATEGORIES, NEW_CATEGORY, REMOVE_CATEGORY, UPDATE_CATEGORY, CLEAR_CATEGORIES } from '../actions/types';

const initialState = {
  items: null,
  item: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        items: action.payload,
        error: action.error,
        item: null
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
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        item: action.payload,
        error: action.error
      };
    case CLEAR_CATEGORIES:
      return {
        ...state,
        items: null,
        item: null,
        error: null
      };
    default:
      return state;
  }
}