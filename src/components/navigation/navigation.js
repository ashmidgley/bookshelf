import React, { Component } from 'react';
import './navigation.css';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/userActions';
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

    dropdownSelected = () => {
      var result = !this.state.dropdownOpen;
      this.setState({
        dropdownOpen: result
      });
    }

    logout = () => {
      this.props.logout();
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
                      <span className={this.state.dropdownOpen ? "navbar-burger burger is-active" : "navbar-burger burger"} 
                        onClick={this.dropdownSelected}
                        data-target="navbarMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    </div>
                    <div id="navbarMenu" className={this.state.dropdownOpen ? "navbar-menu is-active" : "navbar-menu"} >
                      <div className="navbar-end">
                        <div className="tabs is-right">
                          {this.props.user ?
                            <ul>
                              <NavLink activeClassName="active-nav" to={`/shelf/${this.props.user.id}`}>Shelf</NavLink>
                              <NavLink activeClassName="active-nav" to="/admin">Manage</NavLink>
                              <NavLink activeClassName="active-nav" onClick={this.logout} to="#">Logout</NavLink>
                            </ul>
                            :
                            <ul>
                              <NavLink activeClassName="active-nav" to="/login">Login</NavLink>
                              <NavLink activeClassName="active-nav" to="/register">Register</NavLink>
                            </ul>
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

export default withRouter(connect(mapStateToProps, {logout, clearBooks, clearCategories, clearRatings})(Navigation));