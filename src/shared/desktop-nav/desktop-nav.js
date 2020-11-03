import React from "react";
import PropTypes from "prop-types";
import "./desktop-nav.css";
import { withRouter, NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "../../shared/user.service";
import { tokenExpired, parseUser } from "../../shared/token.service";
import { validAnonymousPath } from "../../shared/utils.service";

class DesktopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      dropdownVisible: false,
    };

    this.setDropdownRef = this.setDropdownRef.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(
      this
    );
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideDropdown);

    var token = localStorage.getItem("token");
    var expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate || tokenExpired(expiryDate)) {
      clearUser().then(() => {
        if (!validAnonymousPath(window.location.pathname)) {
          this.props.history.push("/login");
        }
      });
    } else {
      this.setState({
        user: parseUser(token),
      });
    }
  }

  componentDidUpdate() {
    var token = localStorage.getItem("token");
    if (!this.state.user && token) {
      this.setState({
        user: parseUser(token),
      });
    } else if (this.state.user && !token) {
      this.setState({
        user: null,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
  }

  setDropdownRef(node) {
    this.dropdownRef = node;
  }

  handleClickOutsideDropdown(event) {
    if (
      this.dropdownRef &&
      !this.dropdownRef.contains(event.target) &&
      this.state.dropdownVisible &&
      event.target.id !== "dropdown"
    ) {
      this.setState({
        dropdownVisible: false,
      });
    }
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownVisible: !prevState.dropdownVisible,
    }));
  }

  logout() {
    clearUser().then(() => {
      this.setState({
        user: null,
        dropdownVisible: false,
      });
      this.props.history.push("/");
    });
  }

  render() {
    return (
      <nav id="desktop-nav" className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <Link
              className="navbar-item"
              to={this.state.user ? `/shelf/${this.state.user.id}` : "/"}
            >
              <img src="/images/bookshelf.png" alt="Small bookshelf" />
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              {!this.state.user ? (
                <div className="navbar-item">
                  <div className="buttons">
                    <Link
                      onClick={this.toggleBurger}
                      className="button is-outlined"
                      to="/register"
                    >
                      <strong>Sign up</strong>
                    </Link>
                    <Link
                      onClick={this.toggleBurger}
                      className="button desktop-nav-button"
                      to="/login"
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className={
                      this.state.dropdownVisible
                        ? "dropdown is-right is-active"
                        : "dropdown is-right"
                    }
                  >
                    <div className="dropdown-trigger">
                      <button
                        id="dropdown"
                        onClick={this.toggleDropdown}
                        className="button user-menu-actions desktop-nav-button"
                      >
                        <span id="dropdown">{this.state.user.email}</span>
                        <span id="dropdown" className="icon is-small">
                          {this.state.dropdownVisible ? (
                            <FontAwesomeIcon id="dropdown" icon={faAngleUp} />
                          ) : (
                            <FontAwesomeIcon id="dropdown" icon={faAngleDown} />
                          )}
                        </span>
                      </button>
                    </div>
                    <div ref={this.setDropdownRef} className="dropdown-menu">
                      <div className="dropdown-content">
                        <NavLink
                          onClick={this.toggleDropdown}
                          className="dropdown-item"
                          activeClassName="is-active"
                          to={`/shelf/${this.state.user.id}`}
                        >
                          Bookshelf
                        </NavLink>
                        <NavLink
                          onClick={this.toggleDropdown}
                          className="dropdown-item"
                          activeClassName="is-active"
                          to="/manage-books"
                        >
                          Manage Books
                        </NavLink>
                        <NavLink
                          onClick={this.toggleDropdown}
                          className="dropdown-item"
                          activeClassName="is-active"
                          to="/manage-categories"
                        >
                          Manage Categories
                        </NavLink>
                        <NavLink
                          onClick={this.toggleDropdown}
                          className="dropdown-item"
                          activeClassName="is-active"
                          to="/manage-ratings"
                        >
                          Manage Ratings
                        </NavLink>
                        <hr className="dropdown-divider" />
                        <NavLink
                          onClick={this.toggleDropdown}
                          className="dropdown-item"
                          activeClassName="is-active"
                          to="/my-account"
                        >
                          My Account
                        </NavLink>
                        <button
                          id="desktop-logout"
                          className="dropdown-item"
                          onClick={this.logout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

DesktopNav.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(DesktopNav);
