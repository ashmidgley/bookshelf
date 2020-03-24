import { FETCH_BOOKS, NEW_BOOK, REMOVE_BOOK, UPDATE_BOOK, CLEAR_BOOKS } from '../actions/types';

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
        item: null,
        error: action.error
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
      };
    case UPDATE_BOOK:
      return {
        ...state,
        item: action.payload,
        error: action.error
      };
    case CLEAR_BOOKS:
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