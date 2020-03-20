import React from 'react';
import Loading from '../loading/loading';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../verifier';
import { fetchUsers, updateUser } from '../../actions/userActions';

class UpdateUser extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userId: parseInt(props.match.params.id),
            user: null,
            loading: true,
            submitting: false
        };
    }

    componentDidMount() {
        if(!this.props.users) {
            var token = localStorage.getItem('token');
            this.props.fetchUsers(token);
        } else {
            this.setState({
                user: this.props.users.find(x => x.id === this.state.userId),
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.props.users && nextProps.users) {
            this.setState({
                user: nextProps.users.find(x => x.id === this.state.userId),
                loading: false
            });
        }

        if(nextProps.updatedUser) {
            var oldUser = this.props.users.find(b => b.id === nextProps.updatedUser.id);
            var index = this.props.users.indexOf(oldUser);
            this.props.users[index] = nextProps.updatedUser;
            this.props.history.push('/admin/manage-users');
        }
    }

    updateUser(user) {
        this.setState({
            submitting: true
        });

        var token = localStorage.getItem('token');
        this.props.updateUser(user, token);
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
                    <Formik
                        initialValues=
                        {
                            {
                                id: this.state.user.id,
                                email: this.state.user.email,
                                isAdmin: this.state.user.isAdmin
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
                            this.updateUser(values);
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

const mapStateToProps = state => ({
    users: state.user.users,
    updatedUser: state.user.updatedUser
});

export default connect(mapStateToProps, {fetchUsers, updateUser})(withRouter(UpdateUser));