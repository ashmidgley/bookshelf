import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../helpers/field-validator';
import { updateEmail, clearUser } from '../../actions/user-actions';

class UpdateEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            error: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var token = localStorage.getItem('token');
        var data = {
            email: values.email
        };

        updateEmail(data, token)
            .then(() => {
                clearUser()
                    .then(() => {
                        this.setState({
                            submitting: false
                        });
                        this.props.history.push('/login');
                    });
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleError = (error) => {
        this.setState({
            submitting: false,
            error: error
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 form-container"> 
                <div className="card custom-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faMask} className="mask-icon" size="lg"/>
                        </div>
                    </div>
                    <Formik
                        initialValues=
                        {
                            {
                                email: ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if(!validateEmail(values.email))
                                errors.email = 'Incorrect email format';
                            if (!values.email)
                                errors.email = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input className={errors.email && touched.email ? 'input is-danger' : 'input'} type="text" name="email" placeholder="Enter email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                    </div>
                                    {
                                        errors.email && touched.email &&
                                        <div className="has-text-danger is-size-7">
                                            {errors.email}
                                        </div>
                                    }
                                </div>
                                {
                                    this.state.error &&
                                    <div className="notification is-danger">{this.state.error}</div>
                                }
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>Update</button>
                                <Link to="/my-account">
                                    <button className="button cancel-button">Cancel</button>
                                </Link>
                            </form>
                        )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdateEmail);