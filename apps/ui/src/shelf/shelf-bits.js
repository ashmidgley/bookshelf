import React from "react";
import PropTypes from "prop-types";

const FALLBACK = process.env.REACT_APP_TEMP_IMAGE;

export const Cover = ({ book, className }) => (
  <img
    className={className}
    src={book.imageUrl}
    alt={`${book.title} by ${book.author}`}
    loading="lazy"
    onError={(e) => {
      if (FALLBACK && e.target.src !== FALLBACK) e.target.src = FALLBACK;
    }}
  />
);

Cover.propTypes = {
  book: PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export const formatNumber = (n) => (n || 0).toLocaleString();

export const countLabel = (shelf) =>
  `${shelf.stats.count}${shelf.hasMore ? "+" : ""}`;
