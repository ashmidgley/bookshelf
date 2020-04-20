import React from 'react';
import './desktop-nav.css';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { clearUser } from '../../actions/user-actions';
import { clearBooks } from '../../actions/book-actions';
import { clearCategories } from '../../actions/category-actions';
import { clearRatings } from '../../actions/rating-actions';

class DesktopNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownVisible: false
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutsideDropdown);
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
        this.props.clearUser();
        this.props.clearBooks();
        this.props.clearCategories();
        this.props.clearRatings();
        this.props.history.push('/');

        this.setState({
            dropdownVisible: false
        });
    }

    render() {
        return (
            <nav id="desktop-nav" className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to={this.props.user ? `/shelf/${this.props.user.id}` : '/'}>
                            <img src="/bookshelf.png" alt="Small bookshelf" />
                        </Link>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-end">
                            {
                                !this.props.user ?
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
                                            <span id="dropdown">{this.props.user.email}</span>
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
                                                <NavLink onClick={this.toggleDropdown} className="dropdown-item" activeClassName="is-active" to={`/shelf/${this.props.user.id}`}>
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

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user.user
});

export default connect(mapStateToProps, {clearUser, clearBooks, clearCategories, clearRatings})(withRouter(DesktopNav));