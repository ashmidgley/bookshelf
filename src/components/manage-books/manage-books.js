import React from "react";
import Modal from "react-modal";
import Loading from "../loading/loading";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../../helpers/custom-modal";
import { fetchCurrentUserBooks, removeBook } from "../../actions/book-actions";

class ManageBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: null,
      hasMore: null,
      page: null,
      selectedBookId: null,
      modalIsOpen: false,
      loading: true,
      submitting: false,
      success: false,
      error: null,
    };

    this.fetchBooks = this.fetchBooks.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.handleError = this.handleError.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.pageLeft = this.pageLeft.bind(this);
    this.pageRight = this.pageRight.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    var token = localStorage.getItem("token");
    this.fetchBooks(token, { page: 0 });
  }

  fetchBooks(token, queryOptions) {
    fetchCurrentUserBooks(token, queryOptions)
      .then((response) => {
        this.setState({
          books: response.books,
          hasMore: response.hasMore,
          page: queryOptions.page,
          loading: false,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitting: true,
      success: false,
      error: null,
    });

    var token = localStorage.getItem("token");
    this.removeBook(this.state.selectedBookId, token);
  }

  removeBook(bookId, token) {
    removeBook(bookId, token)
      .then((response) => {
        var oldBook = this.state.books.find((b) => b.id === response.id);
        var index = this.state.books.indexOf(oldBook);
        this.state.books.splice(index, 1);
        this.setState({
          modalIsOpen: false,
          submitting: false,
          success: true,
          selectedBookId: null,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  handleError(error) {
    this.setState({
      error: error,
      modalIsOpen: false,
      loading: false,
      submitting: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  openModal(id) {
    this.setState({
      selectedBookId: id,
      modalIsOpen: true,
      success: false,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  pageLeft() {
    var token = localStorage.getItem("token");
    this.fetchBooks(token, { page: this.state.page - 1 });
  }

  pageRight() {
    var token = localStorage.getItem("token");
    this.fetchBooks(token, { page: this.state.page + 1 });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div className="column is-8 is-offset-2 form-container">
        <Helmet>
          <title>Manage Books - Bookshelf</title>
        </Helmet>
        <div className="card form-card">
          <div className="card-content">
            <div className="media">
              <div className="image-header-container">
                <FontAwesomeIcon icon={faEye} className="eye-icon" size="lg" />
              </div>
            </div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
            >
              <form onSubmit={this.handleSubmit}>
                <div>Are you sure you would like to delete this book?</div>
                <div className="modal-actions">
                  <button
                    className={
                      this.state.submitting
                        ? "button is-link is-loading"
                        : "button is-link"
                    }
                    type="submit"
                  >
                    Confirm
                  </button>
                  <button
                    id="cancel"
                    className="button"
                    onClick={this.closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>
            {this.state.success && this.state.books.length && (
              <div className="notification is-success">
                Successfully removed entry.
              </div>
            )}
            {this.state.error && (
              <div className="notification is-danger">{this.state.error}</div>
            )}
            <div style={{ marginBottom: "25px" }}>
              <Link to={"/search-form"}>
                <button className="button is-outlined">
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </button>
              </Link>
            </div>
            {!this.state.books || !this.state.books.length ? (
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
                    {this.state.books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td className="has-text-centered">
                          <Link to={"/book-form/" + book.id}>
                            <button
                              className="button is-outlined"
                              disabled={this.state.submitting}
                            >
                              Edit
                            </button>
                          </Link>
                        </td>
                        <td className="has-text-centered">
                          <button
                            onClick={() => this.openModal(book.id)}
                            className="button is-outlined"
                            disabled={this.state.submitting}
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
                    onClick={this.pageLeft}
                    className="button mr-10"
                    disabled={this.state.page === 0}
                  >
                    <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                  </button>
                  <button
                    onClick={this.pageRight}
                    className="button"
                    disabled={!this.state.hasMore}
                  >
                    <FontAwesomeIcon icon={faCaretRight} size="lg" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ManageBooks;
