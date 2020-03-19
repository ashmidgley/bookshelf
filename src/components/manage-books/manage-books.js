import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { customStyles } from '../../custom-modal';
import { fetchBooks, removeBook } from '../../actions/bookActions';
import { fetchCategories } from '../../actions/categoryActions';
import { fetchRatings } from '../../actions/ratingActions';

class ManageBooks extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedBookId: null,
            loading: true
        }
    }

    componentDidMount() {
        if(!this.props.books || !this.props.categories || !this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
            this.props.fetchCategories(id);
            this.props.fetchRatings(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings))
            this.setState({
                loading: false
        });

        if(nextProps.removedBook) {
            var oldBook = this.props.books.find(b => b.id === nextProps.removedBook.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedBookId: null
            })
        }
    }

    openModal = (id) => {
        this.setState({
            selectedBookId: id,
            modalIsOpen: true,
            success: false,
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        this.props.removeBook(this.state.selectedBookId, this.props.token);
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container">
                <Helmet>
                    <title>Bookshelf | Manage Books</title>
                </Helmet>
                <div className="card form-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="image-header-container">
                                <FontAwesomeIcon icon={faEye} className="eye-icon" size="lg"/>
                            </div>
                        </div>
                        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                            <form onSubmit={this.handleSubmit}>
                                <div>Are you sure you would like to delete this book?</div>
                                <div className="modal-actions">
                                    <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">
                                        Confirm
                                    </button>
                                    <button id="cancel" className="button" onClick={this.closeModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Modal>
                        <h1 className="title">Books</h1>
                        {this.state.success && this.props.books.length ? 
                            <div className="notification is-primary">Successfully removed entry.</div>
                            :
                            null
                        }
                        <div style={{ 'marginBottom': '25px' }}>   
                            <Link to={'/book-form'}>
                                <button className="button is-outlined">Add</button>
                            </Link>
                        </div>
                        {!this.props.books.length ?
                            <div className="notification is-link">
                                No books to display.
                            </div>
                            :
                            <div className="form-table">
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
                                                    <Link to={'/book-form/' + book.id}><button className="button is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                                </td>
                                                <td className="has-text-centered">
                                                    <button onClick={() => this.openModal(book.id)} className="button is-outlined" disabled={this.state.submitting}>Delete</button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items,
    removedBook: state.books.item,
    token: state.user.token
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings, removeBook})(ManageBooks);