import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Rating from '../../models/rating';
import './rating-form.css';
import { connect } from 'react-redux';
import { createRating, updateRating } from '../../actions/ratingActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class ratingForm extends Component {

    constructor(props) {
        super(props);
        var id = parseInt(props.match.params.id);
        var rating = props.match.params.id ? this.props.ratings.find(b => b.id === id) : null;
        this.state = {
            action: props.match.params.id ? 'Update' : 'Create',
            rating: rating,
            submitting: false,
            success: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.rating) {
            if(this.props.match.params.id){
                var oldRating = this.props.ratings.find(b => b.id === nextProps.rating.id);
                var i = this.props.ratings.indexOf(oldRating);
                this.props.ratings[i] = nextProps.rating;
            } else {
                this.props.ratings.push(nextProps.rating);
            }
            this.setState({
                submitting: false,
                success: true
            });
        }
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false
        });
        if(values.password !== this.props.user.password) {
            alert('Nice try scrub');
            this.setState({
                submitting: false,
                success: false
            });
            return;
        }   
        var rating = new Rating(this.props.user.id, values.description, values.code);
        if(!this.props.match.params.id) {
            this.props.createRating(rating, this.props.token);
        } else {
            rating.id = this.state.rating.id;
            this.props.updateRating(rating, this.props.token);
        }
    }

    render() {
        return (
            <div className="column is-8 is-offset-2"> 
                <div className="card review-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg"/>
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
                                description: this.state.rating ? this.state.rating.description : '',
                                code: this.state.rating ? this.state.rating.code : '',
                                password: ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.description)
                                errors.description = 'Required';
                            if(!values.code)
                                errors.code = 'Required';
                            if(!values.password)
                                errors.password = 'Required';
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

  const mapStateToProps = state => ({
    ratings: state.ratings.items,
    rating: state.ratings.item,
    token: state.user.token,
    user: state.user.user
  });

export default connect(mapStateToProps, {createRating, updateRating})(ratingForm);