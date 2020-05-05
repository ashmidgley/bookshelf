import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { customStyles } from '../../helpers/custom-modal';
import { fetchUsers, deleteUser } from '../../actions/user-actions';
import { parseUser } from '../../helpers/auth-helper';

class ManageUsers extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: null,
            selectedUserId: null,
            modalIsOpen: false,
            loading: true,
            success: false,
            error: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem('token');
        if(!token) {
            this.props.history.push('/login');
            return;
        }

        var user = parseUser(token);
        if(user.isAdmin) {
            this.fetchUsers(token);
        } else {
            this.props.history.push('/');
        }
    }

    fetchUsers = (token) => {
        fetchUsers(token)
            .then(response => {
                this.setState({
                    users: response,
                    loading: false
                });
            })
            .catch(error => {
                this.handleError(error);
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
        this.deleteUser(this.state.selectedUserId, token);
    }

    deleteUser = (userId, token) => {
        deleteUser(userId, token)
            .then(response => {
                var oldUser = this.state.users.find(b => b.id === response.id);
                var index = this.state.users.indexOf(oldUser);
                this.state.users.splice(index, 1);
                this.setState({
                    modalIsOpen: false,
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
            modalIsOpen: false,
            loading: false,
            submitting: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container">
                <Helmet>
                    <title>Manage Users - Bookshelf</title>
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
                                <div className="notification is-success">Successfully removed entry.</div>
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
                                            this.state.users &&
                                            this.state.users.map(user =>
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

export default ManageUsers;