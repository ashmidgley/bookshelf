import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../verifier';
import { updateEmail, setUser } from '../../actions/userActions';

class UpdateEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            success: false,
            invalidAction: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.updatedUser) {
            localStorage.setItem('userEmail', nextProps.updatedUser.email);
            var data = { 
                token: localStorage.getItem('token'),
                expiryDate: localStorage.getItem('expiryDate'), 
                user: nextProps.updatedUser
            };

            this.props.setUser(data);
            this.setState({
                submitting: false,
                success: true
            });
        }

        if(nextProps.invalidAction) {
            this.setState({
                submitting: false,
                invalidAction: nextProps.invalidAction
            })
        }
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            invalidAction: null
        });

        var token = localStorage.getItem('token');
        var data = {
            id: parseInt(localStorage.getItem('userId')),
            email: values.email
        };

        this.props.updateEmail(data, token);
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
                        this.state.success &&
                        <div className="notification is-primary">Successfully updated email.</div>
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                email: ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.email)
                                errors.email = 'Required';
                            if(!validateEmail(values.email))
                                errors.email = 'Incorrect email format';
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
                                    this.state.invalidAction &&
                                    <div className="notification is-danger">{this.state.invalidAction}</div>
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

const mapStateToProps = state => ({
    user: state.user.user,
    updatedUser: state.user.updatedUser,
    invalidAction: state.user.invalidAction
});

export default connect(mapStateToProps, {updateEmail, setUser})(UpdateEmail);