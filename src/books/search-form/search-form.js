import React, { useEffect, useState } from "react";
import "./search-form.css";
import { Link, Redirect } from "react-router-dom";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  searchBooks,
  searchBooksByTitle,
  searchBooksByAuthor,
} from "../../shared/search.service";

const SearchForm = () => {
  const [searchResults, setSearchResults] = useState();
  const [selectedBook, setSelectedBook] = useState();
  const [searching, setSearching] = useState(false);
  const [titleChecked, setTitleChecked] = useState(true);
  const [authorChecked, setAuthorChecked] = useState(true);
  const [error, setError] = useState();

  const orderBy = ["Relevance", "Newest"];
  const maxResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitSearch = (values) => {
    setSearching(true);
    setSearchResults(null);
    setSelectedBook(null);
    setError(null);

    var maxResults = parseInt(values.maxResults);
    var token = localStorage.getItem("token");
    if (!authorChecked) {
      var searchByTitle = {
        title: values.searchTitle,
        orderBy: values.orderBy,
        maxResults,
      };
      titleSearch(searchByTitle, token);
    } else if (!titleChecked) {
      var searchByAuthor = {
        author: values.searchAuthor,
        orderBy: values.orderBy,
        maxResults,
      };
      authorSearch(searchByAuthor, token);
    } else {
      var search = {
        title: values.searchTitle,
        author: values.searchAuthor,
        orderBy: values.orderBy,
        maxResults,
      };
      generalSearch(search, token);
    }
  };

  const titleSearch = (data, token) => {
    searchBooksByTitle(data, token)
      .then((response) => {
        handleSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const authorSearch = (data, token) => {
    searchBooksByAuthor(data, token)
      .then((response) => {
        handleSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const generalSearch = (data, token) => {
    searchBooks(data, token)
      .then((response) => {
        handleSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleSuccess = (response) => {
    setSearchResults(response);
    setSearching(false);
  };

  const handleError = (error) => {
    setError(error);
    setSearching(false);
  };

  const searchDisabled = (title, author) => {
    if (
      (!titleChecked && !authorChecked) ||
      (titleChecked && title === "") ||
      (authorChecked && author === "")
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="column is-8 is-offset-2 form-container">
      <div className="card custom-card">
        <div className="card-content">
          <div className="media">
            <div className="image-header-container">
              <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg" />
            </div>
          </div>
          {error && <div className="notification is-danger">{error}</div>}
          {selectedBook && (
            <Redirect
              to={{
                pathname: "/book-form",
                state: { book: selectedBook },
              }}
            />
          )}
          <h1 className="title is-4 has-text-centered">Add Manually</h1>
          <div id="add-manually">
            <Link to={"/book-form"}>
              <button className="button is-outlined">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </Link>
          </div>
          <hr />
          <h1 className="title is-4 has-text-centered">Search</h1>
          <Formik
            initialValues={{
              searchTitle: "",
              searchAuthor: "",
              orderBy: orderBy[0],
              maxResults: 3,
              book: null,
            }}
            validate={(values) => {
              let errors = {};
              if (titleChecked && !values.searchTitle)
                errors.searchTitle = "Required";
              if (authorChecked && !values.searchAuthor)
                errors.searchAuthor = "Required";
              return errors;
            }}
            onSubmit={() => {}}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form className="form" onSubmit={handleSubmit}>
                <div>
                  <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                      <input
                        className={
                          errors.searchTitle && touched.searchTitle
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="searchTitle"
                        placeholder="Enter title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.searchTitle}
                        disabled={!titleChecked}
                      />
                      <input
                        type="checkbox"
                        checked={titleChecked}
                        onClick={() => setTitleChecked(!titleChecked)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Author</label>
                    <div className="control">
                      <input
                        className={
                          errors.searchAuthor && touched.searchAuthor
                            ? "input is-danger"
                            : "input"
                        }
                        type="text"
                        name="searchAuthor"
                        placeholder="Enter author"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.searchAuthor}
                        disabled={!authorChecked}
                      />
                      <input
                        type="checkbox"
                        checked={authorChecked}
                        onClick={() => setAuthorChecked(!authorChecked)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className={
                        searching
                          ? "button is-link is-loading"
                          : "button is-link"
                      }
                      onClick={() => submitSearch(values)}
                      disabled={searchDisabled(
                        values.searchTitle,
                        values.searchAuthor
                      )}
                    >
                      Search
                    </button>
                    <div className="select search-dropdown">
                      <select
                        value={values.orderBy}
                        name="orderBy"
                        onChange={handleChange}
                      >
                        {orderBy.map((result) => (
                          <option key={result}>{result}</option>
                        ))}
                      </select>
                    </div>
                    <div className="select search-dropdown">
                      <select
                        value={values.maxResults}
                        name="maxResults"
                        onChange={handleChange}
                      >
                        {maxResults.map((result) => (
                          <option key={result}>{result}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {searchResults && searchResults.length === 0 && (
                    <div
                      id="no-search-results"
                      className="notification is-warning"
                    >
                      Search returned zero results. Please try again.
                    </div>
                  )}
                  {searchResults && searchResults.length > 0 && (
                    <div>
                      <div id="search-books-container">
                        {searchResults.map((book, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setFieldValue("book", book);
                            }}
                            className={
                              values.book && book === values.book
                                ? "columns is-mobile custom-radio custom-radio-selected"
                                : "columns is-mobile custom-radio"
                            }
                          >
                            <div className="column is-1">
                              <input
                                className="custom-radio-input"
                                type="radio"
                                name="book"
                                checked={values.book === book}
                                onBlur={handleBlur}
                                readOnly
                              />
                            </div>
                            <div className="column is-10 has-text-centered">
                              <p className="is-size-6">{book.title}</p>
                              <p>{book.author}</p>
                            </div>
                            <div
                              id="search-image-column"
                              className="column is-1"
                            >
                              <img src={book.imageUrl} alt="Book cover" />
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        className="button is-link"
                        disabled={!values.book}
                        onClick={() => setSelectedBook(values.book)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
