import React from 'react';
import './search-form.css';
import Loading from '../loading/loading';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { searchBooks} from '../../actions/book-actions';

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBooks: null,
            searching: false,
            selectedBook: null,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
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
            .then(response => {
                self.setState({
                    searchBooks: response,
                    searching: false
                });
            })
            .catch(error => {
                self.setState({
                    error: error,
                    searching: false
                })
            });
    };

    bookSelected = (book) => {
       this.setState({
            selectedBook: book
       })
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
                                if (!values.searchTitle)
                                    errors.searchTitle = 'Required';
                                if (!values.searchAuthor)
                                    errors.searchAuthor = 'Required';
                                return errors;
                            }}
                            onSubmit={() => {}}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                <form className="form" onSubmit={handleSubmit}>
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
                                                onClick={() => this.searchBooks(values.searchTitle, values.searchAuthor)}
                                                disabled={!values.searchTitle || !values.searchAuthor}>
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
                                                                <img src={book.imageUrl} />
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