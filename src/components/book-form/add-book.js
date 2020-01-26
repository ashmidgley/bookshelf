import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import NewBook from '../../models/newBook';
import './update-book.css';
import { connect } from 'react-redux';
import { createBook } from '../../actions/bookActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


class AddBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            success: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.book) {
            this.props.books.unshift(nextProps.book);

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

        var newBook = new NewBook(values.isbn, this.props.user.id, values.categoryId, values.ratingId, values.finishedOn);

        this.props.createBook(newBook, this.props.token);
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 book-form-container"> 
                <div className="card review-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg"/>
                        </div>
                    </div>
                    {this.state.success ? 
                        <div className="notification is-primary">Successfully created entry.</div>
                        : 
                        null
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                isbn: '',
                                finishedOn: '',
                                categoryId: this.props.categories[0].id,
                                ratingId: this.props.ratings[0].id,
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.isbn)
                                errors.isbn = 'Required';
                            if(!values.finishedOn) 
                                errors.finishedOn = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">ISBN</label>
                                    <div className="control">
                                        <input className={errors.isbn && touched.isbn ? 'input is-danger' : 'input'} type="text" name="isbn" placeholder="Enter isbn" onChange={handleChange} onBlur={handleBlur} value={values.isbn} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Finished On</label>
                                    <div className="control">
                                        <input className={errors.finishedOn && touched.finishedOn ? 'input is-danger' : 'input'} type="date" name="finishedOn" onChange={handleChange} onBlur={handleBlur} value={values.finishedOn} />
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
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>Create</button>
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

const mapStateToProps = state => ({
    books: state.books.items,
    book: state.books.item,
    categories: state.categories.items,
    ratings: state.ratings.items,
    token: state.user.token,
    user: state.user.user
});

export default connect(mapStateToProps, {createBook})(AddBook);