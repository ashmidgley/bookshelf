import React, { Component } from 'react';
import './navigation.css';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';

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

    render() {
        return(
            <div className="hero-head nav-container">
                <nav className="navbar">
                  <div className="container">
                    <div className="navbar-brand">
                      <Link className="navbar-item" to="/">
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
                          <ul>
                              <NavLink exact activeClassName="active-nav" to="/">Home</NavLink>
                              <NavLink activeClassName="active-nav" to="/admin">Admin</NavLink>
                          </ul>
                        </div>
                      </div>  
                    </div>
                  </div>
                </nav>
            </div>
        );
    }
} export default Navigation;