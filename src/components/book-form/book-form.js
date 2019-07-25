import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Book from '../../models/book';
import './book-form.css';
import { connect } from 'react-redux';
import { createBook, updateBook } from '../../actions/bookActions';
import PropTypes from 'prop-types';
import * as moment from 'moment';

class BookForm extends Component {
    tempImage = 'https://bulma.io/images/placeholders/96x96.png';
    allowedTypes = ['jpg', 'jpeg', 'png'];

    constructor(props) {
        super(props);
        var book = props.match.params.id ? this.props.books.find(b => b.id == props.match.params.id) : null;
        this.state = {
            action: props.match.params.id ? 'Update' : 'Create',
            book: book,
            submitting: false,
            success: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.book) {
            if(this.props.match.params.id){
                var oldBook = this.props.books.find(b => b.id == nextProps.book.id);
                var i = this.props.books.indexOf(oldBook);
                this.props.books[i] = nextProps.book;
            } else {
                this.props.books.unshift(nextProps.book);
            }
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
        if(values.password !== process.env.REACT_APP_FORM_PASSWORD) {
            alert('Nice try scrub');
            this.setState({
                submitting: false,
                success: false
            });
            return;
        }   
        var book = new Book(values.categoryId, values.ratingId, values.image, values.title, values.author, values.startedOn, values.finishedOn, values.pageCount, values.summary);
        if(!this.props.match.params.id) {
            this.props.createBook(book);
        } else {
            book.id = this.state.book.id;
            this.props.updateBook(book);
        }
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column"> 
                <div className="card review-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <img src="/images/plus.png" className="image-header" alt="Plus emoji" />
                        </div>
                    </div>
                    {this.state.success ? 
                        <div className="notification is-primary">Successfully {this.state.action.toLowerCase()}d entry.</div>
                        : 
                        null
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                title: this.state.book ? this.state.book.title : '',
                                image: this.state.book ? this.state.book.image : '',
                                author: this.state.book ? this.state.book.author : '',
                                startedOn: this.state.book ? moment(this.state.book.startedOn).format('YYYY-MM-DD') : '',
                                finishedOn: this.state.book ? moment(this.state.book.finishedOn).format('YYYY-MM-DD') : '',
                                pageCount: this.state.book ? this.state.book.pageCount : '',
                                categoryId: this.state.book ? this.state.book.categoryId : this.props.categories[0].id,
                                ratingId: this.state.book ? this.state.book.ratingId : this.props.ratings[0].id,
                                summary: this.state.book ? this.state.book.summary : '',
                                password: ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.title)
                                errors.title = 'Required';
                            if(!values.image)
                                errors.image = 'Required';
                            var type = values.image.split('.')[1];
                            if(!type || !this.allowedTypes.includes(type))
                                errors.image = "Image doesn't match allowed file types"
                            if(!values.author)
                                errors.author = 'Required';
                            if(!values.startedOn)
                                errors.startedOn = 'Required';
                            if(!values.finishedOn) 
                                errors.finishedOn = 'Required';
                            if(!values.pageCount)
                                errors.pageCount = 'Required';
                            if(!values.summary)
                                errors.summary = 'Required';
                            if(!values.password)
                                errors.password = 'Required';
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
                                    <label className="label">Image</label>
                                    <div className="control">
                                        <input className={errors.image && touched.image ? 'input is-danger' : 'input'} type="text" name="image" placeholder="Enter image name" onChange={handleChange} onBlur={handleBlur} value={values.image} />
                                    </div>
                                </div>
                                <div className="add-new-image">
                                    {!errors.image && values.image ? 
                                        <img src={process.env.REACT_APP_STORAGE_URL + '/' + values.image} alt={values.image} width="96" height="96" /> 
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
                                    <label className="label">Started On</label>
                                    <div className="control">
                                        <input className={errors.startedOn && touched.startedOn ? 'input is-danger' : 'input'} name="startedOn" type="date" onChange={handleChange} onBlur={handleBlur} value={values.startedOn} />
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
                                        {this.props.categories.map(category =>
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
                                        {this.props.ratings.map(rating =>
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
                                        <textarea className={errors.summary && touched.summary ? 'textarea is-danger' : 'textarea'} name="summary" placeholder="Enter summary" onChange={handleChange} onBlur={handleBlur} value={values.summary}></textarea>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <input className={errors.password && touched.password ? 'input is-danger' : 'input'} type="password" name="password" placeholder="Enter password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                    </div>
                                </div>
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>{this.state.action}</button>
                                <Link to="/admin">
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

BookForm.propTypes = {
    createBook: PropTypes.func.isRequired,
    updateBook: PropTypes.func.isRequired,
    books: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ratings: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    books: state.books.items,
    book: state.books.item,
    categories: state.categories.items,
    ratings: state.ratings.items
  });

export default connect(mapStateToProps, {createBook, updateBook})(BookForm);