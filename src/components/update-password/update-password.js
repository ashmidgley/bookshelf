import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { validatePasswordLength } from '../../verifier';
import { updatePassword } from '../../actions/userActions';

class UpdatePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            success: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.updatedUser) {
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

        var token = localStorage.getItem('token');
        var data = { 
            id: parseInt(localStorage.getItem('userId')),
            password: values.password
        };

        this.props.updatePassword(data, token);
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
                        <div className="notification is-primary">Successfully updated password.</div>
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                password: ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if(!validatePasswordLength(values.password))
                                errors.password = 'Password must be at least 5 characters long';
                            if (!values.password)
                                errors.password = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <input className={errors.password && touched.password ? 'input is-danger' : 'input'} type="password" name="password" placeholder="Enter password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                    </div>
                                    {
                                        errors.password && touched.password &&
                                        <div className="has-text-danger is-size-7">
                                            {errors.password}
                                        </div>
                                    }
                                </div>
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
    updatedUser: state.user.updatedUser
});

export default connect(mapStateToProps, {updatePassword})(UpdatePassword);