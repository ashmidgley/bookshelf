import React, { Component } from 'react';
import './admin.css';
import { connect } from 'react-redux';
import BookActions from '../book-actions/book-actions';
import CategoryActions from '../category-actions/category-actions';
import RatingActions from '../rating-actions/rating-actions';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

class Admin extends Component {

    render() {
        return (
            <div className="column is-8 is-offset-2">
                <Helmet>
                    <title>Bookshelf | Admin</title>
                </Helmet>
                <div className="card">
                    <div className="card-content book-action-content">
                        <div className="media">
                            <div className="admin-image-header-container">
                                <FontAwesomeIcon icon={faEye} className="admin-icon" size="lg"/>
                            </div>
                        </div>
                        <BookActions />
                        <hr />
                        <CategoryActions />
                        <hr />
                        <RatingActions />
                    </div>
                </div>
            </div>
        );
    }
}

Admin.propTypes = {
    books: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    books: state.books.items
  });

export default connect(mapStateToProps)(Admin);