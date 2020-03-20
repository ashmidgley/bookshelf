import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { customStyles } from '../../custom-modal';
import { fetchBooks, removeBook } from '../../actions/bookActions';

class ManageBooks extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedBookId: null,
            loading: true,
            modalIsOpen: false,
            submitting: false,
            success: false
        }
    }

    componentDidMount() {
        if(!this.props.books) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books))
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
        this.setState({
            modalIsOpen: false
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitting: true
        });

        var token = localStorage.getItem('token');
        this.props.removeBook(this.state.selectedBookId, token);
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
                        {
                            this.state.success && this.props.books.length &&
                            <div className="notification is-primary">Successfully removed entry.</div>
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
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.books.map(book =>
                                            <tr key={book.id}>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
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
    removedBook: state.books.item
});

export default connect(mapStateToProps, {fetchBooks, removeBook})(ManageBooks);