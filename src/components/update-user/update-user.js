import React from 'react';
import Loading from '../loading/loading';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../helpers/field-validator';
import { getUser, updateUser } from '../../actions/user-actions';

class UpdateUser extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userId: parseInt(props.match.params.id),
            user: null,
            loading: true,
            submitting: false,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem('token');
        this.getUser(this.state.userId, token);
    }

    getUser = (id, token) => {
        getUser(id, token)
            .then(response => {
                this.setState({
                    user: response,
                    loading: false
                });
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        if(values.passwordResetToken === "") {
            values.passwordResetToken = null;
        }

        if(values.passwordResetExpiry === "" || values.passwordResetExpiry === "Invalid date") {
            values.passwordResetExpiry = null;
        }

        var token = localStorage.getItem('token');
        this.updateUser(values, token);
    }

    updateUser = (values, token) => {
        updateUser(values, token)
            .then(() => {
                this.setState({
                    submitting: false,
                    success: true
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleError = (error) => {
        this.setState({
            error: error,
            submitting: false,
            loading: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container"> 
                <div className="card custom-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg"/>
                        </div>
                    </div>
                    {
                        this.state.success && 
                        <div className="notification is-success">Successfully updated user.</div>
                    }
                    {
                        this.state.error && 
                        <div className="notification is-danger">{this.state.error}</div>
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                id: this.state.user ? this.state.user.id : null,
                                email: this.state.user ? this.state.user.email : null,
                                isAdmin: this.state.user ? this.state.user.isAdmin : null,
                                passwordResetToken: this.state.user ? this.state.user.passwordResetToken : null,
                                passwordResetExpiry: this.state.user ? moment(this.state.user.passwordResetExpiry).format('YYYY-MM-DD') : null
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
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Id</label>
                                    <div className="control">
                                        <input className='input' type="text" name="id" value={values.id} readOnly />
                                    </div>
                                </div>
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
                                <div className="field">
                                    <label className="label">Admin</label>
                                    <div className="control radio-container">
                                        <div> 
                                            <input type="radio" name="isAdmin" value={values.isAdmin} checked={values.isAdmin === true} onChange={() => {setFieldValue('isAdmin', true)}} onBlur={handleBlur} />
                                            <label className="radio">True</label>
                                        </div>
                                        <div> 
                                            <input type="radio" name="isAdmin" value={values.isAdmin} checked={values.isAdmin === false} onChange={() => {setFieldValue('isAdmin', false)}} onBlur={handleBlur} />
                                            <label className="radio">False</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Reset Token</label>
                                    <div className="control">
                                        <input className="input" type="text" name="passwordResetToken" placeholder="Enter password reset token" onChange={handleChange} onBlur={handleBlur} value={values.passwordResetToken} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Reset Expiry</label>
                                    <div className="control">
                                        <input className="input" type="date" name="passwordResetExpiry" onChange={handleChange} onBlur={handleBlur} value={values.passwordResetExpiry} />
                                    </div>
                                </div>
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>
                                    Update
                                </button>
                                <Link to="/admin/manage-users">
                                    <button className="button cancel-button">
                                        Cancel
                                    </button>
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

export default withRouter(UpdateUser);