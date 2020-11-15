import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask } from "@fortawesome/free-solid-svg-icons";
import { clearUser, deleteUser } from "../../shared/user.service";
import { parseUser } from "../../shared/token.service";

const DeleteAccount = ({ history }) => {
  const [submitting, setSubmitting] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");
    const user = parseUser(token);

    deleteUser(user.id, token)
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleSuccess = () => {
    setSubmitting(false);

    clearUser().then(() => {
      history.push("/");
    });
  };

  const handleError = (error) => {
    setError(error);
    setSubmitting(false);
  };

  return (
    <div className="column is-8 is-offset-2 form-container">
      <div className="card custom-card">
        <div className="card-content">
          <div className="media">
            <div className="image-header-container">
              <FontAwesomeIcon icon={faMask} className="mask-icon" size="lg" />
            </div>
          </div>
          {error && <div className="notification is-danger">{error}</div>}
          <div className="has-text-centered">
            <div>
              <p>Are you sure you want to delete your account?</p>
              <p>
                <b>
                  All data will be unrecoverable once the operation is complete.
                </b>
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleSubmit}
                className={
                  submitting
                    ? "button is-danger is-loading"
                    : "button is-danger"
                }
              >
                Confirm
              </button>
              <Link to="/my-account" className="button cancel-button">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteAccount.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(DeleteAccount);
