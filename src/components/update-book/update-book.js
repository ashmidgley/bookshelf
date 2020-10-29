import React from "react";
import PropTypes from "prop-types";
import "./update-book.css";
import Loading from "../loading/loading";
import moment from "moment";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBook, updateBook } from "../../actions/book-actions";
import { fetchCurrentUserCategories } from "../../actions/category-actions";
import { fetchCurrentUserRatings } from "../../actions/rating-actions";
import { validImage } from "../../helpers/image-helper";

class UpdateBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempImage: "https://bulma.io/images/placeholders/96x96.png",
      bookId: parseInt(props.match.params.id),
      book: null,
      categories: null,
      ratings: null,
      loading: true,
      submitting: false,
      success: false,
      error: null,
    };

    this.getBook = this.getBook.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getRatings = this.getRatings.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidUpdate() {
    if (
      this.state.loading &&
      this.state.book &&
      this.state.categories &&
      this.state.ratings
    ) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    var token = localStorage.getItem("token");
    this.getBook(this.state.bookId);
    this.getCategories(token);
    this.getRatings(token);
  }

  getBook(id) {
    getBook(id)
      .then((response) => {
        this.setState({
          book: response,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  getCategories(token) {
    fetchCurrentUserCategories(token)
      .then((response) => {
        this.setState({
          categories: response,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  getRatings(token) {
    fetchCurrentUserRatings(token)
      .then((response) => {
        this.setState({
          ratings: response,
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

    var book = {
      id: this.state.book.id,
      userId: this.state.book.userId,
      categoryId: values.categoryId,
      ratingId: values.ratingId,
      imageUrl: values.imageUrl,
      title: values.title,
      author: values.author,
      finishedOn: values.finishedOn,
      pageCount: values.pageCount,
      summary: values.summary,
    };

    var token = localStorage.getItem("token");
    this.updateBook(book, token);
  }

  updateBook(book, token) {
    updateBook(book, token)
      .then(() => {
        this.setState({
          submitting: false,
          success: true,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  handleError(error) {
    this.setState({
      error: error.message,
      submitting: false,
      loading: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  getCategoryId() {
    if (this.state.book) {
      return this.state.book.categoryId;
    }
    if (this.state.categories && this.state.categories.length) {
      return this.state.categories[0].id;
    }
    return null;
  }

  getRatingId() {
    if (this.state.book) {
      return this.state.book.ratingId;
    }
    if (this.state.ratings && this.state.ratings.length) {
      return this.state.ratings[0].id;
    }
    return null;
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
                Successfully updated entry.{" "}
                <Link to={`/review/${this.state.book.id}`}>View update?</Link>
              </div>
            )}
            {this.state.error && (
              <div className="notification is-danger">{this.state.error}</div>
            )}
            <Formik
              initialValues={{
                title: this.state.book ? this.state.book.title : "",
                imageUrl: this.state.book ? this.state.book.imageUrl : "",
                author: this.state.book ? this.state.book.author : "",
                finishedOn: this.state.book
                  ? moment(this.state.book.finishedOn).format("YYYY-MM-DD")
                  : "",
                pageCount: this.state.book ? this.state.book.pageCount : "",
                categoryId: this.getCategoryId(),
                ratingId: this.getRatingId(),
                summary: this.state.book ? this.state.book.summary : "",
              }}
              validate={(values) => {
                let errors = {};
                if (!values.title) errors.title = "Required";
                if (!values.imageUrl) errors.imageUrl = "Required";
                if (!validImage(values.imageUrl))
                  errors.imageUrl = "Invalid format";
                if (!values.author) errors.author = "Required";
                if (!values.finishedOn) errors.finishedOn = "Required";
                if (!values.pageCount) errors.pageCount = "Required";
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
                setFieldValue,
              }) => (
                <form className="form" onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                      <input
                        className={
                          errors.title && touched.title
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Image URL</label>
                    <div className="control">
                      <input
                        className={
                          errors.imageUrl && touched.imageUrl
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="imageUrl"
                        placeholder="Enter image URL"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.imageUrl}
                      />
                    </div>
                    {errors.imageUrl === "Invalid format" && (
                      <div className="help is-danger">
                        Invalid image format. Please use a png, jpg or jpeg.
                      </div>
                    )}
                  </div>
                  <div className="has-text-centered">
                    {!errors.imageUrl && values.imageUrl ? (
                      <img
                        src={values.imageUrl}
                        alt={values.imageUrl}
                        width="96"
                        height="96"
                      />
                    ) : (
                      <img src={this.state.tempImage} alt="Placeholder" />
                    )}
                  </div>
                  <div className="field">
                    <label className="label">Author</label>
                    <div className="control">
                      <input
                        className={
                          errors.author && touched.author
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="author"
                        placeholder="Enter author"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.author}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Finished On</label>
                    <div className="control">
                      <input
                        className={
                          errors.finishedOn && touched.finishedOn
                            ? "input is-danger"
                            : "input"
                        }
                        type="date"
                        name="finishedOn"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.finishedOn}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Page Count</label>
                    <div className="control">
                      <input
                        className={
                          errors.pageCount && touched.pageCount
                            ? "input is-danger"
                            : "input"
                        }
                        type="number"
                        name="pageCount"
                        placeholder="Enter page count"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.pageCount}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Category</label>
                    <div className="control radio-container">
                      {this.state.categories &&
                        this.state.categories.map((category) => (
                          <div key={category.id}>
                            <input
                              type="radio"
                              name="categoryId"
                              id={category.id}
                              value={values.categoryId}
                              checked={values.categoryId === category.id}
                              onChange={() => {
                                setFieldValue("categoryId", category.id);
                              }}
                              onBlur={handleBlur}
                            />
                            <label className="radio">
                              {category.description}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Rating</label>
                    <div className="control radio-container">
                      {this.state.ratings &&
                        this.state.ratings.map((rating) => (
                          <div key={rating.id}>
                            <input
                              type="radio"
                              name="ratingId"
                              id={rating.id}
                              value={values.ratingId}
                              checked={values.ratingId === rating.id}
                              onChange={() => {
                                setFieldValue("ratingId", rating.id);
                              }}
                              onBlur={handleBlur}
                            />
                            <label className="radio">
                              {rating.description}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Summary</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        name="summary"
                        placeholder="Enter summary"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.summary}
                      ></textarea>
                    </div>
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
                    Update
                  </button>
                  <Link to="/manage-books">
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

UpdateBook.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default UpdateBook;
