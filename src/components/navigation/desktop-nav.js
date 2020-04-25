import React from 'react';
import './desktop-nav.css';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser, clearUser } from '../../actions/user-actions';
import { tokenExpired } from '../../helpers/action-helper';
import { validAnonymousPath } from '../../helpers/route-helper';

class DesktopNav extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            dropdownVisible: false
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutsideDropdown);

        var token = localStorage.getItem('token');
        var expiryDate = localStorage.getItem('expiryDate');
        if(!token || !expiryDate || tokenExpired(expiryDate)) {
            clearUser();
            if(!validAnonymousPath(window.location.pathname)) {
                this.props.history.push('/login');
            }
        } else {
            this.getUser(token);
        }
    }

    componentDidUpdate() {
        var token = localStorage.getItem('token');
        if(!this.state.user && token) {
            this.getUser(token);
        }
    }

    getUser = (token) => {
        getCurrentUser(token)
            .then(response => {
                this.setState({
                    user: response
                });
            })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutsideDropdown);
    }

    setDropdownRef = (node) => {
        this.dropdownRef = node;
    }

    handleClickOutsideDropdown = (event) => {
        if (this.dropdownRef && !this.dropdownRef.contains(event.target) && this.state.dropdownVisible && event.target.id !== 'dropdown') {
            this.setState({
                dropdownVisible: false
            });
        }
    }

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownVisible: !prevState.dropdownVisible
        }));
    }
    
    logout = () => {
        clearUser();
        this.props.history.push('/');

        this.setState({
            user: null,
            dropdownVisible: false
        });
    }

    render() {
        return (
            <nav id="desktop-nav" className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to={this.state.user ? `/shelf/${this.state.user.id}` : '/'}>
                            <img src="/bookshelf.png" alt="Small bookshelf" />
                        </Link>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-end">
                            {
                                !this.state.user ?
                                <div className="navbar-item">
                                    <div className="buttons">
                                        <Link onClick={this.toggleBurger} className="button is-outlined" to="/register">
                                            <strong>Sign up</strong>
                                        </Link>
                                        <Link onClick={this.toggleBurger} className="button desktop-nav-button" to="/login">
                                            Log in
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className={this.state.dropdownVisible ? "dropdown is-right is-active" : "dropdown is-right"}>
                                        <div className="dropdown-trigger">
                                        <button id="dropdown" onClick={this.toggleDropdown} className="button user-menu-actions desktop-nav-button">
                                            <span id="dropdown">{this.state.user.email}</span>
                                            <span id="dropdown" className="icon is-small">
                                                {
                                                    this.state.dropdownVisible ? 
                                                    <FontAwesomeIcon id="dropdown" icon={faAngleUp}/>
                                                    :
                                                    <FontAwesomeIcon id="dropdown" icon={faAngleDown}/>
                                                }
                                            </span>
                                        </button>
                                        </div>
                                        <div ref={this.setDropdownRef} className="dropdown-menu">
                                            <div className="dropdown-content">
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to={`/shelf/${this.state.user.id}`}>
                                                    Bookshelf
                                                </NavLink>
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to="/manage-books">
                                                    Manage Books
                                                </NavLink>
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to="/manage-categories">
                                                    Manage Categories
                                                </NavLink>
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to="/manage-ratings">
                                                    Manage Ratings
                                                </NavLink>
                                                <hr className="dropdown-divider" />
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to="/my-account">
                                                    My Account
                                                </NavLink>
                                                <a onClick={this.logout} href="#" className="dropdown-item">
                                                    Logout
                                                </a>
                                            </div>
                                        </div>  
                                    </div>
                                </div>
                            }
                        </div>
                    </div>  
                </div>
            </nav>
        );
    }
}

export default withRouter(DesktopNav);