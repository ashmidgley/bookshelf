import React from 'react';
import './add-book.css';
import moment from 'moment';
import Loading from '../loading/loading';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { createBook } from '../../actions/book-actions';
import { fetchCurrentUserCategories } from '../../actions/category-actions';
import { fetchCurrentUserRatings } from '../../actions/rating-actions';
import { validImage } from '../../helpers/image-helper';

class AddBook extends React.Component {
    tempImage = 'https://bulma.io/images/placeholders/96x96.png';
    
    constructor(props) {
        super(props);
        this.state = {
            book: null,
            categories: null,
            ratings: null,
            submitting: false,
            loading: true,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if(!this.props.location.state) {
            this.props.history.push('/search-form');
        } else {
            this.setState({
                book: this.props.location.state.book
            });
        }

        var token = localStorage.getItem("token");
        this.fetchCategories(token);
        this.fetchRatings(token);
    }

    fetchCategories = (token) => {
        fetchCurrentUserCategories(token)
            .then(response => {
                if(response.length == 0) {
                    this.handleError('You must have at least one category to add a book.');
                } else {
                    this.setState({
                        categories: response
                    });
                }
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    fetchRatings = (token) => {
        fetchCurrentUserRatings(token)
            .then(response => {
                if(response.length == 0) {
                    this.handleError('You must have at least one rating to add a book.');
                } else {
                    this.setState({
                        ratings: response,
                        loading: false
                    });
                }
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleError = (error) => {
        this.setState({
            error: error,
            submitting: false,
            loading: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    submitEntry(values) {
        if(!this.state.categories || !this.state.ratings) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var newBook = {
            title: values.title,
            author: values.author,
            imageUrl: values.imageUrl,
            finishedOn: values.finishedOn === "" ? moment().format('YYYY-MM-DD') : values.finishedOn,
            pageCount: values.pageCount,
            categoryId: values.categoryId == null ? this.state.categories[0].id : values.categoryId,
            ratingId: values.ratingId == null ? this.state.ratings[0].id : values.ratingId,
            summary: values.summary
        };
        
        var token = localStorage.getItem('token');
        this.createBook(newBook, token);
    }

    createBook = (book, token) => {
        createBook(book, token)
            .then(response => {
                this.setState({
                    book: response,
                    submitting: false,
                    success: true
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                this.handleError(error);
            });
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
                                Successfully created new book. <Link to={`/review/${this.state.book.id}`}>View?</Link>
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
                                    title: this.state.book.title,
                                    imageUrl: this.state.book.imageUrl,
                                    author: this.state.book.author,
                                    finishedOn: moment().format('YYYY-MM-DD'),
                                    pageCount: this.state.book.pageCount,
                                    categoryId: this.state.categories && this.state.categories.length ? this.state.categories[0].id : null,
                                    ratingId: this.state.ratings && this.state.ratings.length ? this.state.ratings[0].id : null,
                                    summary: this.state.book.summary
                                }
                            }
                            validate={values => {
                                let errors = {};
                                if (!values.title)
                                    errors.title = 'Required';
                                if(!values.imageUrl)
                                    errors.imageUrl = 'Required';
                                if(!validImage(values.imageUrl))
                                    errors.imageUrl = 'Invalid format';
                                if(!values.author)
                                    errors.author = 'Required';
                                if(!values.pageCount)
                                    errors.pageCount = 'Required';
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                this.submitEntry(values);
                                setSubmitting(false);
                            }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                                <form className="form" onSubmit={handleSubmit}>
                                    <Link to="/search-form" id="back-button" className="button">
                                        <FontAwesomeIcon icon={faArrowLeft}/> Back
                                    </Link>
                                    <div className="field">
                                        <label className="label">Title</label>
                                        <div className="control">
                                            <input className={errors.title && touched.title ? 'input is-danger' : 'input'} type="text" name="title" placeholder="Enter title" onChange={handleChange} onBlur={handleBlur} value={values.title} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Image URL</label>
                                        <div className="control">
                                            <input className={errors.imageUrl && touched.imageUrl ? 'input is-danger' : 'input'} type="text" name="imageUrl" placeholder="Enter image URL" onChange={handleChange} onBlur={handleBlur} value={values.imageUrl} />
                                        </div>
                                        {
                                            errors.imageUrl === 'Invalid format' &&
                                            <div className="help is-danger">
                                                Invalid image format. Please use a png, jpg or jpeg.
                                            </div>
                                        }
                                    </div>
                                    <div className="has-text-centered">
                                        {
                                            !errors.imageUrl && values.imageUrl ? 
                                            <img src={values.imageUrl} alt={values.imageUrl} width="96" height="96" /> 
                                            : 
                                            <img src={this.tempImage} alt="Placeholder" />
                                        }
                                    </div>
                                    <div className="field">
                                        <label className="label">Author</label>
                                        <div className="control">
                                            <input className={errors.author && touched.author ? 'input is-danger' : 'input'} type="text" name="author" placeholder="Enter author" onChange={handleChange} onBlur={handleBlur} value={values.author} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Finished On</label>
                                        <div className="control">
                                            <input className={errors.finishedOn && touched.finishedOn ? 'input is-danger' : 'input'} type="date" name="finishedOn" onChange={handleChange} onBlur={handleBlur} value={values.finishedOn} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Page Count</label>
                                        <div className="control">
                                            <input className={errors.pageCount && touched.pageCount ? 'input is-danger' : 'input'} type="number" name="pageCount" placeholder="Enter page count" onChange={handleChange} onBlur={handleBlur} value={values.pageCount}/>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Category</label>
                                        <div className="control radio-container">
                                            {
                                                this.state.categories &&
                                                this.state.categories.map(category =>
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
                                                this.state.ratings &&
                                                this.state.ratings.map(rating =>
                                                <div key={rating.id}> 
                                                    <input type="radio" name="ratingId" id={rating.id} value={values.ratingId} checked={values.ratingId === rating.id} onChange={() => {setFieldValue('ratingId', rating.id)}} onBlur={handleBlur} />
                                                    <label className="radio">{rating.description}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>    
                                    <div className="field">
                                        <label className="label">Summary</label>
                                        <div className="control">
                                            <textarea className="textarea" name="summary" placeholder="Enter summary" onChange={handleChange} onBlur={handleBlur} value={values.summary}></textarea>
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
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AddBook);