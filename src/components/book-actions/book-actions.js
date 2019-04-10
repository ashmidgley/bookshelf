import React, { Component } from 'react';
import './book-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeBook } from '../../actions/bookActions';
import PropTypes from 'prop-types';

class BookActions extends Component {

    removeBook = (book) => {
        this.props.removeBook(book.id);
        var i = this.props.books.indexOf(book);
        this.props.books.splice(i, 1);
        this.forceUpdate()
    }

    render() {
        return (
            <div>
                <h1>Books</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.books.map(book =>
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td><Link to={'/admin/book-form/' + book.id}><button className="button is-info">Update</button></Link></td>
                                <td><button className="button is-danger" onClick={() => this.removeBook(book)}>Delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Link to={'/admin/book-form'}><button className="button is-success">Add</button></Link>
            </div>
        )
    }
}


BookActions.propTypes = {
    books: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    books: state.books.items
  });

export default connect(mapStateToProps, {removeBook})(BookActions);