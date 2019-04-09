import React, { Component } from 'react';
import './admin.css';
import { connect } from 'react-redux';
import BookActions from '../book-actions/book-actions';
import PropTypes from 'prop-types';

class Admin extends Component {

    render() {
        return (
            <div>
                <BookActions books={this.props.books} />
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