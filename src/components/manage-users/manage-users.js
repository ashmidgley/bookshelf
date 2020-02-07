import React, { Component } from 'react';
import './manage-users.css';
import { connect } from 'react-redux';
import { fetchUsers } from '../../actions/userActions';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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
    }

    componentDidMount() {
        this.props.fetchUsers(this.props.token);
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.users.map(user =>
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
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
    token: state.user.token
  });

export default connect(mapStateToProps, {fetchUsers})(ManageUsers);