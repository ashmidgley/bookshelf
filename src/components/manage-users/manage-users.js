import React, { Component } from 'react';
import './manage-users.css';
import { connect } from 'react-redux';
import { fetchUsers, deleteUser } from '../../actions/userActions';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Loading from '../loading/loading';
import { Link } from 'react-router-dom';

class ManageUsers extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
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

    deleteUser(userId) {
        var token = localStorage.getItem('token');
        this.props.deleteUser(userId, token);
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 admin-container">
                <Helmet>
                    <title>Bookshelf | Manage Users</title>
                </Helmet>
                <div className="card admin-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="admin-image-header-container">
                                <FontAwesomeIcon icon={faEye} className="admin-icon" size="lg"/>
                            </div>
                        </div>
                        <div>
                            <h1 className="title">Users</h1>
                            <div className="admin-table">
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
                                                    <button onClick={() => this.deleteUser(user.id)} className="button">Delete</button>
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