import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./update-book.css";
import Loading from "../../shared/loading/loading";
import moment from "moment";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBook, updateBook } from "../../shared/book.service";
import { fetchCurrentUserCategories } from "../../shared/category.service";
import { fetchCurrentUserRatings } from "../../shared/rating.service";
import { validImage } from "../../shared/image-validator";
import { combineLatest } from "rxjs";

const UpdateBook = ({ match }) => {
  const [book, setBook] = useState();
  const [categories, setCategories] = useState();
  const [ratings, setRatings] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const bookId = parseInt(match.params.id);
    const token = localStorage.getItem("token");

    combineLatest([
      getBook(bookId),
      fetchCurrentUserCategories(token),
      fetchCurrentUserRatings(token),
    ]).subscribe(
      ([book, categories, ratings]) => {
        setBook(book);
        setCategories(categories);
        setRatings(ratings);
        setLoading(false);
      },
      (error) => {
        handleError(error);
      }
    );
  }, []);

  const submitEntry = (values) => {
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    const update = {
      id: book.id,
      userId: book.userId,
      categoryId: values.categoryId,
      ratingId: values.ratingId,
      imageUrl: values.imageUrl,
      title: values.title,
      author: values.author,
      finishedOn: values.finishedOn,
      pageCount: values.pageCount,
      summary: values.summary,
    };

    const token = localStorage.getItem("token");
    updateBook(update, token)
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
    setError(error.message);
    setSubmitting(false);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryId = () => {
    if (book) {
      return book.categoryId;
    }
    if (categories && categories.length) {
      return categories[0].id;
    }
    return null;
  };

  const getRatingId = () => {
    if (book) {
      return book.ratingId;
    }
    if (ratings && ratings.length) {
      return ratings[0].id;
    }
    return null;
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
                  Successfully updated entry.{" "}
                  <Link to={`/review/${book.id}`}>View update?</Link>
                </div>
              )}
              {error && <div className="notification is-danger">{error}</div>}
              <Formik
                initialValues={{
                  title: book ? book.title : "",
                  imageUrl: book ? book.imageUrl : "",
                  author: book ? book.author : "",
                  finishedOn: book
                    ? moment(book.finishedOn).format("YYYY-MM-DD")
                    : "",
                  pageCount: book ? book.pageCount : "",
                  categoryId: getCategoryId(),
                  ratingId: getRatingId(),
                  summary: book ? book.summary : "",
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
                        <img
                          src={process.env.REACT_APP_TEMP_IMAGE}
                          alt="Placeholder"
                        />
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
                        {categories &&
                          categories.map((category) => (
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
                        {ratings &&
                          ratings.map((rating) => (
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
                        submitting
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
      )}
    </>
  );
};

UpdateBook.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default UpdateBook;
