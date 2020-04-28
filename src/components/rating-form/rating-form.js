import React from 'react';
import Loading from '../loading/loading';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getRating, createRating, updateRating } from '../../actions/rating-actions';

class RatingForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            action: props.match.params.id ? 'Update' : 'Create',
            ratingId: parseInt(props.match.params.id),
            rating: null,
            loading: true,
            submitting: false,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if(this.state.ratingId) {
            getRating(this.state.ratingId)
                .then(response => {
                    this.setState({
                        rating: response,
                        loading: false
                    })
                })
                .catch(error => {
                    this.handleError(error);
                });
        } else {
            this.setState({
                loading: false
            })
        }
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });
        
        var rating = {
            description: values.description,
            code: values.code
        };
        
        var token = localStorage.getItem('token');
        if(!this.props.match.params.id) {
            this.createRating(rating, token);
        } else {
            rating.id = this.state.rating.id;
            rating.userId = this.state.rating.userId;
            this.updateRating(rating, token);
        }
    }

    createRating(rating, token) {
        createRating(rating, token)
            .then(() => {
                this.handleSuccess();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    updateRating(rating, token) {
        updateRating(rating, token)
            .then(() => {
                this.handleSuccess();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleSuccess = () => {
        this.setState({
            submitting: false,
            success: true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleError = (error) => {
        this.setState({
            error: error,
            loading: false,
            submitting: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            Successfully {this.state.action.toLowerCase()}d rating. <Link to="/manage-ratings">View?</Link>
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
                                description: this.state.rating ? this.state.rating.description : '',
                                code: this.state.rating ? this.state.rating.code : ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.description)
                                errors.description = 'Required';
                            if(!values.code)
                                errors.code = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Description</label>
                                    <div className="control">
                                        <input className={errors.description && touched.description ? 'input is-danger' : 'input'} type="text" name="description" placeholder="Enter description" onChange={handleChange} onBlur={handleBlur} value={values.description} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Code</label>
                                    <div className="control">
                                        <input className={errors.code && touched.code ? 'input is-danger' : 'input'} type="text" name="code" placeholder="Enter code" onChange={handleChange} onBlur={handleBlur} value={values.code} />
                                    </div>
                                    <a href="https://emojipedia.org" className="is-size-7">Emojipedia</a>
                                </div>
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>{this.state.action}</button>
                                <Link to="/manage-ratings">
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

export default RatingForm;