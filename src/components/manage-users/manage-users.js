import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { customStyles } from '../../custom-modal';
import { fetchUsers, deleteUser } from '../../actions/userActions';

class ManageUsers extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            modalIsOpen: false,
            selectedUserId: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.users) {
            this.setState({
                loading: false
            });
        }

        if(nextProps.deletedUser) {
            var deletedUser = this.props.users.find(b => b.id === nextProps.deletedUser.id);
            var index = this.props.users.indexOf(deletedUser);
            this.props.users.splice(index, 1);
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

    handleSubmit = () => {
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
                                    <button className="button is-link" type="submit">
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
                                        {this.props.users.map(user =>
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
                                                <td>{user.isAdmin.toString()}</td>
                                                <td className="has-text-centered">
                                                    <Link to={`/admin/manage-users/${user.id}`} className="button">Edit</Link>
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
    token: state.user.token
});

export default connect(mapStateToProps, {fetchUsers, deleteUser})(ManageUsers);