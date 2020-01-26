import React, { Component } from 'react';
import './login.css';
import { connect } from 'react-redux';
import { login, clearUser } from '../../actions/userActions';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import LoginDto from '../../models/loginDto';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            incorrectCredentials: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.incorrectCredentials) {
            this.setState({
                incorrectCredentials: true,
                submitting: false
            });
            return;
        }
        if(nextProps.token && nextProps.user) {
            this.setState({ submitting: false });
            this.props.history.push(`/shelf/${nextProps.user.id}`);
        }
    }

    login(values) {
        this.props.clearUser();
        this.setState({
            incorrectCredentials: false,
            submitting: true
        });
        var login = new LoginDto(values.email, values.password);
        this.props.login(login);
    }

    render() {
        return (
            <div className="login-container">
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-4 is-offset-4">
                                <h3 className="title has-text-black">Login</h3>
                                <hr className="login-hr" />
                                <p className="subtitle has-text-black">Please login to proceed.</p>
                                <div className="box">
                                    <figure className="avatar">
                                        <img src="https://placehold.it/128x128" alt="Login icon" />
                                    </figure>
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
                                        if (!values.email)
                                            errors.email = 'Required';
                                        if(!values.password)
                                            errors.password = 'Required';
                                        return errors;
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        this.login(values);
                                        setSubmitting(false);
                                    }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <form className="form" onSubmit={handleSubmit}>
                                            <div className="field">
                                                <label className="label">Email</label>
                                                <div className="control">
                                                    <input className={errors.email && touched.email ? 'input is-large is-danger' : 'input is-large'} type="text" name="email" placeholder="Enter email..." onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">Password</label>
                                                <div className="control">
                                                    <input className={errors.password && touched.password ? 'input is-large is-danger' : 'input is-large'} type="password" name="password" placeholder="Enter password..." onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                                </div>
                                            </div>
                                            {this.state.incorrectCredentials ?
                                                <div className="notification is-danger">
                                                    {this.props.incorrectCredentials}
                                                </div>
                                                :
                                                null
                                            }
                                            <button className={this.state.submitting ? "button is-block is-link is-large is-fullwidth is-loading" : "button is-block is-link is-large is-fullwidth"} type="submit" disabled={isSubmitting}>
                                                Login <i className="fa fa-sign-in" aria-hidden="true"></i>
                                            </button>
                                        </form>
                                    )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user.user,
    incorrectCredentials: state.user.invalidAction
});

export default connect(mapStateToProps, {login, clearUser})(withRouter(Login));