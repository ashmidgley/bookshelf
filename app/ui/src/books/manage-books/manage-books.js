import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Loading from "../../shared/loading/loading";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../../shared/custom-modal";
import { fetchCurrentUserBooks, removeBook } from "../../shared/book.service";

const ManageBooks = () => {
  const [books, setBooks] = useState();
  const [hasMore, setHasMore] = useState();
  const [page, setPage] = useState();
  const [selectedBookId, setSelectedBookId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    var token = localStorage.getItem("token");
    fetchBooks(token, { page: 0 });
    // eslint-disable-next-line
  }, []);

  const fetchBooks = (token, queryOptions) => {
    fetchCurrentUserBooks(token, queryOptions)
      .then((response) => {
        setBooks(response.books);
        setHasMore(response.hasMore);
        setPage(queryOptions.page);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    var token = localStorage.getItem("token");
    removeBook(selectedBookId, token)
      .then((response) => {
        var oldBook = books.find((b) => b.id === response.id);
        var index = books.indexOf(oldBook);
        books.splice(index, 1);

        setModalIsOpen(false);
        setSubmitting(false);
        setSuccess(true);
        setSelectedBookId(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    setError(error);
    setModalIsOpen(false);
    setLoading(false);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (id) => {
    setSelectedBookId(id);
    setModalIsOpen(true);
    setSuccess(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const pageLeft = () => {
    var token = localStorage.getItem("token");
    fetchBooks(token, { page: page - 1 });
  };

  const pageRight = () => {
    var token = localStorage.getItem("token");
    fetchBooks(token, { page: page + 1 });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="column is-8 is-offset-2 form-container">
          <Helmet>
            <title>Manage Books - Bookshelf</title>
          </Helmet>
          <div className="card form-card">
            <div className="card-content">
              <div className="media">
                <div className="image-header-container">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="eye-icon"
                    size="lg"
                  />
                </div>
              </div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
              >
                <form onSubmit={handleSubmit}>
                  <div>Are you sure you would like to delete this book?</div>
                  <div className="modal-actions">
                    <button
                      className={
                        submitting
                          ? "button is-link is-loading"
                          : "button is-link"
                      }
                      type="submit"
                    >
                      Confirm
                    </button>
                    <button id="cancel" className="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
              {success && books.length && (
                <div className="notification is-success">
                  Successfully removed entry.
                </div>
              )}
              {error && <div className="notification is-danger">{error}</div>}
              <div style={{ marginBottom: "25px" }}>
                <Link to={"/search-form"}>
                  <button className="button is-outlined">
                    <FontAwesomeIcon icon={faPlus} size="lg" />
                  </button>
                </Link>
              </div>
              {!books || !books.length ? (
                <div className="notification is-link">No books to display.</div>
              ) : (
                <div className="form-table">
                  <table className="table is-fullwidth is-bordered">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.id}>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td className="has-text-centered">
                            <Link to={"/book-form/" + book.id}>
                              <button
                                className="button is-outlined"
                                disabled={submitting}
                              >
                                Edit
                              </button>
                            </Link>
                          </td>
                          <td className="has-text-centered">
                            <button
                              onClick={() => openModal(book.id)}
                              className="button is-outlined"
                              disabled={submitting}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <button
                      onClick={pageLeft}
                      className="button mr-10"
                      disabled={page === 0}
                    >
                      <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                    </button>
                    <button
                      onClick={pageRight}
                      className="button"
                      disabled={!hasMore}
                    >
                      <FontAwesomeIcon icon={faCaretRight} size="lg" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageBooks;
