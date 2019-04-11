import React, { Component } from 'react';
import './book-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeBook } from '../../actions/bookActions';
import PropTypes from 'prop-types';

class BookActions extends Component {

    componentWillReceiveProps(nextProps) {
        if(nextProps.removedBook) {
            var oldBook = this.props.books.find(b => b.id == nextProps.removedBook.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books.splice(i, 1);
            this.forceUpdate();
        }
    }

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
                        <h1 className="title">Books</h1>
                        <table className="table is-fullwidth is-bordered">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.books.map(book =>
                                    <tr key={book.id}>
                                        <td>{book.id}</td>
                                        <td>{book.title}</td>
                                        <td className="has-text-centered"><Link to={'/admin/book-form/' + book.id} className="button is-info is-outlined">Edit</Link></td>
                                        <td className="has-text-centered"><button onClick={() => this.props.removeBook(book.id)} className="button is-danger is-outlined">Delete</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div>
                            <Link to={'/admin/book-form'}><button className="button is-success is-outlined">Add</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


BookActions.propTypes = {
    books: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    books: state.books.items,
    removedBook: state.books.item
  });

export default connect(mapStateToProps, {removeBook})(BookActions);