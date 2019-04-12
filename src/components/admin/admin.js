import React, { Component } from 'react';
import './admin.css';
import { connect } from 'react-redux';
import BookActions from '../book-actions/book-actions';
import CategoryActions from '../category-actions/category-actions';
import PropTypes from 'prop-types';

class Admin extends Component {

    render() {
        return (
            <div className="column is-8 is-offset-2">
                <div className="card">
                    <div className="card-content book-action-content">
                        <div className="media">
                            <div className="image-header-container">
                                <img src="/images/plus.png" className="image-header" alt="Plus emoji" />
                            </div>
                        </div>
                        <BookActions />
                        <hr />
                        <CategoryActions />
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