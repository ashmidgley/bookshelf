import { FETCH_CATEGORIES, NEW_CATEGORY, REMOVE_CATEGORY, UPDATE_CATEGORY } from '../actions/types';

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        items: action.payload
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
      }
    case UPDATE_CATEGORY:
      return {
        ...state,
        item: action.payload
      }

    default:
      return state;
  }
}