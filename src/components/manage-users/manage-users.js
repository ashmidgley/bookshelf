import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { customStyles } from '../../helpers/custom-modal';
import { fetchUsers, deleteUser, clearError } from '../../actions/user-actions';

class ManageUsers extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedUserId: null,
            modalIsOpen: false,
            loading: true,
            success: false,
            error: null
        }
    }

    componentDidMount() {
        if(localStorage.getItem('userIsAdmin') !== 'true') {
            this.props.history.push('/');
            return;
        }

        if(!this.props.users) {
            var token = localStorage.getItem('token');
            this.props.fetchUsers(token);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.users)) {
            this.setState({
                loading: false
            });
            return;
        }

        if(nextProps.error) {
            this.setState({
                error: nextProps.error,
                modalIsOpen: false,
                loading: false,
                submitting: false
            });
            this.props.clearError();
        } else if (this.state.submitting && nextProps.deletedUser) {
            var deletedUser = this.props.users.find(b => b.id === nextProps.deletedUser.id);
            var index = this.props.users.indexOf(deletedUser);
            this.props.users.splice(index, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true
            });
            window.scrollTo(0, 0);
        }
    }

    openModal = (id) => {
        this.setState({
            selectedUserId: id,
            modalIsOpen: true
        });
    }
    
    closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitting: true,
            error: null,
            success: false
        });

        var token = localStorage.getItem('token');
        this.props.deleteUser(this.state.selectedUserId, token);
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container">
                <Helmet>
                    <title>Bookshelf | Manage Users</title>
                </Helmet>
                <div className="card form-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="image-header-container">
                                <FontAwesomeIcon icon={faEye} className="eye-icon" size="lg"/>
                            </div>
                        </div>
                        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                            <form onSubmit={this.handleSubmit}>
                                <div>Are you sure you would like to delete this user?</div>
                                <div className="modal-actions">
                                    <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">
                                        Confirm
                                    </button>
                                    <button id="cancel" className="button" onClick={this.closeModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Modal>
                        <div>
                            <h1 className="title">Users</h1>
                            {
                                this.state.success &&
                                <div className="notification is-primary">Successfully removed entry.</div>
                            }
                            {
                                this.state.error && 
                                <div className="notification is-danger">{this.state.error}</div>
                            }
                            <div className="form-table">
                                <table className="table is-fullwidth is-bordered">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Email</th>
                                            <th>Admin</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.users &&
                                            this.props.users.map(user =>
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
                                                <td>{user.isAdmin.toString()}</td>
                                                <td className="has-text-centered">
                                                    <Link to={`/admin/manage-users/${user.id}`} className="button">
                                                        Edit
                                                    </Link>
                                                </td>
                                                <td className="has-text-centered">
                                                    <button onClick={() => this.openModal(user.id)} className="button">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: state.user.users,
    deletedUser: state.user.deletedUser,
    token: state.user.token,
    error: state.user.error
});

export default connect(mapStateToProps, {fetchUsers, deleteUser, clearError})(ManageUsers);