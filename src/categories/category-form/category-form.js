import React from "react";
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

class CategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: props.match.params.id ? "Update" : "Create",
      categoryId: parseInt(props.match.params.id),
      category: null,
      loading: true,
      submitting: false,
      success: false,
      error: null,
    };

    this.getCategory = this.getCategory.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.state.categoryId) {
      this.getCategory(this.state.categoryId);
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  getCategory(categoryId) {
    getCategory(categoryId)
      .then((response) => {
        this.setState({
          category: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  submitEntry(values) {
    this.setState({
      submitting: true,
      success: false,
      error: null,
    });

    var category = {
      description: values.description,
      code: values.code,
    };

    var token = localStorage.getItem("token");
    if (!this.props.match.params.id) {
      this.createCategory(category, token);
    } else {
      category.id = this.state.category.id;
      category.userId = this.state.category.userId;
      this.updateCategory(category, token);
    }
  }

  createCategory(category, token) {
    createCategory(category, token)
      .then(() => {
        this.handleSuccess();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  updateCategory(category, token) {
    updateCategory(category, token)
      .then(() => {
        this.handleSuccess();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  handleError(error) {
    this.setState({
      error: error,
      loading: false,
      submitting: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  handleSuccess() {
    this.setState({
      submitting: false,
      success: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
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
            {this.state.success && (
              <div className="notification is-success">
                Successfully {this.state.action.toLowerCase()}d category.{" "}
                <Link to="/manage-categories">View?</Link>
              </div>
            )}
            {this.state.error && (
              <div className="notification is-danger">{this.state.error}</div>
            )}
            <Formik
              initialValues={{
                description: this.state.category
                  ? this.state.category.description
                  : "",
                code: this.state.category ? this.state.category.code : "",
              }}
              validate={(values) => {
                let errors = {};
                if (!values.description) errors.description = "Required";
                if (!values.code) errors.code = "Required";
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.submitEntry(values);
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
                      this.state.submitting
                        ? "button is-link is-loading"
                        : "button is-link"
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {this.state.action}
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
    );
  }
}

CategoryForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default CategoryForm;
