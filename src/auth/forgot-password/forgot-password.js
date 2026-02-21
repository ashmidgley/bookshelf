import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask } from "@fortawesome/free-solid-svg-icons";
import { validateEmail } from "../../shared/field-validator";
import { sendResetToken } from "../../shared/email.service";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState();

  const submitEntry = (values) => {
    setEmail(values.email);
    setError(null);
    setSubmitting(true);
    sendResetToken(values.email)
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleSuccess = () => {
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleError = (error) => {
    setError(error);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="column is-8 is-offset-2 form-container">
      <Helmet>
        <title>Forgot Password - Bookshelf</title>
        <meta
          name="description"
          content="Forgot your password and can't log in? Enter your email and we'll send you a reset link."
        />
      </Helmet>
      <div className="card custom-card">
        <div className="card-content">
          <div className="media">
            <div className="image-header-container">
              <FontAwesomeIcon icon={faMask} className="mask-icon" size="lg" />
            </div>
          </div>
          {submitted ? (
            <div className="notification is-success">
              Reset password link sent to {email}.
            </div>
          ) : (
            <Formik
              initialValues={{
                email: "",
              }}
              validate={(values) => {
                let errors = {};
                if (!validateEmail(values.email))
                  errors.email = "Incorrect email format";
                if (!values.email) errors.email = "Required";
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
                    <label className="label">Send Password Reset</label>
                    <div className="control">
                      <input
                        className={
                          errors.email && touched.email
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <div className="has-text-danger is-size-7">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="notification is-danger">{error}</div>
                  )}
                  <button
                    className={
                      submitting
                        ? "button is-link is-loading"
                        : "button is-link"
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Send
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
  );
};

export default ForgotPassword;
