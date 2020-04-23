import React from 'react';
import './add-book.css';
import moment from 'moment';
import Loading from '../loading/loading';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { createBook, fetchBooks, clearError } from '../../actions/book-actions';
import { fetchCategories } from '../../actions/category-actions';
import { fetchRatings } from '../../actions/rating-actions';
import { validImage } from '../../helpers/image-helper';

class AddBook extends React.Component {
    tempImage = 'https://bulma.io/images/placeholders/96x96.png';
    
    constructor(props) {
        super(props);
        this.state = {
            book: null,
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

        if(!this.props.location.state) {
            this.props.history.push('/search-form');
        } else {
            this.setState({
                book: this.props.location.state.book
            });
        }
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

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var newBook = {
            userId: parseInt(localStorage.getItem('userId')),
            title: values.title,
            author: values.author,
            imageUrl: values.imageUrl,
            finishedOn: values.finishedOn === "" ? moment().format('YYYY-MM-DD') : values.finishedOn,
            pageCount: values.pageCount,
            categoryId: values.categoryId,
            ratingId: values.ratingId,
            summary: values.summary
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
                                    title: this.state.book.title,
                                    imageUrl: this.state.book.imageUrl,
                                    author: this.state.book.author,
                                    finishedOn: moment().format('YYYY-MM-DD'),
                                    pageCount: this.state.book.pageCount,
                                    categoryId: this.props.categories && this.props.categories.length ? this.props.categories[0].id : null,
                                    ratingId: this.props.ratings && this.props.ratings.length ? this.props.ratings[0].id : null,
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

const mapStateToProps = state => ({
    books: state.books.items,
    book: state.books.item,
    categories: state.categories.items,
    ratings: state.ratings.items,
    error: state.books.error
});

export default connect(mapStateToProps, {createBook, fetchBooks, clearError, fetchCategories, fetchRatings})(withRouter(AddBook));