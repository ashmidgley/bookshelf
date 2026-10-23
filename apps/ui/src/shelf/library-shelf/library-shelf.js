import React from "react";
import PropTypes from "prop-types";
import "./library-shelf.css";
import { Link } from "react-router-dom";
import { Cover, formatNumber, countLabel } from "../shelf-bits";
import LoadMoreSentinel from "../load-more-sentinel";

const GhostBook = ({ onClick, big }) => (
  <button
    className={big ? "lib-ghost lib-ghost-big" : "lib-ghost"}
    onClick={onClick}
    title="Shelve a new book (N)"
  >
    <span className="lib-ghost-plus">+</span>
    <span className="lib-ghost-label">Shelve a book</span>
  </button>
);

GhostBook.propTypes = {
  onClick: PropTypes.func.isRequired,
  big: PropTypes.bool,
};

const Ribbon = ({ active, onClick, children, label }) => (
  <button
    className={active ? "lib-ribbon lib-ribbon-on" : "lib-ribbon"}
    onClick={onClick}
    title={label}
  >
    {children}
  </button>
);

Ribbon.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  label: PropTypes.string,
};

const LibraryShelf = ({ shelf, onAdd }) => {
  const {
    isOwner,
    byYear,
    stats,
    categories,
    ratings,
    ratingById,
    search,
    setSearch,
    category,
    setCategory,
    rating,
    setRating,
    filtering,
    clearFilters,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  } = shelf;

  const currentYear = new Date().getFullYear();

  return (
    <div className="lib">
      <header className="lib-header">
        <div className="lib-exlibris">Ex Libris</div>
        <h1 className="lib-title">
          {isOwner ? "Your Library" : "A Private Library"}
        </h1>
        <div className="lib-flourish">{"❦\uFE0E"}</div>
        <p className="lib-stats">
          <span>{countLabel(shelf)}</span> volumes ·{" "}
          <span>{formatNumber(stats.pages)}</span> pages read ·{" "}
          <span>{stats.thisYearCount}</span> in {stats.thisYear}
        </p>
        {isOwner && (
          <button className="lib-cta" onClick={() => onAdd()}>
            <span className="lib-cta-plus">+</span> Shelve a new book
            <kbd>N</kbd>
          </button>
        )}
      </header>

      <div className="lib-catalogue">
        <div className="lib-card">
          <span className="lib-card-hole" />
          <input
            className="lib-search"
            placeholder="Search the catalogue by title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="lib-ribbons">
          {categories.map((c) => (
            <Ribbon
              key={c.id}
              label={c.description}
              active={category === c.id}
              onClick={() => setCategory(category === c.id ? null : c.id)}
            >
              <span className="lib-ribbon-emoji">{c.code}</span>
              {c.description}
            </Ribbon>
          ))}
          <span className="lib-ribbon-gap" />
          {ratings.map((r) => (
            <Ribbon
              key={r.id}
              label={r.description}
              active={rating === r.id}
              onClick={() => setRating(rating === r.id ? null : r.id)}
            >
              <span className="lib-ribbon-emoji">{r.code}</span>
              {r.description}
            </Ribbon>
          ))}
          {filtering && (
            <button className="lib-clear" onClick={clearFilters}>
              clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="lib-note">
          The archivist could not reach the stacks. Refresh and try again.
        </div>
      )}

      <div className={loading ? "lib-case lib-loading" : "lib-case"}>
        {!loading && byYear.length === 0 && (
          <div className="lib-year">
            <div className="lib-plaque">
              {filtering ? "No matches" : "Empty shelves"}
            </div>
            <div className="lib-row">
              {isOwner && !filtering ? (
                <GhostBook onClick={() => onAdd()} big />
              ) : (
                <div className="lib-empty-note">
                  {filtering
                    ? "Nothing in the catalogue matches that."
                    : "No volumes yet."}
                </div>
              )}
            </div>
          </div>
        )}

        {isOwner &&
          !filtering &&
          !loading &&
          byYear.length > 0 &&
          byYear[0].year !== currentYear && (
            <section className="lib-year">
              <div className="lib-plaque">{currentYear}</div>
              <div className="lib-row">
                <GhostBook onClick={() => onAdd()} />
              </div>
            </section>
          )}

        {byYear.map((group, groupIndex) => (
          <section className="lib-year" key={group.year}>
            <div className="lib-plaque">
              {group.year}
              <span className="lib-plaque-count">
                {group.books.length}{" "}
                {group.books.length === 1 ? "volume" : "volumes"}
              </span>
            </div>
            <div className="lib-row">
              {isOwner &&
                !filtering &&
                groupIndex === 0 &&
                group.year === currentYear && (
                  <GhostBook onClick={() => onAdd()} />
                )}
              {group.books.map((book, i) => {
                const r = ratingById[book.ratingId];
                return (
                  <Link
                    key={book.id}
                    to={`/review/${book.id}`}
                    className="lib-book"
                    style={{ "--tilt": `${((book.id * 7) % 5) - 2}deg` }}
                  >
                    <span className="lib-book-inner">
                      <Cover book={book} className="lib-cover" />
                      <span className="lib-spine" />
                    </span>
                    {r && <span className="lib-bookmark">{r.code}</span>}
                    <span className="lib-label">
                      <strong>{book.title}</strong>
                      <em>{book.author}</em>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <LoadMoreSentinel onVisible={loadMore} active={hasMore}>
          <div className="lib-more">
            {loadingMore ? "Fetching more volumes…" : ""}
          </div>
        </LoadMoreSentinel>
      </div>

      {isOwner && (
        <button className="lib-fab" onClick={() => onAdd()} aria-label="Add a book">
          +
        </button>
      )}
    </div>
  );
};

LibraryShelf.propTypes = {
  shelf: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default LibraryShelf;
