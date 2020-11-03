import React from "react";
import PropTypes from "prop-types";
import "./mobile-nav.css";
import { withRouter, NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "../../shared/user.service";
import { tokenExpired, parseUser } from "../../shared/token.service";
import { validAnonymousPath } from "../../shared/utils.service";

class MobileNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      optionsVisible: false,
      initialOpen: false,
    };

    this.setBurgerRef = this.setBurgerRef.bind(this);
    this.handleClickOutsideBurger = this.handleClickOutsideBurger.bind(this);
    this.toggleBurger = this.toggleBurger.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideBurger);

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
    document.removeEventListener("mousedown", this.handleClickOutsideBurger);
  }

  setBurgerRef(node) {
    this.burgerRef = node;
  }

  handleClickOutsideBurger(event) {
    if (
      this.burgerRef &&
      !this.burgerRef.contains(event.target) &&
      this.state.optionsVisible &&
      event.target.id !== "burger" &&
      event.target.id !== "nav-icon3"
    ) {
      this.setState({
        optionsVisible: false,
      });
    }
  }

  toggleBurger() {
    if (!this.state.initialOpen) {
      this.setState({
        initialOpen: true,
      });
    }

    this.setState((prevState) => ({
      optionsVisible: !prevState.optionsVisible,
    }));
  }

  logout() {
    clearUser().then(() => {
      this.setState({
        user: null,
        optionsVisible: false,
      });
      this.props.history.push("/");
    });
  }

  render() {
    return (
      <nav id="mobile-nav" className="navbar">
        <div className="container">
          <div className="navbar-brand" style={{ zIndex: "20" }}>
            <button
              id="nav-icon3"
              className={this.state.optionsVisible ? "open" : null}
              onClick={this.toggleBurger}
            >
              <span id="burger"></span>
              <span id="burger"></span>
              <span id="burger"></span>
              <span id="burger"></span>
            </button>
            <Link
              id="mobile-nav-icon"
              to={this.state.user ? `/shelf/${this.state.user.id}` : "/"}
              className="navbar-item"
            >
              <img src="/images/bookshelf.png" alt="Small bookshelf" />
            </Link>
            {this.state.user ? (
              <Link
                id="mobile-plus"
                className="user-menu-actions"
                to="/search-form"
              >
                <FontAwesomeIcon icon={faPlus} size="lg" color="#f5f5f7" />
              </Link>
            ) : (
              <Link id="mobile-login" className="user-menu-actions" to="/login">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  size="lg"
                  color="#f5f5f7"
                />
              </Link>
            )}
          </div>
          <div
            id="mobile-menu"
            ref={this.setBurgerRef}
            className={
              !this.state.initialOpen
                ? "navbar-menu"
                : this.state.optionsVisible
                ? "navbar-menu fade-in-menu"
                : "navbar-menu fade-out-menu"
            }
          >
            <div
              className={
                !this.state.initialOpen
                  ? "navbar-end"
                  : this.state.optionsVisible
                  ? "navbar-end fade-in-options"
                  : "navbar-end fade-out-options"
              }
            >
              {!this.state.user ? (
                <div className="mobile-options">
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/register"
                  >
                    Register
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/login"
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="mobile-options">
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to={`/shelf/${this.state.user.id}`}
                  >
                    Bookshelf
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/manage-books"
                  >
                    Manage Books
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/manage-categories"
                  >
                    Manage Categories
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/manage-ratings"
                  >
                    Manage Ratings
                  </NavLink>
                  <hr className="dropdown-divider" />
                  <NavLink
                    className="navbar-item"
                    onClick={this.toggleBurger}
                    to="/my-account"
                  >
                    My Account
                  </NavLink>
                  <button
                    id="mobile-logout"
                    className="navbar-item logout-button"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

MobileNav.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(MobileNav);
