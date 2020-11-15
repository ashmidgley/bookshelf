import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import Loading from "../../shared/loading/loading";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { customStyles } from "../../shared/custom-modal";
import { fetchUsers, deleteUser } from "../../shared/user.service";
import { parseUser } from "../../shared/token.service";

const ManageUsers = ({ history }) => {
  const [users, setUsers] = useState();
  const [selectedUserId, setSelectedUserId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/login");
      return;
    }

    const user = parseUser(token);
    if (user.isAdmin) {
      fetchUsers(token)
        .then((response) => {
          setUsers(response);
          setLoading(false);
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      history.push("/");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    deleteUser(selectedUserId, token)
      .then((response) => {
        const oldUser = users.find((b) => b.id === response.id);
        const index = users.indexOf(oldUser);
        users.splice(index, 1);
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
    setSelectedUserId(id);
    setModalIsOpen(true);
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
            <title>Manage Users - Bookshelf</title>
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
                  <div>Are you sure you would like to delete this user?</div>
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
                <h1 className="title">Users</h1>
                {success && (
                  <div className="notification is-success">
                    Successfully removed entry.
                  </div>
                )}
                {error && <div className="notification is-danger">{error}</div>}
                <div className="form-table">
                  <table className="table is-fullwidth is-bordered">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users &&
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin.toString()}</td>
                            <td className="has-text-centered">
                              <Link
                                to={`/admin/manage-users/${user.id}`}
                                className="button"
                              >
                                Edit
                              </Link>
                            </td>
                            <td className="has-text-centered">
                              <button
                                onClick={() => openModal(user.id)}
                                className="button"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ManageUsers.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default ManageUsers;
