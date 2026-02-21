import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Loading from "../../shared/loading/loading";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../../shared/custom-modal";
import {
  fetchCurrentUserRatings,
  removeRating,
} from "../../shared/rating.service";

const ManageRatings = () => {
  const [ratings, setRatings] = useState();
  const [selectedRatingId, setSelectedRatingId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");

    fetchCurrentUserRatings(token)
      .then((response) => {
        setRatings(response);
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
    removeRating(selectedRatingId, token)
      .then((response) => {
        const oldRating = ratings.find((b) => b.id === response.id);
        const index = ratings.indexOf(oldRating);
        ratings.splice(index, 1);

        setModalIsOpen(false);
        setSubmitting(false);
        setSuccess(true);
        setSelectedRatingId(null);
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
    setSelectedRatingId(id);
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
            <title>Manage Ratings - Bookshelf</title>
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
                  <div>Are you sure you would like to delete this rating?</div>
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
                {success && ratings && ratings.length && (
                  <div className="notification is-success">
                    Successfully removed entry.
                  </div>
                )}
                {error && <div className="notification is-danger">{error}</div>}
                <div style={{ marginBottom: "25px" }}>
                  <Link to={"/rating-form"}>
                    <button className="button is-outlined">
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </button>
                  </Link>
                </div>
                {!ratings || !ratings.length ? (
                  <div className="notification is-link">
                    No ratings to display.
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
                        {ratings.map((rating) => (
                          <tr key={rating.id}>
                            <td>{rating.description}</td>
                            <td>{rating.code}</td>
                            <td className="has-text-centered">
                              <Link to={"/rating-form/" + rating.id}>
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
                                onClick={() => openModal(rating.id)}
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

export default ManageRatings;
