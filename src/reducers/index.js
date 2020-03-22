import { combineReducers } from 'redux';
import bookReducer from './book-reducer';
import categoryReducer from './category-reducer';
import ratingReducer from './rating-reducer';
import userReducer from './user-reducer';
import emailReducer from './email-reducer';

export default combineReducers({
  books: bookReducer,
  categories: categoryReducer,
  ratings: ratingReducer,
  user: userReducer,
  email: emailReducer
});