import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "../../shared/loading/loading";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  getCategory,
  createCategory,
  updateCategory,
} from "../../shared/category.service";

const CategoryForm = ({ match }) => {
  const [action, setAction] = useState();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    setAction(match.params.id ? "Update" : "Create");

    if (match.params.id) {
      const categoryId = parseInt(match.params.id);
      getCategory(categoryId)
        .then((response) => {
          setCategory(response);
          setLoading(false);
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      setLoading(false);
    }
  }, [match.params.id]);

  const submitEntry = (values) => {
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    let submission = {
      description: values.description,
      code: values.code,
    };

    const token = localStorage.getItem("token");
    if (!match.params.id) {
      createCategory(submission, token)
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      submission.id = category.id;
      submission.userId = category.userId;
      updateCategory(submission, token)
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  const handleError = (error) => {
    setError(error);
    setLoading(false);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    setSubmitting(false);
    setSuccess(true);
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
                  Successfully {action.toLowerCase()}d category.{" "}
                  <Link to="/manage-categories">View?</Link>
                </div>
              )}
              {error && <div className="notification is-danger">{error}</div>}
              <Formik
                initialValues={{
                  description: category ? category.description : "",
                  code: category ? category.code : "",
                }}
                validate={(values) => {
                  let errors = {};
                  if (!values.description) errors.description = "Required";
                  if (!values.code) errors.code = "Required";
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
                      <label className="label">Description</label>
                      <div className="control">
                        <input
                          className={
                            errors.description && touched.description
                              ? "input is-danger"
                              : "input"
                          }
                          type="text"
                          name="description"
                          placeholder="Enter description"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.description}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Code</label>
                      <div className="control">
                        <input
                          className={
                            errors.code && touched.code
                              ? "input is-danger"
                              : "input"
                          }
                          type="text"
                          name="code"
                          placeholder="Enter code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.code}
                        />
                      </div>
                      <a href="https://emojipedia.org" className="is-size-7">
                        Emojipedia
                      </a>
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
                      {action}
                    </button>
                    <Link to="/manage-categories">
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

CategoryForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default CategoryForm;
