import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./desktop-nav.css";
import { withRouter, NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "../../shared/user.service";
import { tokenExpired, parseUser } from "../../shared/token.service";
import { validAnonymousPath } from "../../shared/utils.service";

const DesktopNav = ({ history }) => {
  const [user, setUser] = useState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownRef, setDropdownRef] = useState();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDropdown);

    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate || tokenExpired(expiryDate)) {
      clearUser().then(() => {
        if (!validAnonymousPath(window.location.pathname)) {
          history.push("/login");
        }
      });
    } else {
      setUser(parseUser(token));
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user && token) {
      setUser(parseUser(token));
    } else if (user && !token) {
      setUser(null);
    }
  });

  const handleClickOutsideDropdown = (event) => {
    if (
      dropdownRef &&
      !dropdownRef.contains(event.target) &&
      dropdownVisible &&
      event.target.id !== "dropdown"
    ) {
      setDropdownVisible(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const logout = () => {
    clearUser().then(() => {
      setUser(null);
      setDropdownVisible(false);
      history.push("/");
    });
  };

  return (
    <nav id="desktop-nav" className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to={user ? `/shelf/${user.id}` : "/"}>
            <img src="/images/bookshelf.png" alt="Small bookshelf" />
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            {!user ? (
              <div className="navbar-item">
                <div className="buttons">
                  <Link className="button is-outlined" to="/register">
                    <strong>Sign up</strong>
                  </Link>
                  <Link className="button desktop-nav-button" to="/login">
                    Log in
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={
                    dropdownVisible
                      ? "dropdown is-right is-active"
                      : "dropdown is-right"
                  }
                >
                  <div className="dropdown-trigger">
                    <button
                      id="dropdown"
                      onClick={toggleDropdown}
                      className="button user-menu-actions desktop-nav-button"
                    >
                      <span id="dropdown">{user.email}</span>
                      <span id="dropdown" className="icon is-small">
                        {dropdownVisible ? (
                          <FontAwesomeIcon id="dropdown" icon={faAngleUp} />
                        ) : (
                          <FontAwesomeIcon id="dropdown" icon={faAngleDown} />
                        )}
                      </span>
                    </button>
                  </div>
                  <div ref={setDropdownRef} className="dropdown-menu">
                    <div className="dropdown-content">
                      <NavLink
                        onClick={toggleDropdown}
                        className="dropdown-item"
                        activeClassName="is-active"
                        to={`/shelf/${user.id}`}
                      >
                        Bookshelf
                      </NavLink>
                      <NavLink
                        onClick={toggleDropdown}
                        className="dropdown-item"
                        activeClassName="is-active"
                        to="/manage-books"
                      >
                        Manage Books
                      </NavLink>
                      <NavLink
                        onClick={toggleDropdown}
                        className="dropdown-item"
                        activeClassName="is-active"
                        to="/manage-categories"
                      >
                        Manage Categories
                      </NavLink>
                      <NavLink
                        onClick={toggleDropdown}
                        className="dropdown-item"
                        activeClassName="is-active"
                        to="/manage-ratings"
                      >
                        Manage Ratings
                      </NavLink>
                      <hr className="dropdown-divider" />
                      <NavLink
                        onClick={toggleDropdown}
                        className="dropdown-item"
                        activeClassName="is-active"
                        to="/my-account"
                      >
                        My Account
                      </NavLink>
                      <button
                        id="desktop-logout"
                        className="dropdown-item"
                        onClick={logout}
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
};

DesktopNav.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(DesktopNav);
