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
        dropdownOpen: false
      };
    }

    dropdownSelected() {
      var result = !this.state.dropdownOpen;
      this.setState({
        dropdownOpen: result
      });
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
                      <Link className="navbar-item" to="/" >
                        <FontAwesomeIcon icon={faBookDead} className="nav-icon" size="2x"/>
                      </Link>
                    </div>
                    <div id="navbarMenu" className="navbar-menu" >
                      <div className="navbar-end">
                          {this.props.user ?
                              <div className={this.state.dropdownOpen ? "dropdown is-right is-active" : "dropdown is-right"}>
                                <div className="dropdown-trigger">
                                  <button onClick={() => this.dropdownSelected()} className="button user-menu-actions" aria-haspopup="true" aria-controls="dropdown-menu">
                                  <span>{this.props.user.email}</span>
                                    <span className="icon is-small">
                                      {this.state.dropdownOpen ? 
                                        <FontAwesomeIcon icon={faAngleUp} size="md"/>
                                        :
                                        <FontAwesomeIcon icon={faAngleDown} size="md"/>
                                      }
                                    </span>
                                  </button>
                                </div>
                                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                  <div className="dropdown-content">
                                    <NavLink to={`/shelf/${this.props.user.id}`} className="dropdown-item" activeClassName="is-active" >
                                      Bookshelf
                                    </NavLink>
                                    <NavLink to="/admin" className="dropdown-item" activeClassName="is-active" >
                                      Manage
                                    </NavLink>
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