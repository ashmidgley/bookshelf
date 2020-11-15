import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "../../shared/loading/loading";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { validateEmail } from "../../shared/field-validator";
import { getUser, updateUser } from "../../shared/user.service";

const UpdateUser = ({ match }) => {
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setUserId(parseInt(match.params.id));
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    getUser(userId, token)
      .then((response) => {
        setUser(response);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);

  const submitEntry = (values) => {
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    if (values.passwordResetToken === "") {
      values.passwordResetToken = null;
    }

    if (
      values.passwordResetExpiry === "" ||
      values.passwordResetExpiry === "Invalid date"
    ) {
      values.passwordResetExpiry = null;
    }

    const token = localStorage.getItem("token");
    updateUser(values, token)
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    setError(error);
    setSubmitting(false);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                    icon={faPlus}
                    className="plus-icon"
                    size="lg"
                  />
                </div>
              </div>
              {success && (
                <div className="notification is-success">
                  Successfully updated user.
                </div>
              )}
              {error && <div className="notification is-danger">{error}</div>}
              <Formik
                initialValues={{
                  id: user ? user.id : null,
                  email: user ? user.email : null,
                  isAdmin: user ? user.isAdmin : null,
                  passwordResetToken: user ? user.passwordResetToken : null,
                  passwordResetExpiry: user
                    ? moment(user.passwordResetExpiry).format("YYYY-MM-DD")
                    : null,
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
                  setFieldValue,
                }) => (
                  <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                      <label className="label">Id</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="id"
                          value={values.id}
                          readOnly
                        />
                      </div>
                    </div>
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
                    <div className="field">
                      <label className="label">Admin</label>
                      <div className="control radio-container">
                        <div>
                          <input
                            type="radio"
                            name="isAdmin"
                            value={values.isAdmin}
                            checked={values.isAdmin === true}
                            onChange={() => {
                              setFieldValue("isAdmin", true);
                            }}
                            onBlur={handleBlur}
                          />
                          <label className="radio">True</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="isAdmin"
                            value={values.isAdmin}
                            checked={values.isAdmin === false}
                            onChange={() => {
                              setFieldValue("isAdmin", false);
                            }}
                            onBlur={handleBlur}
                          />
                          <label className="radio">False</label>
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Reset Token</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="passwordResetToken"
                          placeholder="Enter password reset token"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.passwordResetToken}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Reset Expiry</label>
                      <div className="control">
                        <input
                          className="input"
                          type="date"
                          name="passwordResetExpiry"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.passwordResetExpiry}
                        />
                      </div>
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
                    <Link to="/admin/manage-users">
                      <button className="button cancel-button">Cancel</button>
                    </Link>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

UpdateUser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default withRouter(UpdateUser);
