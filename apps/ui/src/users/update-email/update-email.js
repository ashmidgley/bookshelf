import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask } from "@fortawesome/free-solid-svg-icons";
import { validateEmail } from "../../shared/field-validator";
import { updateEmail, clearUser } from "../../shared/user.service";

const UpdateEmail = ({ history }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitEntry = (values) => {
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");
    const data = {
      email: values.email,
    };

    updateEmail(data, token)
      .then(() => {
        clearUser().then(() => {
          setSubmitting(false);
          history.push("/login");
        });
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    setSubmitting(false);
    setError(error);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  <label className="label">Email</label>
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
                {error && <div className="notification is-danger">{error}</div>}
                <button
                  className={
                    submitting ? "button is-link is-loading" : "button is-link"
                  }
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update
                </button>
                <Link to="/my-account">
                  <button className="button cancel-button">Cancel</button>
                </Link>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

UpdateEmail.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(UpdateEmail);
