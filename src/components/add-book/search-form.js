import React from 'react';
import './search-form.css';
import Loading from '../loading/loading';
import { Link, Redirect } from 'react-router-dom';
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
            orderBy: ['Relevance', 'Newest'],
            maxResults: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    submitSearch = (values) => {
        this.setState({
            searching: true,
            searchBooks: null,
            selectedBook: null,
            error: null
        });

        var maxResults = parseInt(values.maxResults);
        var token = localStorage.getItem('token');
        if(!this.state.authorChecked) {
            var data = { 
                title: values.searchTitle,
                orderBy: values.orderBy,
                maxResults 
            };
            this.searchBooksByTitle(data, token);
        } else if(!this.state.titleChecked) {
            var data = { 
                author: values.searchAuthor,
                orderBy: values.orderBy,
                maxResults
            };
            this.searchBooksByAuthor(data, token);
        } else {
            var data = { 
                title: values.searchTitle,
                author: values.searchAuthor,
                orderBy: values.orderBy,
                maxResults
            };
            this.searchBooks(data, token);
        }
    };

    searchBooksByTitle = (data, token) => {
        searchBooksByTitle(data, token)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    searchBooksByAuthor = (data, token) => {
        searchBooksByAuthor(data, token)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    searchBooks = (data, token) => {
        searchBooks(data, token)
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
                        <h1 className="title is-4 has-text-centered">
                            Add Manually
                        </h1>
                        <div id='add-manually'>
                            <Link to={'/book-form'}>
                                <button className="button is-outlined">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </Link>
                        </div>
                        <hr />
                        <h1 className="title is-4 has-text-centered">
                            Search
                        </h1>
                        <Formik
                            initialValues=
                            {
                                {
                                    searchTitle: '',
                                    searchAuthor: '',
                                    orderBy: this.state.orderBy[0],
                                    maxResults: 3,
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
                                                    readOnly
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
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <button 
                                                className={this.state.searching ? "button is-link is-loading" : "button is-link"}
                                                onClick={() => this.submitSearch(values)}
                                                disabled={this.searchDisabled(values.searchTitle, values.searchAuthor)}>
                                                Search
                                            </button>
                                            <div className='select search-dropdown'>
                                                <select value={values.orderBy} name='orderBy' onChange={handleChange}>
                                                    {this.state.orderBy.map(result =>
                                                        <option key={result}>{result}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className='select search-dropdown'>
                                                <select value={values.maxResults} name='maxResults' onChange={handleChange}>
                                                    {this.state.maxResults.map(result =>
                                                        <option key={result}>{result}</option>
                                                    )}
                                                </select>
                                            </div>
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
                                                                <input className="custom-radio-input" type="radio" name="book" checked={values.book === book} onBlur={handleBlur} readOnly />
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