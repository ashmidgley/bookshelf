import { combineReducers } from 'redux';
import bookReducer from './bookReducer';
import categoryReducer from './categoryReducer';
import ratingReducer from './ratingReducer';
import userReducer from './userReducer';

export default combineReducers({
  books: bookReducer,
  categories: categoryReducer,
  ratings: ratingReducer,
  user: userReducer
});