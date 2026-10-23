import React, { useCallback, useEffect, useState } from "react";
import "./manage-books.css";
import moment from "moment";
import Loading from "../../shared/loading/loading";
import PageHeader from "../../shared/page-header/page-header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { fetchCurrentUserBooks, removeBook } from "../../shared/book.service";
import { fetchCurrentUserCategories } from "../../shared/category.service";
import { fetchCurrentUserRatings } from "../../shared/rating.service";
import {
  useQuickAdd,
  subscribeBookAdded,
} from "../quick-add/quick-add-context";

const PAGE_SIZE = 15;
const FALLBACK_COVER = process.env.REACT_APP_TEMP_IMAGE;

const ManageBooks = () => {
  const { openQuickAdd } = useQuickAdd();
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState({});
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [notice, setNotice] = useState();
  const [error, setError] = useState();

  const load = useCallback((nextPage, text) => {
    const token = localStorage.getItem("token");
    setFetching(true);
    return fetchCurrentUserBooks(token, {
      page: nextPage,
      entriesPerPage: PAGE_SIZE,
      search: text || null,
    })
      .then((response) => {
        setBooks(response.books);
        setHasMore(response.hasMore);
        setPage(nextPage);
      })
      .catch((e) => setError(e))
      .finally(() => {
        setFetching(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
    fetchCurrentUserCategories(token)
      .then((list) => setCategories(byId(list)))
      .catch(() => {});
    fetchCurrentUserRatings(token)
      .then((list) => setRatings(byId(list)))
      .catch(() => {});
  }, []);

  // Search is debounced; the first load runs immediately.
  useEffect(() => {
    const timer = setTimeout(() => load(0, search), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, load]);

  useEffect(() => subscribeBookAdded(() => load(0, search)), [load, search]);

  const changePage = (next) => {
    setConfirming(null);
    load(next, search).then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const remove = (book) => {
    const token = localStorage.getItem("token");
    setRemoving(true);
    setError(null);
    setNotice(null);
    removeBook(book.id, token)
      .then(() => {
        setConfirming(null);
        setNotice(`Removed “${book.title}” from your shelf.`);
        // Step back a page if that was the last book on this one.
        const nextPage = books.length === 1 && page > 0 ? page - 1 : page;
        return load(nextPage, search);
      })
      .catch((e) => setError(e))
      .finally(() => setRemoving(false));
  };

  if (loading) return <Loading />;

  return (
    <div className="mb">
      <Helmet>
        <title>Manage Books - Bookshelf</title>
      </Helmet>
      <PageHeader
        kicker="The ledger"
        title="Your books"
        subtitle="Every volume on your shelf: edit the details or take one down."
      >
        <button className="nl-btn nl-btn-brass" onClick={() => openQuickAdd()}>
          + Shelve a book
        </button>
      </PageHeader>

      {notice && <div className="nl-notice">{notice}</div>}
      {error && <div className="nl-notice nl-notice-error">{error}</div>}

      <div className="mb-toolbar">
        <input
          className="mb-search"
          placeholder="Search by title or author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search your books"
        />
      </div>

      <div className={fetching ? "mb-ledger mb-fetching" : "mb-ledger"}>
        <div className="mb-row mb-head" aria-hidden="true">
          <span />
          <span>Title</span>
          <span>Finished</span>
          <span>Category</span>
          <span>Rating</span>
          <span />
        </div>

        {books.length === 0 && (
          <div className="mb-empty">
            {search ? (
              <>Nothing in the ledger matches “{search}”.</>
            ) : (
              <>
                The ledger is empty.{" "}
                <button className="mb-inline-link" onClick={() => openQuickAdd()}>
                  Shelve your first book
                </button>
                .
              </>
            )}
          </div>
        )}

        {books.map((book) => {
          const category = categories[book.categoryId];
          const rating = ratings[book.ratingId];
          const isConfirming = confirming === book.id;
          return (
            <div
              key={book.id}
              className={isConfirming ? "mb-row mb-confirming" : "mb-row"}
            >
              <img
                className="mb-cover"
                src={book.imageUrl}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (FALLBACK_COVER && e.target.src !== FALLBACK_COVER)
                    e.target.src = FALLBACK_COVER;
                }}
              />
              <Link to={`/review/${book.id}`} className="mb-title">
                <strong>{book.title}</strong>
                <em>{book.author}</em>
              </Link>
              <span className="mb-date">
                {moment(book.finishedOn).format("D MMM YYYY")}
              </span>
              <span className="mb-category">
                {category ? (
                  <>
                    <span className="mb-emoji">{category.code}</span>
                    {category.description}
                  </>
                ) : (
                  <span className="mb-missing">None</span>
                )}
              </span>
              <span className="mb-rating" title={rating ? rating.description : "No rating"}>
                {rating ? rating.code : <span className="mb-missing">–</span>}
              </span>
              <span className="mb-actions">
                {isConfirming ? (
                  <>
                    <span className="mb-confirm-text">Take it down?</span>
                    <button
                      className="nl-btn nl-btn-danger nl-btn-small"
                      onClick={() => remove(book)}
                      disabled={removing}
                    >
                      {removing ? "Removing…" : "Remove"}
                    </button>
                    <button
                      className="nl-btn nl-btn-ghost nl-btn-small"
                      onClick={() => setConfirming(null)}
                    >
                      Keep
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={`/book-form/${book.id}`} className="mb-link">
                      Edit
                    </Link>
                    <button
                      className="mb-link mb-link-danger"
                      onClick={() => setConfirming(book.id)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {(page > 0 || hasMore) && (
        <nav className="mb-pager" aria-label="Pages">
          <button
            className="nl-btn nl-btn-ghost nl-btn-small"
            onClick={() => changePage(page - 1)}
            disabled={page === 0 || fetching}
          >
            ← Newer
          </button>
          <span className="mb-page">Page {page + 1}</span>
          <button
            className="nl-btn nl-btn-ghost nl-btn-small"
            onClick={() => changePage(page + 1)}
            disabled={!hasMore || fetching}
          >
            Older →
          </button>
        </nav>
      )}
    </div>
  );
};

export default ManageBooks;
