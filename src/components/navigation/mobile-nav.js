import React from 'react';
import './mobile-nav.css';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { clearUser } from '../../actions/user-actions';
import { clearBooks } from '../../actions/book-actions';
import { clearCategories } from '../../actions/category-actions';
import { clearRatings } from '../../actions/rating-actions';

class MobileNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsVisible: false,
            initialOpen: false
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutsideBurger);
    }
  
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutsideBurger);
    }
  
    setBurgerRef = (node) => {
        this.burgerRef = node;
    }
  
    handleClickOutsideBurger = (event) => {
        if (this.burgerRef && !this.burgerRef.contains(event.target) && this.state.optionsVisible 
            && event.target.id !== 'burger'&& event.target.id !== 'nav-icon3') {
            this.setState({
                optionsVisible: false
            });
        }
    }

    toggleBurger = () => {
        if(!this.state.initialOpen) {
            this.setState({
                initialOpen: true
            });
        }

        this.setState(prevState => ({
            optionsVisible: !prevState.optionsVisible
        }));
    }
      
    logout = () => {
        this.props.clearUser();
        this.props.clearBooks();
        this.props.clearCategories();
        this.props.clearRatings();
        this.props.history.push('/');

        this.setState({
            optionsVisible: false
        });
    }

    render() {
        return (
            <nav id="mobile-nav" className="navbar">
                <div className="container">
                    <div className="navbar-brand" style={{'zIndex': '20'}}>
                        <a id="nav-icon3" className={this.state.optionsVisible ? "open" : null} onClick={this.toggleBurger}>
                            <span id="burger"></span>
                            <span id="burger"></span>
                            <span id="burger"></span>
                            <span id="burger"></span>
                        </a>
                        <Link id="nav-icon" to={this.props.user ? `/shelf/${this.props.user.id}` : '/'} className="navbar-item">
                            <img src="/bookshelf.png" alt="Small bookshelf" />
                        </Link>
                        {
                            this.props.user ?
                            <Link id="mobile-plus" className="user-menu-actions" to="/book-form">
                                <FontAwesomeIcon icon={faPlus} size="lg" color="#f5f5f7" />
                            </Link>
                            :
                            <Link id="mobile-login" className="user-menu-actions" to="/login">
                                <FontAwesomeIcon icon={faAddressCard} size="lg" color="#f5f5f7" />
                            </Link>
                        }
                    </div>
                    <div 
                        id="mobile-menu"
                        ref={this.setBurgerRef} 
                        className={!this.state.initialOpen ? "navbar-menu" : this.state.optionsVisible ? "navbar-menu fade-in-menu" : "navbar-menu fade-out-menu"}>
                        <div 
                            className={!this.state.initialOpen ? "navbar-end" : this.state.optionsVisible ? "navbar-end fade-in-options" : "navbar-end fade-out-options"}>
                            {
                                !this.props.user ?
                                <div className="mobile-options">
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/register">
                                        Register
                                    </NavLink>
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/login">
                                        Login
                                    </NavLink>
                                </div>
                                :
                                <div className="mobile-options">
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to={`/shelf/${this.props.user.id}`}>
                                        Bookshelf
                                    </NavLink>
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/manage-books">
                                        Manage Books
                                    </NavLink>
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/manage-categories">
                                        Manage Categories
                                    </NavLink>
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/manage-ratings" >
                                        Manage Ratings
                                    </NavLink>
                                    <hr className="dropdown-divider"/>
                                    <NavLink className="navbar-item" onClick={this.toggleBurger} to="/my-account">
                                        My Account
                                    </NavLink>
                                    <a onClick={this.logout} className="navbar-item" href="#">
                                        Logout
                                    </a>
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
  
export default connect(mapStateToProps, {clearUser, clearBooks, clearCategories, clearRatings})(withRouter(MobileNav));