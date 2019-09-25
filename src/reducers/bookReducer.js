import { FETCH_BOOKS, NEW_BOOK, REMOVE_BOOK, UPDATE_BOOK } from '../actions/types';

const initialState = {
  items: null,
  item: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_BOOKS:
      return {
        ...state,
        items: action.payload,
        error: action.error,
        item: null
      };
    case NEW_BOOK:
      return {
        ...state,
        item: action.payload,
        error: action.error
      };
    case REMOVE_BOOK:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }
    case UPDATE_BOOK:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }
    default:
      return state;
  }
}