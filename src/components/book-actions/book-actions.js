import React, { Component } from 'react';
import './book-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeBook } from '../../actions/bookActions';
import PropTypes from 'prop-types';

class BookActions extends Component {

    constructor(props){
        super(props);
        this.state = {
            submitting: false,
            success: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.removedBook) {
            var oldBook = this.props.books.find(b => b.id == nextProps.removedBook.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books.splice(i, 1);
            this.setState({
                submitting: false,
                success: true
            })
        }
    }

    removeBook(id) {
        this.setState({
            submitting: true,
            success: false
        });
        this.props.removeBook(id);
    }

    render() {
        return (
            <div>
                <h1 className="title">Books</h1>
                {this.state.success ? 
                    <div className="notification is-primary">Successfully removed entry.</div>
                    :
                    null
                }
                <table className="table is-fullwidth is-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.books.map(book =>
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td className="has-text-centered">
                                    <Link to={'/admin/book-form/' + book.id}><button className="button is-info is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                </td>
                                <td className="has-text-centered">
                                    <button onClick={() => this.removeBook(book.id)} className="button is-danger is-outlined" disabled={this.state.submitting}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <Link to={'/admin/book-form'}><button className="button is-success is-outlined">Add</button></Link>
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