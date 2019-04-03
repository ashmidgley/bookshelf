import { combineReducers } from 'redux';
import bookReducer from './bookReducer';
import categoryReducer from './categoryReducer';

export default combineReducers({
  books: bookReducer,
  categories: categoryReducer
});