import { FETCH_CATEGORIES, NEW_CATEGORY, REMOVE_CATEGORY, UPDATE_CATEGORY, CLEAR_CATEGORIES, CATEGORY_ERROR } from '../actions/types';

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
        item: null
      };
    case NEW_CATEGORY:
      return {
        ...state,
        item: action.payload
      };
    case REMOVE_CATEGORY:
      return {
        ...state,
        item: action.payload
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        item: action.payload
      };
    case CLEAR_CATEGORIES:
      return {
        ...state,
        items: null,
        item: null
      };
    case CATEGORY_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}