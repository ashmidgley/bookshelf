import { FETCH_BOOKS, NEW_BOOK, REMOVE_BOOK, UPDATE_BOOK, CLEAR_BOOKS, BOOK_ERROR, CLEAR_ERROR } from '../actions/types';

const initialState = {
  items: null,
  item: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_BOOKS:
      return {
        ...state,
        items: action.payload,
        item: null
      };
    case NEW_BOOK:
      return {
        ...state,
        item: action.payload
      };
    case REMOVE_BOOK:
      return {
        ...state,
        item: action.payload
      };
    case UPDATE_BOOK:
      return {
        ...state,
        item: action.payload
      };
    case CLEAR_BOOKS:
      return {
        ...state,
        items: null,
        item: null
      };
    case BOOK_ERROR:
      return {
        ...state,
        error: action.error
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}