import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Rating from '../../models/rating';
import './rating-form.css';
import { connect } from 'react-redux';
import { createRating, updateRating, fetchRatings } from '../../actions/ratingActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from '../loading/loading';

class RatingForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            action: props.match.params.id ? 'Update' : 'Create',
            ratingId: parseInt(props.match.params.id),
            rating: null,
            submitting: false,
            success: false,
            loading: true
        };
    }

    componentDidMount() {
        if(!this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchRatings(id);
        } else {
            this.setState({
                rating: this.state.ratingId ? this.props.ratings.find(b => b.id === this.state.ratingId) : null,
                loading: false
            })
        }

        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.ratings))
            this.setState({
                rating: this.state.ratingId ? nextProps.ratings.find(b => b.id === this.state.ratingId) : null,
                loading: false
        });

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
        var rating = new Rating(this.props.user.id, values.description, values.code);
        if(!this.props.match.params.id) {
            this.props.createRating(rating, this.props.token);
        } else {
            rating.id = this.state.rating.id;
            this.props.updateRating(rating, this.props.token);
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 rating-form-container"> 
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
                                <Link to="/admin/manage-ratings">
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

export default connect(mapStateToProps, {createRating, updateRating, fetchRatings})(RatingForm);