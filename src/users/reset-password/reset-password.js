import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "../../shared/loading/loading";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask } from "@fortawesome/free-solid-svg-icons";
import { validatePasswordLength } from "../../shared/field-validator";
import {
  resetTokenValid,
  updatePasswordUsingToken,
} from "../../shared/auth.service";

const ResetPassword = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const userId = match.params.userId;
    const resetToken = match.params.resetToken;
    resetTokenValid(userId, resetToken)
      .then((response) => {
        const tokenValid = response;
        if (tokenValid === true) {
          setLoading(false);
        } else {
          setError(
            "The password reset token does not match or has expired. Please request another and try again."
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  }, [match.params.resetToken, match.params.userId]);

  const submitEntry = (values) => {
    setSubmitting(true);
    setSuccess(false);
    setError();

    const data = {
      userId: parseInt(match.params.userId),
      token: match.params.resetToken,
      password: values.password,
    };

    updatePasswordUsingToken(data)
      .then(() => {
        setSuccess(true);
        setSubmitting(false);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    setError(error);
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="column is-8 is-offset-2 form-container">
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
              {success && (
                <div className="notification is-success">
                  Successfully updated password. Please{" "}
                  <Link to="/login">login</Link> to continue.
                </div>
              )}
              {error && <div className="notification is-danger">{error}</div>}
              {!error && !success && (
                <Formik
                  initialValues={{
                    password: "",
                  }}
                  validate={(values) => {
                    let errors = {};
                    if (!validatePasswordLength(values.password))
                      errors.password =
                        "Password must be at least 5 characters long";
                    if (!values.password) errors.password = "Required";
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    submitEntry(values);
                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <form className="form" onSubmit={handleSubmit}>
                      <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                          <input
                            className={
                              errors.password && touched.password
                                ? "input is-danger"
                                : "input"
                            }
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </div>
                        {errors.password && touched.password && (
                          <div className="has-text-danger is-size-7">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <button
                        className={
                          submitting
                            ? "button is-link is-loading"
                            : "button is-link"
                        }
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Update
                      </button>
                      <Link to="/">
                        <button className="button cancel-button">Cancel</button>
                      </Link>
                    </form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      resetToken: PropTypes.string.isRequired,
    }),
  }),
};

export default ResetPassword;
