import React from 'react';
import LoginDto from '../../models/loginDto';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { validateEmail, validatePasswordLength } from '../../helpers/field-validator';
import { register } from '../../actions/authActions';
import { clearUser } from '../../actions/userActions';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            existingEmail: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.existingEmail) {
            this.setState({
                existingEmail: true,
                submitting: false
            });
            return;
        }
        
        if(nextProps.token && nextProps.user) {
            this.setState({ submitting: false });
            this.props.history.push(`/shelf/${nextProps.user.id}`);
        }
    }

    register(values) {
        this.props.clearUser();

        this.setState({
            existingEmail: false,
            submitting: true
        });

        var register = new LoginDto(values.email, values.password);
        this.props.register(register);
    }

    render() {
        return (
            <section className="section hero is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-two-fifths">
                                <div className="card header-background">
                                    <header className="card-header">
                                        <p className="card-header-title">
                                            <span className="icon">
                                                <FontAwesomeIcon icon={faLock} size="sm" />
                                            </span>
                                            <span>Register</span>
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
                                                this.register(values);
                                                setSubmitting(false);
                                            }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                                <form className="form" onSubmit={handleSubmit}>
                                                    <div className="field">
                                                        <label className="label custom-label">Email</label>
                                                        <div className="control is-clearfix">
                                                            <input autoFocus="autofocus" className={errors.email && touched.email ? 'input is-danger' : 'input'} type="text" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                                        </div>
                                                        {
                                                            errors.email && touched.email &&
                                                            <div className="has-text-danger is-size-7 custom-validation">
                                                                {errors.email}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div id="password-field" className="field">
                                                        <label className="label custom-label">Password</label>
                                                        <div className="control is-clearfix">
                                                            <input className={errors.password && touched.password ? 'input is-danger' : 'input'} type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                                        </div>
                                                        {
                                                            errors.password && touched.password &&
                                                            <div className="has-text-danger is-size-7 custom-validation">
                                                                {errors.password}
                                                            </div>
                                                        }
                                                    </div>
                                                    {
                                                        this.state.existingEmail &&
                                                        <div className="notification is-danger custom-notification">
                                                            {this.props.existingEmail}
                                                        </div>
                                                    }
                                                    <hr />
                                                    <div className="field is-grouped">
                                                        <div className="control">
                                                            <button type="submit" disabled={isSubmitting} className={this.state.submitting ? "button is-dark is-loading" : "button is-dark"}>
                                                                Register
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

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user.user,
    existingEmail: state.user.invalidAction
});

export default connect(mapStateToProps, {register, clearUser})(withRouter(Register));