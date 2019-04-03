import { FETCH_CATEGORIES } from './types';

export const fetchCategories = () => dispatch => {
  fetch('http://128.199.129.60:5000/api/categories')
    .then(res => res.json())
    .then(categories =>
      dispatch({
        type: FETCH_CATEGORIES,
        payload: categories
      })
    );
};