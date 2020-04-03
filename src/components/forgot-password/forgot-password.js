import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../helpers/field-validator';
import { sendResetToken, clearError, clearResetTokenSent } from '../../actions/email-actions';

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            email: null,
            submitting: false,
            submitted: false,
            error: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.error) {
            this.setState({
                error: nextProps.error,
                submitting: false
            });
            this.props.clearError();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if(this.state.submitting && nextProps.resetTokenSent) {
            this.setState({
                submitting: false,
                submitted: true
            });
            this.props.clearResetTokenSent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    submitEntry(values) {
        this.setState({
            email: values.email,
            error: null,
            submitting: true
        });

        this.props.sendResetToken(values.email);
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
                                        this.state.error &&
                                        <div className="notification is-danger">{this.state.error}</div>
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

const mapStateToProps = state => ({
    resetTokenSent: state.email.resetTokenSent,
    error: state.email.error
});

export default connect(mapStateToProps, {sendResetToken, clearError, clearResetTokenSent})(ForgotPassword);