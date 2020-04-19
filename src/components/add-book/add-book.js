import React from 'react';
import './add-books.css';
import Loading from '../loading/loading';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { searchBooks, createBook, fetchBooks, clearError } from '../../actions/book-actions';
import { fetchCategories } from '../../actions/category-actions';
import { fetchRatings } from '../../actions/rating-actions';

class AddBook extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBooks: null,
            searching: false,
            selectedBook: null,
            submitting: false,
            loading: true,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var userId = localStorage.getItem('userId');
        this.props.fetchBooks(userId);
        this.props.fetchCategories(userId);
        this.props.fetchRatings(userId);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings)) {
            this.setState({
                loading: false
            });
            return;
        } 

        if(nextProps.error) {
            this.setState({
                error: nextProps.error,
                submitting: false,
                loading: false
            });
            this.props.clearError();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (this.state.submitting && nextProps.book) {
            this.props.books.unshift(nextProps.book);
            this.setState({
                submitting: false,
                success: true
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    searchBooks = (title, author) => {
        let self = this;
        self.setState({
            searching: true,
            searchBooks: null,
            selectedBook: null
        });

        var token = localStorage.getItem('token');
        searchBooks(title, author, 3, token)
            .then(function(response) {
                self.setState({
                    searchBooks: response,
                    searching: false
                });
            })
            .catch(function(error) {
                self.setState({
                    error: error,
                    searching: false
                })
            });
    };

    bookSelected = (book) => {
        this.setState({
            selectedBook: book
        });
        window.scrollTo(0, 0);
    }

    back = () => {
        this.setState({
            searchBooks: null,
            selectedBook: null
        });
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var newBook = {
            userId: parseInt(localStorage.getItem('userId')),
            categoryId: values.categoryId,
            ratingId: values.ratingId,
            finishedOn: values.finishedOn,
            title: values.book.title,
            author: values.book.author,
            imageUrl: values.book.imageUrl,
            pageCount: values.pageCount,
            summary: values.book.summary
        };
        
        var token = localStorage.getItem('token');
        this.props.createBook(newBook, token);
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }
        
        return (
            <div className="column is-8 is-offset-2 form-container"> 
                <div className="card custom-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg"/>
                        </div>
                    </div>
                    {
                        this.state.success && 
                        <div className="notification is-success">
                            Successfully created new book. <Link to={`/review/${this.props.book.id}`}>View?</Link>
                        </div>
                    }
                    {
                        this.state.error && 
                        <div className="notification is-danger">{this.state.error}</div>
                    }
                        <Formik
                            initialValues=
                            {
                                {
                                    searchTitle: '',
                                    searchAuthor: '',
                                    book: null,
                                    finishedOn: '',
                                    categoryId: this.props.categories && this.props.categories.length ? this.props.categories[0].id : null,
                                    ratingId: this.props.ratings && this.props.ratings.length ? this.props.ratings[0].id : null,
                                }
                            }
                            validate={values => {
                                let errors = {};
                                if (!values.searchTitle)
                                    errors.searchTitle = 'Required';
                                if (!values.searchAuthor)
                                    errors.searchAuthor = 'Required';
                                if(!values.finishedOn) 
                                    errors.finishedOn = 'Required';
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                this.submitEntry(values);
                                setSubmitting(false);
                            }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                                <form className="form" onSubmit={handleSubmit}>
                                    {
                                        !this.state.selectedBook ?
                                        <div>
                                            <div className="field">
                                                <label className="label">Title</label>
                                                <div className="control">
                                                    <input className={errors.searchTitle && touched.searchTitle ? 'input is-danger' : 'input'} type="text" name="searchTitle" placeholder="Enter title" onChange={handleChange} onBlur={handleBlur} value={values.searchTitle} />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Author</label>
                                                <div className="control">
                                                    <input className={errors.searchAuthor && touched.searchAuthor ? 'input is-danger' : 'input'} type="text" name="searchAuthor" placeholder="Enter author" onChange={handleChange} onBlur={handleBlur} value={values.searchAuthor} />
                                                </div>
                                            </div>
                                            <div>
                                                <button 
                                                    className={this.state.searching ? "button is-link is-loading" : "button is-link"}
                                                    onClick={() => this.searchBooks(values.searchTitle, values.searchAuthor)}>
                                                    Search
                                                </button>
                                            </div>
                                            {
                                                this.state.searchBooks && this.state.searchBooks.length === 0 &&
                                                <div id="no-search-results" className="notification is-warning">
                                                    Search returned zero results. Please try again.
                                                </div>
                                            }
                                            {
                                                this.state.searchBooks && this.state.searchBooks.length > 0 &&
                                                <div>
                                                    <div id="search-books-container">
                                                        {this.state.searchBooks.map(book =>
                                                            <div 
                                                                key={this.state.searchBooks.indexOf(book)}
                                                                className={values.book && book === values.book ? "columns is-mobile custom-radio custom-radio-selected" : "columns is-mobile custom-radio"}> 
                                                                <div className="column is-1">
                                                                    <input className="custom-radio-input" type="radio" name="book" checked={values.book === book} onBlur={handleBlur}
                                                                    onChange={() => {setFieldValue('book', book)}} />
                                                                </div>
                                                                <div className="column is-10 has-text-centered">
                                                                    <p className="is-size-6">{book.title}</p>
                                                                    <p>{book.author}</p>
                                                                </div>
                                                                <div id="search-image-column" className="column is-1">
                                                                    <img src={book.imageUrl} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button className="button is-link" disabled={!values.book} 
                                                        onClick={() => this.bookSelected(values.book)}>
                                                        Next
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                        :
                                        <div>
                                            <button id="back-button" className="button" onClick={() => this.back()}>
                                                <FontAwesomeIcon icon={faArrowLeft}/> Back
                                            </button>
                                            <div className="field">
                                                <label className="label">Finished On</label>
                                                <div className="control">
                                                    <input className={errors.finishedOn && touched.finishedOn ? 'input is-danger' : 'input'} type="date" name="finishedOn" onChange={handleChange} onBlur={handleBlur} value={values.finishedOn} />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Category</label>
                                                <div className="control radio-container">
                                                    {
                                                        this.props.categories &&
                                                        this.props.categories.map(category =>
                                                        <div key={category.id}> 
                                                            <input type="radio" name="categoryId" id={category.id} value={values.categoryId} checked={values.categoryId === category.id} onChange={() => {setFieldValue('categoryId', category.id)}} onBlur={handleBlur} />
                                                            <label className="radio">{category.description}</label>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Rating</label>
                                                <div className="control radio-container">
                                                    {
                                                        this.props.ratings &&
                                                        this.props.ratings.map(rating =>
                                                        <div key={rating.id}> 
                                                            <input type="radio" name="ratingId" id={rating.id} value={values.ratingId} checked={values.ratingId === rating.id} onChange={() => {setFieldValue('ratingId', rating.id)}} onBlur={handleBlur} />
                                                            <label className="radio">{rating.description}</label>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                className={this.state.submitting ? "button is-link is-loading" : "button is-link"}
                                                disabled={isSubmitting}>
                                                Save
                                            </button>
                                            <Link to="/manage-books">
                                                <button className="button cancel-button">
                                                    Cancel
                                                </button>
                                            </Link>
                                        </div>
                                    }
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    books: state.books.items,
    book: state.books.item,
    categories: state.categories.items,
    ratings: state.ratings.items,
    error: state.books.error
});

export default connect(mapStateToProps, {createBook, fetchBooks, clearError, fetchCategories, fetchRatings})(AddBook);