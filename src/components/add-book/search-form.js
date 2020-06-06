import React from 'react';
import './search-form.css';
import Loading from '../loading/loading';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { searchBooks, searchBooksByTitle, searchBooksByAuthor } from '../../actions/search-actions';

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBooks: null,
            searching: false,
            selectedBook: null,
            titleChecked: true,
            authorChecked: true,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    submitSearch = (title, author) => {
        this.setState({
            searching: true,
            searchBooks: null,
            selectedBook: null,
            error: null
        });

        var maxResults = 3;
        var token = localStorage.getItem('token');
        if(!this.state.authorChecked) {
            this.searchBooksByTitle(title, maxResults, token);
        } else if(!this.state.titleChecked) {
            this.searchBooksByAuthor(author, maxResults, token);
        } else {
            this.searchBooks(title, author, maxResults, token);
        }
    };

    searchBooksByTitle = (title, maxResults, token) => {
        searchBooksByTitle(title, maxResults, token)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    searchBooksByAuthor = (author, maxResults, token) => {
        searchBooksByAuthor(author, maxResults, token)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    searchBooks = (title, author, maxResults, token) => {
        searchBooks(title, author, maxResults, token)
                .then(response => {
                    this.handleSuccess(response);
                })
                .catch(error => {
                    this.handleError(error);
                });
    }

    handleSuccess = (response) => {
        this.setState({
            searchBooks: response,
            searching: false
        });
    }

    handleError = (error) => {
        this.setState({
            error: error,
            searching: false
        })
    }

    bookSelected = (book) => {
       this.setState({
            selectedBook: book
       })
    }

    titleChecked = () => {
        this.setState(prevState => ({
            titleChecked: !prevState.titleChecked
        }));
    }

    authorChecked = () => {
        this.setState(prevState => ({
            authorChecked: !prevState.authorChecked
        }));
    }

    searchDisabled = (title, author) => {
        if((!this.state.titleChecked && !this.state.authorChecked)
            || (this.state.titleChecked && title == '')
            || (this.state.authorChecked && author == '')) {
            return true;
        }

        return false;
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
                            this.state.error && 
                            <div className="notification is-danger">{this.state.error}</div>
                        }
                        {
                            this.state.selectedBook &&
                            <Redirect to={{ pathname: '/book-form', state: { book: this.state.selectedBook }}}/>
                        }
                        <Formik
                            initialValues=
                            {
                                {
                                    searchTitle: '',
                                    searchAuthor: '',
                                    book: null
                                }
                            }
                            validate={values => {
                                let errors = {};
                                if (this.state.titleChecked && !values.searchTitle)
                                    errors.searchTitle = 'Required';
                                if (this.state.authorChecked && !values.searchAuthor)
                                    errors.searchAuthor = 'Required';
                                return errors;
                            }}
                            onSubmit={() => {}}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                <form className="form" onSubmit={handleSubmit}>
                                    <div>
                                        <div className="field">
                                            <label className="label">Title</label>
                                            <div className="control">
                                                <input className={errors.searchTitle && touched.searchTitle ? 'input is-danger' : 'input'} type="text" name="searchTitle" placeholder="Enter title" onChange={handleChange} onBlur={handleBlur} value={values.searchTitle} disabled={!this.state.titleChecked} />
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.titleChecked}
                                                    onClick={this.titleChecked}
                                                />
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Author</label>
                                            <div className="control">
                                                <input className={errors.searchAuthor && touched.searchAuthor ? 'input is-danger' : 'input'} type="text" name="searchAuthor" placeholder="Enter author" onChange={handleChange} onBlur={handleBlur} value={values.searchAuthor} disabled={!this.state.authorChecked} />
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.authorChecked}
                                                    onClick={this.authorChecked}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <button 
                                                className={this.state.searching ? "button is-link is-loading" : "button is-link"}
                                                onClick={() => this.submitSearch(values.searchTitle, values.searchAuthor)}
                                                disabled={this.searchDisabled(values.searchTitle, values.searchAuthor)}>
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
                                                        <button
                                                            key={this.state.searchBooks.indexOf(book)}
                                                            onClick={() => {setFieldValue('book', book)}}
                                                            className={values.book && book === values.book ? "columns is-mobile custom-radio custom-radio-selected" : "columns is-mobile custom-radio"}> 
                                                            <div className="column is-1">
                                                                <input className="custom-radio-input" type="radio" name="book" checked={values.book === book} onBlur={handleBlur} />
                                                            </div>
                                                            <div className="column is-10 has-text-centered">
                                                                <p className="is-size-6">{book.title}</p>
                                                                <p>{book.author}</p>
                                                            </div>
                                                            <div id="search-image-column" className="column is-1">
                                                                <img src={book.imageUrl} alt="Book cover" />
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                                <button className="button is-link" disabled={!values.book}
                                                    onClick={() => this.bookSelected(values.book)}>
                                                    Next
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchForm;