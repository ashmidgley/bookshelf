import React, { useEffect, useState } from "react";
import "./my-account.css";
import Loading from "../../shared/loading/loading";
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask } from "@fortawesome/free-solid-svg-icons";
import { parseUser } from "../../shared/token.service";

const MyAccount = () => {
  const [user, setUser] = useState();
  const [shelfPath, setShelfPath] = useState();
  const [shelfPathRef, setShelfPathRef] = useState();
  const [copyText, setCopyText] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = parseUser(token);
    setUser(user);
    setShelfPath(
      `${window.location.protocol}//${window.location.host}/shelf/${user.id}`
    );
    setLoading(false);
  }, []);

  const copyToClipboard = (e) => {
    e.preventDefault();
    shelfPathRef.select();
    document.execCommand("copy");
    e.target.focus();

    setCopyText("Copied to clipboard!");
    setTimeout(
      function () {
        setCopyText(null);
      }.bind(this),
      2000
    );
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="column is-8 is-offset-2 form-container">
          <Helmet>
            <title>My Account - Bookshelf</title>
          </Helmet>
          <div className="card custom-card">
            <div className="card-content">
              <div className="media">
                <div className="image-header-container">
                  <FontAwesomeIcon
                    icon={faMask}
                    className="mask-icon"
                    size="lg"
                  />
                </div>
              </div>
              <form className="form">
                <div className="field">
                  <label className="label">Email</label>
                  <div className="columns is-mobile my-account-columns">
                    <div className="column">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          readOnly
                          value={user ? user.email : ""}
                        />
                      </div>
                    </div>
                    <div className="column is-2">
                      <Link to="/update-email" className="button">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="columns is-mobile my-account-columns">
                    <div className="column">
                      <div className="control">
                        <input
                          className="input"
                          type="password"
                          value="placeholder"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="column is-2">
                      <Link to="/update-password" className="button">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Share Shelf</label>
                  <div
                    className="columns is-mobile my-account-columns"
                    style={{ marginBottom: "0" }}
                  >
                    <div className="column">
                      <div className="control">
                        <input
                          ref={(input) => setShelfPathRef(input)}
                          className="input"
                          type="text"
                          name="id"
                          readOnly
                          value={shelfPath}
                        />
                      </div>
                    </div>
                    {document.queryCommandSupported("copy") && (
                      <div className="column is-2">
                        <button className="button" onClick={copyToClipboard}>
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="is-size-7">{copyText}</p>
                </div>
                <div className="field">
                  <label className="label">Delete My Account</label>
                  <div>
                    <Link to="/delete-account" className="button">
                      <span role="img" aria-label="Dynamite">
                        🧨
                      </span>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(MyAccount);
