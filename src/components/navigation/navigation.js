import React from 'react';
import './navigation.css';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { clearUser } from '../../actions/userActions';
import { clearBooks } from '../../actions/bookActions';
import { clearCategories } from '../../actions/categoryActions';
import { clearRatings } from '../../actions/ratingActions';

class Navigation extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        dropdownVisible: false,
        mobileOptionsVisible: false
      };

      this.setBurgerRef = this.setBurgerRef.bind(this);
      this.setDropdownRef = this.setDropdownRef.bind(this);
      this.handleClickOutsideBurger = this.handleClickOutsideBurger.bind(this);
      this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
    }

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutsideBurger);
      document.addEventListener('mousedown', this.handleClickOutsideDropdown);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutsideBurger);
      document.removeEventListener('mousedown', this.handleClickOutsideDropdown);
    }

    setBurgerRef(node) {
      this.burgerRef = node;
    }

    setDropdownRef(node) {
      this.dropdownRef = node;
    }

    handleClickOutsideBurger(event) {
      if (this.burgerRef && !this.burgerRef.contains(event.target) && this.state.mobileOptionsVisible && event.target.id !== 'burger') {
        this.setState({
          mobileOptionsVisible: false
        });
      }
    }

    handleClickOutsideDropdown(event) {
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

    toggleBurger = () => {
      this.setState(prevState => ({
        mobileOptionsVisible: !prevState.mobileOptionsVisible
      }));
    }
    
    logout = () => {
      this.props.clearUser();
      this.props.clearBooks();
      this.props.clearCategories();
      this.props.clearRatings();
      this.props.history.push('/');

      this.setState({
        dropdownVisible: false,
        mobileOptionsVisible: false
      });
    }

    render() {
        return(
            <div className="hero-head nav-container">
                <nav className="navbar">
                  <div className="container">
                    <div className="navbar-brand">
                      <Link className="navbar-item" to={this.props.user ? `/shelf/${this.props.user.id}` : '/'}>
                        <img id="nav-icon" src="/bookshelf.png" alt="Small bookshelf" />
                      </Link>
                      <a id="burger" role="button" className="navbar-burger burger" onClick={this.toggleBurger}>
                        <span id="burger" aria-hidden="true"></span>
                        <span id="burger" aria-hidden="true"></span>
                        <span id="burger" aria-hidden="true"></span>
                      </a>
                    </div>
                    <div ref={this.setBurgerRef} className={this.state.mobileOptionsVisible ? "navbar-menu is-active" : "navbar-menu"} >
                      <div className="navbar-end">
                          <div id="desktop-options">
                            {this.props.user?
                                <div className={this.state.dropdownVisible ? "dropdown is-right is-active" : "dropdown is-right"}>
                                  <div className="dropdown-trigger">
                                    <button id="dropdown" onClick={this.toggleDropdown} className="button user-menu-actions">
                                      <span id="dropdown">{this.props.user.email}</span>
                                        <span id="dropdown" className="icon is-small">
                                          {this.state.dropdownVisible ? 
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
                              :
                              null
                            }
                          </div>
                          {!this.props.user ?
                            <div className="navbar-item">
                              <div className="buttons">
                                <Link onClick={this.toggleBurger} className="button is-link" to="/register">
                                  <strong>Sign up</strong>
                                </Link>
                                <Link onClick={this.toggleBurger} className="button is-light" to="/login">
                                  Log in
                                </Link>
                              </div>
                            </div>
                            :
                            null
                          }
                          <div id="mobile-options">
                            {this.props.user && this.state.mobileOptionsVisible ?
                                <div>
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
                              :
                              null
                            }
                          </div>
                        </div>
                      </div>  
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
  token: state.user.token,
  user: state.user.user
});

export default connect(mapStateToProps, {clearUser, clearBooks, clearCategories, clearRatings})(withRouter(Navigation));