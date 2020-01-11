import React, { Component } from 'react';
import './register.css';
import { connect } from 'react-redux';
import { register } from '../../actions/userActions';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import LoginDto from '../../models/loginDto';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            existingEmail: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
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
        this.setState({
            existingEmail: false,
            submitting: true
        });
        var register = new LoginDto(values.email, values.password);
        this.props.register(register);
    }

    render() {
        return (
            <div className="register-container">
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-4 is-offset-4">
                                <h3 className="title has-text-black">Register</h3>
                                <hr className="register-hr" />
                                <p className="subtitle has-text-black">Please register to proceed.</p>
                                <div className="box">
                                    <figure className="avatar">
                                        <img src="https://placehold.it/128x128" alt="Register icon" />
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
                                        this.register(values);
                                        setSubmitting(false);
                                    }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <form className="form" onSubmit={handleSubmit}>
                                            <div className="field">
                                                <label className="label">Email</label>
                                                <div className="control">
                                                    <input className={errors.email && touched.email ? 'input is-large is-danger' : 'input is-large'} type="text" name="email" placeholder="Enter email..." onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                                </div>
                                            </div>
                                            {this.state.existingEmail ?
                                                <div className="notification is-danger">
                                                    {this.props.existingEmail}
                                                </div>
                                                :
                                                null
                                            }
                                            <div className="field">
                                                <label className="label">Password</label>
                                                <div className="control">
                                                    <input className={errors.password && touched.password ? 'input is-large is-danger' : 'input is-large'} type="password" name="password" placeholder="Enter password..." onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                                </div>
                                            </div>
                                            <button className={this.state.submitting ? "button is-block is-info is-large is-fullwidth is-loading" : "button is-block is-info is-large is-fullwidth"} type="submit" disabled={isSubmitting}>
                                                Register <i className="fa fa-sign-in" aria-hidden="true"></i>
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
    existingEmail: state.user.invalidAction
});

export default connect(mapStateToProps, {register})(withRouter(Register));