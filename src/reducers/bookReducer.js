import { FETCH_BOOKS, NEW_BOOK, REMOVE_BOOK, UPDATE_BOOK } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_BOOKS:
      return {
        ...state,
        items: action.payload,
        item: {}
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
      }
    case UPDATE_BOOK:
      return {
        ...state,
        item: action.payload
      }
    default:
      return state;
  }
}