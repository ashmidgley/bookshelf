import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { validateEmail, validatePasswordLength } from '../../helpers/field-validator';
import { login } from '../../actions/auth-actions';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            error: null
        };
    }

    submitEntry(values) {
        this.setState({
            error: null,
            submitting: true
        });

        var user = {
            email: values.email,
            password: values.password
        };
        
        login(user)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleSuccess = (userId) => {
        this.setState({
            submitting: false
        });
        this.props.history.push(`/shelf/${userId}`);
    }

    handleError = (error) => {
        this.setState({
            error: error,
            submitting: false
        });
    }

    render() {
        return (
            <section className="section hero is-fullheight mobile-auth">
                <div className="hero-body mobile-auth">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-two-fifths">
                                <div className="card header-background">
                                    <header className="card-header">
                                        <p className="card-header-title">
                                            <span className="icon">
                                                <FontAwesomeIcon icon={faLock} size="sm" />
                                            </span>
                                            <span>Login</span>
                                        </p>
                                    </header>
                                    <div className="card-content">
                                        <Formik
                                            initialValues=
                                            {
                                                {
                                                    email: '',
                                                    password: ''
                                                }
                                            }
                                            validate={values => {
                                                let errors = {};
                                                if(!validateEmail(values.email))
                                                    errors.email = 'Incorrect email format';
                                                if (!values.email)
                                                    errors.email = 'Required';
                                                if(!validatePasswordLength(values.password))
                                                    errors.password = 'Password must be at least 5 characters long';
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
                                                        <label className="label custom-label">Email</label>
                                                        <div className="control is-clearfix">
                                                            <input autoFocus="autofocus" className={errors.email && touched.email ? 'input is-danger' : 'input'} type="text" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                                        </div>
                                                    </div>
                                                    <div id="password-field" className="field">
                                                        <label className="label custom-label">Password</label>
                                                        <div className="control is-clearfix">
                                                            <input className={errors.password && touched.password ? 'input is-danger' : 'input'} type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                                        </div>
                                                    </div>
                                                    {
                                                        this.state.error &&
                                                        <div className="notification is-danger custom-notification">
                                                            {this.state.error}
                                                        </div>
                                                    }
                                                    <div id="forgot-password">
                                                        <Link to="/forgot-password">Forgotten password?</Link>
                                                    </div>
                                                    <hr />
                                                    <div className="field is-grouped">
                                                        <div className="control">
                                                            <button type="submit" disabled={isSubmitting} className={this.state.submitting ? "button is-dark is-loading" : "button is-dark"}>
                                                                Login
                                                            </button>
                                                        </div>
                                                        <div className="control">
                                                            <Link to="/" className="button is-outlined">
                                                                Cancel
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default withRouter(Login);