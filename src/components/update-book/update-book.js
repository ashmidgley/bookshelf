import React from 'react';
import './update-book.css';
import Loading from '../loading/loading';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { updateBook, fetchBooks, clearError } from '../../actions/book-actions';
import { fetchCategories } from '../../actions/category-actions';
import { fetchRatings } from '../../actions/rating-actions';

class UpdateBook extends React.Component {
    tempImage = 'https://bulma.io/images/placeholders/96x96.png';
    allowedTypes = ['jpg', 'jpeg', 'png'];
    validPrecursor = 'http://books.google.com';

    constructor(props) {
        super(props);
        this.state = {
            bookId: parseInt(props.match.params.id),
            book: null,
            loading: true,
            submitting: false,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        if(!this.props.books || !this.props.categories || !this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
            this.props.fetchCategories(id);
            this.props.fetchRatings(id);
        } else {
            this.setState({
                book: this.props.books.find(b => b.id === this.state.bookId),
                loading: false
            });
        }
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings)) {
            this.setState({
                book: nextProps.books.find(b => b.id === this.state.bookId),
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
        } else if(this.state.submitting && nextProps.book) {
            var oldBook = this.props.books.find(b => b.id === nextProps.book.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books[i] = nextProps.book;
            this.setState({
                submitting: false,
                success: true
            });
            window.scrollTo(0, 0);
        }
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false
        });

        var book = {
            id: this.state.book.id,
            userId: parseInt(localStorage.getItem('userId')),
            categoryId: values.categoryId,
            ratingId: values.ratingId,
            imageUrl: values.imageUrl,
            title: values.title,
            author: values.author,
            finishedOn: values.finishedOn,
            pageCount: values.pageCount,
            summary: values.summary
        };
        
        var token = localStorage.getItem('token');
        this.props.updateBook(book, token);
    }

    validImage(image) {
        if(image.startsWith(this.validPrecursor)) {
            return true;
        }

        for(var i = 0; i < this.allowedTypes.length; i++) {
            var format = this.allowedTypes[i];
            if(image.endsWith(format)) {
                return true;
            }
        }
        return false;
    }

    getCategoryId() {
        if(this.state.book) {
            return this.state.book.categoryId;
        }
        if(this.props.categories && this.props.categories.length) {
            return this.props.categories[0].id
        }
        return null;
    }

    getRatingId() {
        if(this.state.book) {
            return this.state.book.ratingId;
        }
        if(this.props.ratings && this.props.ratings.length) {
            return this.props.ratings[0].id;
        }
        return null;
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
                        <div className="notification is-primary">
                            Successfully updated entry. <Link to={`/review/${this.props.book.id}`}>View update?</Link>
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
                                title: this.state.book ? this.state.book.title : '',
                                imageUrl: this.state.book ? this.state.book.imageUrl : '',
                                author: this.state.book ? this.state.book.author : '',
                                finishedOn: this.state.book ? moment(this.state.book.finishedOn).format('YYYY-MM-DD') : '',
                                pageCount: this.state.book ? this.state.book.pageCount : '',
                                categoryId: this.getCategoryId(),
                                ratingId: this.getRatingId(),
                                summary: this.state.book ? this.state.book.summary : ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.title)
                                errors.title = 'Required';
                            if(!values.imageUrl)
                                errors.imageUrl = 'Required';
                            if(!this.validImage(values.imageUrl))
                                errors.imageUrl = 'Invalid format';
                            if(!values.author)
                                errors.author = 'Required';
                            if(!values.finishedOn) 
                                errors.finishedOn = 'Required';
                            if(!values.pageCount)
                                errors.pageCount = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                            <form className="form" onSubmit={handleSubmit}>
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
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>Update</button>
                                <Link to="/manage-books">
                                    <button className="button cancel-button">Cancel</button>
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

export default connect(mapStateToProps, {updateBook, fetchBooks, clearError, fetchCategories, fetchRatings})(UpdateBook);