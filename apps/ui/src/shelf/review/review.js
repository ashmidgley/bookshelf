import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./review.css";
import Loading from "../../shared/loading/loading";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { getBook } from "../../shared/book.service";
import { getCategory } from "../../shared/category.service";
import { getRating } from "../../shared/rating.service";

const Review = ({ match }) => {
  const [book, setBook] = useState();
  const [category, setCategory] = useState();
  const [rating, setRating] = useState();
  const [paragraphs, setParagraphs] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const bookId = parseInt(match.params.id);

    getBook(bookId)
      .then((response) => {
        setBook(response);
        setParagraphs(response.summary ? response.summary.split("\n") : null);
        setLoading(false);

        getCategory(response.categoryId).then((response) => {
          setCategory(response);
        });

        getRating(response.ratingId).then((response) => {
          setRating(response);
        });
      })
      .catch((error) => {
        handleError(error);
      });
  }, [match.params.id]);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="column is-8 is-offset-2 form-container">
          <Helmet>
            <title>
              {book ? `${book.title} - Bookshelf` : "Review - Bookshelf"}
            </title>
            <meta
              name="description"
              content={book && book.summary && book.summary.substring(0, 100)}
            />
          </Helmet>
          <div className="card custom-card">
            <div className="card-content">
              <div className="media">
                <div className="image-header-container">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="book-open-icon"
                    size="lg"
                  />
                </div>
                <div
                  id="review-media-content"
                  className="container has-text-centered"
                >
                  {error ? (
                    <div className="notification is-danger">
                      Error pulling user data. Please refresh and try again.
                    </div>
                  ) : (
                    <div>
                      <p className="title">{book.title}</p>
                      <p className="subtitle is-6">By {book.author}</p>
                      <div className="tags has-addons level-item">
                        <span id="tag-secondary" className="tag is-rounded">
                          {moment(book.finishedOn).format("Do MMMM")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!error && (
              <div id="review-content" className="has-text-centered">
                <hr />
                {paragraphs ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index} className="summary-text">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div className="notification">No summary to display.</div>
                )}
                <hr />
                <nav className="level is-mobile">
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Category</p>
                      <p className="review-subtitle">
                        {category ? category.code : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Pages</p>
                      <p className="review-subtitle">{book.pageCount}</p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Rating</p>
                      <p className="review-subtitle">
                        {rating ? rating.code : "-"}
                      </p>
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

Review.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Review;
