import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Loading from "../../shared/loading/loading";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../../shared/custom-modal";
import {
  fetchCurrentUserCategories,
  removeCategory,
} from "../../shared/category.service";

const ManageCategories = () => {
  const [categories, setCategories] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");

    fetchCurrentUserCategories(token)
      .then((response) => {
        setCategories(response);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    const token = localStorage.getItem("token");
    removeCategory(selectedCategoryId, token)
      .then((response) => {
        const oldCategory = categories.find((b) => b.id === response.id);
        const index = categories.indexOf(oldCategory);
        categories.splice(index, 1);

        setSelectedCategoryId(null);
        setModalIsOpen(false);
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
    setModalIsOpen(false);
    setLoading(false);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (id) => {
    setSelectedCategoryId(id);
    setModalIsOpen(true);
    setSuccess(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="column is-8 is-offset-2 form-container">
          <Helmet>
            <title>Manage Categories - Bookshelf</title>
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
                  <div>
                    Are you sure you would like to delete this category?
                  </div>
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
              <div>
                {success && categories && categories.length && (
                  <div className="notification is-success">
                    Successfully removed entry.
                  </div>
                )}
                {error && <div className="notification is-danger">{error}</div>}
                <div style={{ marginBottom: "25px" }}>
                  <Link to={"/category-form"}>
                    <button className="button is-outlined">
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </button>
                  </Link>
                </div>
                {!categories || !categories.length ? (
                  <div className="notification is-link">
                    No categories to display.
                  </div>
                ) : (
                  <div className="form-table">
                    <table className="table is-fullwidth is-bordered">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Code</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category.id}>
                            <td>{category.description}</td>
                            <td>{category.code}</td>
                            <td className="has-text-centered">
                              <Link to={"/category-form/" + category.id}>
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
                                onClick={() => openModal(category.id)}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCategories;
