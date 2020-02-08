import React, { Component } from 'react';
import './navigation.css';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { clearUser } from '../../actions/userActions';
import { clearBooks } from '../../actions/bookActions';
import { clearCategories } from '../../actions/categoryActions';
import { clearRatings } from '../../actions/ratingActions';

class Navigation extends Component {

    constructor(props) {
      super(props);
      this.state = {
        dropdownVisible: false
      };
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.globalClickListener)
    }

    globalClickListener = () => {
      this.setState({dropdownVisible: false}, () => {
        window.removeEventListener('click', this.globalClickListener)
      })
    }

    toggleDropdown = (event) => {
      event.stopPropagation()
      this.setState(prevState => ({dropdownVisible: !prevState.dropdownVisible}), () => {
        if (this.state.dropdownVisible) {
          window.addEventListener('click', this.globalClickListener)
        }
      })
    }

    logout = () => {
      this.props.clearUser();
      this.props.clearBooks();
      this.props.clearCategories();
      this.props.clearRatings();
      this.props.history.push('/');
    }

    render() {
        return(
            <div className="hero-head nav-container">
                <nav className="navbar">
                  <div className="container">
                    <div className="navbar-brand">
                      <Link className="navbar-item" to={this.props.user ? `/shelf/${this.props.user.id}` : '/'}>
                        <FontAwesomeIcon icon={faBookDead} className="nav-icon" size="2x"/>
                      </Link>
                    </div>
                    <div id="navbarMenu" className="navbar-menu" >
                      <div className="navbar-end">
                          {this.props.user ?
                              <div className={this.state.dropdownVisible ? "dropdown is-right is-active" : "dropdown is-right"}>
                                <div className="dropdown-trigger">
                                  <button onClick={this.toggleDropdown} className="button user-menu-actions">
                                  <span>{this.props.user.email}</span>
                                    <span className="icon is-small">
                                      {this.state.dropdownVisible ? 
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                        :
                                        <FontAwesomeIcon icon={faAngleDown}/>
                                      }
                                    </span>
                                  </button>
                                </div>
                                <div className="dropdown-menu">
                                  <div className="dropdown-content">
                                    <NavLink to={`/shelf/${this.props.user.id}`} className="dropdown-item" activeClassName="is-active" >
                                      Bookshelf
                                    </NavLink>
                                    <NavLink to="/admin/manage-books" className="dropdown-item" activeClassName="is-active" >
                                      Manage Books
                                    </NavLink>
                                    <NavLink to="/admin/manage-categories" className="dropdown-item" activeClassName="is-active" >
                                      Manage Categories
                                    </NavLink>
                                    <NavLink to="/admin/manage-ratings" className="dropdown-item" activeClassName="is-active" >
                                      Manage Ratings
                                    </NavLink>
                                    {this.props.user.isAdmin === "true" ?
                                      <NavLink to="/admin/manage-users" className="dropdown-item" activeClassName="is-active" >
                                        Manage Users
                                      </NavLink>
                                      :
                                      null
                                    }
                                    <hr className="dropdown-divider" />
                                    <a onClick={this.logout} href="#" className="dropdown-item">
                                      Logout
                                    </a>
                                  </div>
                                </div>
                              </div>  
                            :
                            <div className="tabs is-right">
                              <ul>
                                <NavLink activeClassName="active-nav" to="/login">Login</NavLink>
                                <NavLink activeClassName="active-nav" to="/register">Register</NavLink>
                              </ul>
                            </div>
                          }
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

export default withRouter(connect(mapStateToProps, {clearUser, clearBooks, clearCategories, clearRatings})(Navigation));