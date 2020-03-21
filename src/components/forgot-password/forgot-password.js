import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../verifier';

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            submitting: false,
            submitted: false,
            email: null,
            invalidAction: null
        };
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            email: values.email
        });

        console.log('submitted');

        this.setState({
            submitted: true
        });
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
                    {
                        this.state.submitted ?
                        <div className="notification is-success">
                            Reset password link sent to {this.state.email}.
                        </div>
                        :
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
                                        <label className="label">Send Password Reset</label>
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
                                        this.state.invalidAction &&
                                        <div className="notification is-danger">{this.state.invalidAction}</div>
                                    }
                                    <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>Send</button>
                                    <Link to="/">
                                        <button className="button cancel-button">Cancel</button>
                                    </Link>
                                </form>
                            )}
                            </Formik>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPassword;