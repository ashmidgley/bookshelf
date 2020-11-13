import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./mobile-nav.css";
import { withRouter, NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "../../shared/user.service";
import { tokenExpired, parseUser } from "../../shared/token.service";
import { validAnonymousPath } from "../../shared/utils.service";

const MobileNav = ({ history }) => {
  const [user, setUser] = useState();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [initialOpen, setInitialOpen] = useState(false);
  const [burgerRef, setBurgerRef] = useState();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideBurger);

    var token = localStorage.getItem("token");
    var expiryDate = localStorage.getItem("expiryDate");
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
      document.removeEventListener("mousedown", handleClickOutsideBurger);
    };
  }, []);

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (!user && token) {
      setUser(parseUser(token));
    } else if (user && !token) {
      setUser(null);
    }
  }, [localStorage.getItem("token")]);

  const handleClickOutsideBurger = (event) => {
    if (
      burgerRef &&
      !burgerRef.contains(event.target) &&
      optionsVisible &&
      event.target.id !== "burger" &&
      event.target.id !== "nav-icon3"
    ) {
      setOptionsVisible(false);
    }
  };

  const toggleBurger = () => {
    if (!initialOpen) {
      setInitialOpen(true);
    }

    setOptionsVisible(!optionsVisible);
  };

  const logout = () => {
    clearUser().then(() => {
      setUser(null);
      setOptionsVisible(false);
      history.push("/");
    });
  };

  return (
    <nav id="mobile-nav" className="navbar">
      <div className="container">
        <div className="navbar-brand" style={{ zIndex: "20" }}>
          <button
            id="nav-icon3"
            className={optionsVisible ? "open" : null}
            onClick={toggleBurger}
          >
            <span id="burger"></span>
            <span id="burger"></span>
            <span id="burger"></span>
            <span id="burger"></span>
          </button>
          <Link
            id="mobile-nav-icon"
            to={user ? `/shelf/${user.id}` : "/"}
            className="navbar-item"
          >
            <img src="/images/bookshelf.png" alt="Small bookshelf" />
          </Link>
          {user ? (
            <Link
              id="mobile-plus"
              className="user-menu-actions"
              to="/search-form"
            >
              <FontAwesomeIcon icon={faPlus} size="lg" color="#f5f5f7" />
            </Link>
          ) : (
            <Link id="mobile-login" className="user-menu-actions" to="/login">
              <FontAwesomeIcon icon={faAddressCard} size="lg" color="#f5f5f7" />
            </Link>
          )}
        </div>
        <div
          id="mobile-menu"
          ref={setBurgerRef}
          className={
            !initialOpen
              ? "navbar-menu"
              : optionsVisible
              ? "navbar-menu fade-in-menu"
              : "navbar-menu fade-out-menu"
          }
        >
          <div
            className={
              !initialOpen
                ? "navbar-end"
                : optionsVisible
                ? "navbar-end fade-in-options"
                : "navbar-end fade-out-options"
            }
          >
            {!user ? (
              <div className="mobile-options">
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/register"
                >
                  Register
                </NavLink>
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/login"
                >
                  Login
                </NavLink>
              </div>
            ) : (
              <div className="mobile-options">
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to={`/shelf/${user.id}`}
                >
                  Bookshelf
                </NavLink>
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/manage-books"
                >
                  Manage Books
                </NavLink>
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/manage-categories"
                >
                  Manage Categories
                </NavLink>
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/manage-ratings"
                >
                  Manage Ratings
                </NavLink>
                <hr className="dropdown-divider" />
                <NavLink
                  className="navbar-item"
                  onClick={toggleBurger}
                  to="/my-account"
                >
                  My Account
                </NavLink>
                <button
                  id="mobile-logout"
                  className="navbar-item logout-button"
                  onClick={logout}
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
};

MobileNav.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(MobileNav);
