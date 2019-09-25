import React, { Component } from 'react';
import './book-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeBook } from '../../actions/bookActions';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class BookActions extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedBook: null,
            password: '',
            passwordError: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(Object.entries(nextProps.removedBook).length !== 0) {
            var oldBook = this.props.books.find(b => b.id == nextProps.removedBook.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedBook: null
            })
        }
    }

    openModal = (id) => {
        this.setState({
            selectedBook: id,
            modalIsOpen: true,
            success: false,
            password: '',
            passwordError: false
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        if (this.state.password.localeCompare(process.env.REACT_APP_FORM_PASSWORD) == 0) {
            this.props.removeBook(this.state.selectedBook);
        } else {
            this.setState({
                passwordError: true,
                submitting: false
            });
        }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                    <form onSubmit={this.handleSubmit}>
                        <label className="label">Password</label>
                        <input className={this.state.passwordError ? "input is-danger" : "input"} type="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Enter password" />
                        <div className="password-modal-actions">
                            <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">Submit</button>
                            <button id="cancel" className="button" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
                <h1 className="title">Books</h1>
                {this.state.success ? 
                    <div className="notification is-primary">Successfully removed entry.</div>
                    :
                    null
                }
                <div className="admin-table">
                    <table className="table is-fullwidth is-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Rating</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.books.map(book =>
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>
                                        {this.props.categories.find(c => c.id === book.categoryId)
                                        ? 
                                        this.props.categories.find(c => c.id === book.categoryId).description
                                        :
                                        '-'}
                                    </td>
                                    <td>
                                        {this.props.ratings.find(r => r.id === book.ratingId)
                                        ? 
                                        this.props.ratings.find(r => r.id === book.ratingId).description
                                        :
                                        '-'}
                                    </td>
                                    <td className="has-text-centered">
                                        <Link to={'/admin/book-form/' + book.id}><button className="button is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                    </td>
                                    <td className="has-text-centered">
                                        <button onClick={() => this.openModal(book.id)} className="button is-outlined" disabled={this.state.submitting}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Link to={'/admin/book-form'}><button className="button is-outlined">Add</button></Link>
                </div>
            </div>
        )
    }
}

  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items,
    removedBook: state.books.item
  });

export default connect(mapStateToProps, {removeBook})(BookActions);