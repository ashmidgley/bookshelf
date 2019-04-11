import { FETCH_CATEGORIES } from './types';
import axios from 'axios';

const url = 'http://128.199.129.60:5000/api/categories';

export const fetchCategories = () => dispatch => {
  axios.get(url)
  .then(response => {
    dispatch({
      type: FETCH_CATEGORIES,
      payload: response.data
    })
  })
  .catch(error => {
    console.log(error);
  })
};