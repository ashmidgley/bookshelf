import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./quick-add.css";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { searchBooksByTitle } from "../../shared/search.service";
import { createBook } from "../../shared/book.service";
import { fetchCurrentUserCategories } from "../../shared/category.service";
import { fetchCurrentUserRatings } from "../../shared/rating.service";
import { useQuickAdd, notifyBookAdded } from "./quick-add-context";

const isTyping = (target) =>
  target &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable);

const QuickAdd = ({ history }) => {
  const { open, query: initialQuery, openQuickAdd, closeQuickAdd } =
    useQuickAdd();

  const [step, setStep] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState();
  const [highlight, setHighlight] = useState(0);
  const [selected, setSelected] = useState();
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState();
  const [saved, setSaved] = useState();
  const [retryTick, setRetryTick] = useState(0);

  const inputRef = useRef();
  const requestId = useRef(0);

  // Global shortcuts: "n" or Cmd/Ctrl+K open the palette from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      const loggedIn = !!localStorage.getItem("token");
      if (!loggedIn) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openQuickAdd();
      } else if (
        !open &&
        e.key.toLowerCase() === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTyping(e.target)
      ) {
        e.preventDefault();
        openQuickAdd();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openQuickAdd]);

  // Reset and load the user's categories/ratings each time it opens.
  useEffect(() => {
    if (!open) return;
    setStep("search");
    setQuery(initialQuery || "");
    setResults([]);
    setSelected(null);
    setSaved(null);
    setSaveError(null);
    setSearchError(null);
    setHighlight(0);
    document.body.classList.add("qa-lock");

    const token = localStorage.getItem("token");
    Promise.all([
      fetchCurrentUserCategories(token),
      fetchCurrentUserRatings(token),
    ])
      .then(([c, r]) => {
        setCategories(c);
        setRatings(r);
      })
      .catch(() => {
        setCategories([]);
        setRatings([]);
      });

    return () => document.body.classList.remove("qa-lock");
  }, [open, initialQuery]);

  useEffect(() => {
    if (open && step === "search" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, step]);

  // Debounced type-ahead against Google Books.
  useEffect(() => {
    if (!open || step !== "search") return;
    const text = query.trim();
    if (text.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      searchBooksByTitle(
        { title: text, orderBy: "Relevance", maxResults: 8 },
        token
      )
        .then((response) => {
          if (id !== requestId.current) return;
          setResults(response || []);
          setHighlight(0);
          setSearchError(null);
          setSearching(false);
        })
        .catch((error) => {
          if (id !== requestId.current) return;
          setResults([]);
          setSearchError(error || "Search failed. Try again.");
          setSearching(false);
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, open, step, retryTick]);

  const choose = (book) => {
    setSelected(book);
    setForm({
      title: book.title || "",
      author: book.author || "",
      pageCount: book.pageCount || 0,
      finishedOn: moment().format("YYYY-MM-DD"),
      categoryId: categories.length ? categories[0].id : null,
      ratingId: ratings.length
        ? ratings[Math.floor(ratings.length / 2)].id
        : null,
    });
    setSaveError(null);
    setStep("details");
  };

  const addManually = () => {
    closeQuickAdd();
    history.push({
      pathname: "/book-form",
      state: {
        book: {
          title: query,
          author: "",
          imageUrl: "",
          pageCount: 0,
          summary: "",
        },
      },
    });
  };

  const save = () => {
    if (saving) return;
    if (!form.categoryId || !form.ratingId) {
      setSaveError(
        "You need at least one category and one rating first. Set them up under Manage Categories / Manage Ratings."
      );
      return;
    }
    setSaving(true);
    setSaveError(null);
    const token = localStorage.getItem("token");
    createBook(
      {
        title: form.title,
        author: form.author,
        imageUrl: selected.imageUrl,
        finishedOn: form.finishedOn || moment().format("YYYY-MM-DD"),
        pageCount: parseInt(form.pageCount) || 0,
        categoryId: form.categoryId,
        ratingId: form.ratingId,
        summary: selected.summary || "",
      },
      token
    )
      .then((book) => {
        setSaving(false);
        setSaved(book);
        setStep("done");
        notifyBookAdded(book);
      })
      .catch((error) => {
        setSaving(false);
        setSaveError(error || "Could not save the book.");
      });
  };

  const onSearchKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight === results.length) {
        addManually();
      } else if (results[highlight]) {
        choose(results[highlight]);
      }
    }
  };

  const onPanelKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (step === "details") setStep("search");
      else closeQuickAdd();
    } else if (step === "details" && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    } else if (step === "done" && e.key.toLowerCase() === "n") {
      e.preventDefault();
      setQuery("");
      setResults([]);
      setStep("search");
    }
  };

  if (!open) return null;

  const quickDates = [
    { label: "Today", value: moment().format("YYYY-MM-DD") },
    { label: "Yesterday", value: moment().subtract(1, "day").format("YYYY-MM-DD") },
    { label: "Last week", value: moment().subtract(7, "day").format("YYYY-MM-DD") },
  ];

  return (
    <div className="qa-overlay" onMouseDown={closeQuickAdd}>
      <div
        className={`qa-panel qa-step-${step}`}
        role="dialog"
        aria-modal="true"
        aria-label="Add a book"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onPanelKey}
        tabIndex={-1}
      >
        {step === "search" && (
          <>
            <div className="qa-search-row">
              <span className="qa-search-icon" aria-hidden="true">
                +
              </span>
              <input
                ref={inputRef}
                className="qa-search-input"
                placeholder="What did you just finish? Type a title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                aria-label="Search for a book"
              />
              {searching && <span className="qa-spinner" aria-label="Searching" />}
              <kbd className="qa-esc" onClick={closeQuickAdd}>
                esc
              </kbd>
            </div>

            <div className="qa-results">
              {query.trim().length < 2 && (
                <div className="qa-hint">
                  <div className="qa-hint-title">Add a book in seconds</div>
                  <div className="qa-hint-body">
                    Start typing a title and pick it from Google Books. Then
                    rate it and you're done.
                  </div>
                  <div className="qa-hint-keys">
                    <span>
                      <kbd>N</kbd> or <kbd>⌘K</kbd> open this anywhere
                    </span>
                    <span>
                      <kbd>↑</kbd>
                      <kbd>↓</kbd> pick · <kbd>↵</kbd> choose
                    </span>
                  </div>
                </div>
              )}

              {searching &&
                results.length === 0 &&
                [0, 1, 2].map((i) => (
                  <div key={i} className="qa-result qa-skeleton">
                    <div className="qa-result-cover" />
                    <div className="qa-result-text">
                      <div className="qa-skel-line" />
                      <div className="qa-skel-line qa-skel-short" />
                    </div>
                  </div>
                ))}

              {searchError && (
                <div className="qa-empty qa-empty-error">
                  <div>{searchError}</div>
                  <button
                    className="qa-secondary qa-retry"
                    onClick={() => setRetryTick((t) => t + 1)}
                  >
                    ↻ Try again
                  </button>
                </div>
              )}

              {!searching &&
                !searchError &&
                query.trim().length >= 2 &&
                results.length === 0 && (
                  <div className="qa-empty">
                    <div>
                      No matches. Try a different spelling, or add it manually
                      below.
                    </div>
                    <button
                      className="qa-secondary qa-retry"
                      onClick={() => setRetryTick((t) => t + 1)}
                    >
                      ↻ Try again
                    </button>
                  </div>
                )}

              {results.map((book, index) => (
                <button
                  key={`${book.title}-${index}`}
                  className={
                    index === highlight ? "qa-result qa-highlight" : "qa-result"
                  }
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => choose(book)}
                >
                  <img
                    className="qa-result-cover"
                    src={book.imageUrl}
                    alt=""
                  />
                  <span className="qa-result-text">
                    <span className="qa-result-title">{book.title}</span>
                    <span className="qa-result-meta">
                      {book.author || "Unknown author"}
                      {book.pageCount ? ` · ${book.pageCount} pages` : ""}
                    </span>
                  </span>
                  <span className="qa-result-cta">Add ↵</span>
                </button>
              ))}

              {query.trim().length >= 2 && !searching && (
                <button
                  className={
                    highlight === results.length
                      ? "qa-result qa-manual qa-highlight"
                      : "qa-result qa-manual"
                  }
                  onMouseEnter={() => setHighlight(results.length)}
                  onClick={addManually}
                >
                  <span className="qa-result-cover qa-manual-icon">✎</span>
                  <span className="qa-result-text">
                    <span className="qa-result-title">
                      Can't find it? Add “{query.trim()}” manually
                    </span>
                    <span className="qa-result-meta">
                      Opens the full form
                    </span>
                  </span>
                </button>
              )}
            </div>
          </>
        )}

        {step === "details" && selected && (
          <div className="qa-details">
            <button className="qa-back" onClick={() => setStep("search")}>
              ← Back to results
            </button>
            <div className="qa-details-grid">
              <div className="qa-cover-wrap">
                <img className="qa-cover" src={selected.imageUrl} alt="" />
              </div>
              <div className="qa-fields">
                <input
                  className="qa-title-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  aria-label="Title"
                />
                <input
                  className="qa-author-input"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  aria-label="Author"
                  placeholder="Author"
                />

                <div className="qa-label">How was it?</div>
                <div className="qa-chips">
                  {ratings.map((rating) => (
                    <button
                      key={rating.id}
                      className={
                        form.ratingId === rating.id ? "qa-chip qa-on" : "qa-chip"
                      }
                      onClick={() => setForm({ ...form, ratingId: rating.id })}
                    >
                      <span className="qa-chip-emoji">{rating.code}</span>
                      {rating.description}
                    </button>
                  ))}
                </div>

                <div className="qa-label">Shelve under</div>
                <div className="qa-chips">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={
                        form.categoryId === category.id
                          ? "qa-chip qa-on"
                          : "qa-chip"
                      }
                      onClick={() =>
                        setForm({ ...form, categoryId: category.id })
                      }
                    >
                      <span className="qa-chip-emoji">{category.code}</span>
                      {category.description}
                    </button>
                  ))}
                </div>

                <div className="qa-row">
                  <div>
                    <div className="qa-label">Finished</div>
                    <div className="qa-chips">
                      {quickDates.map((d) => (
                        <button
                          key={d.label}
                          className={
                            form.finishedOn === d.value
                              ? "qa-chip qa-on"
                              : "qa-chip"
                          }
                          onClick={() =>
                            setForm({ ...form, finishedOn: d.value })
                          }
                        >
                          {d.label}
                        </button>
                      ))}
                      <input
                        type="date"
                        className="qa-date"
                        value={form.finishedOn}
                        onChange={(e) =>
                          setForm({ ...form, finishedOn: e.target.value })
                        }
                        aria-label="Finished on"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="qa-label">Pages</div>
                    <input
                      type="number"
                      className="qa-pages"
                      value={form.pageCount}
                      onChange={(e) =>
                        setForm({ ...form, pageCount: e.target.value })
                      }
                      aria-label="Page count"
                    />
                  </div>
                </div>

                {saveError && <div className="qa-error">{saveError}</div>}

                <button
                  className={saving ? "qa-save qa-saving" : "qa-save"}
                  onClick={save}
                  disabled={saving || !form.title}
                >
                  {saving ? "Shelving…" : "Add to shelf"}
                  <kbd>⌘↵</kbd>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "done" && saved && (
          <div className="qa-done">
            <div className="qa-done-cover-wrap">
              <img className="qa-done-cover" src={saved.imageUrl} alt="" />
              <span className="qa-done-check">✓</span>
            </div>
            <div className="qa-done-title">On the shelf.</div>
            <div className="qa-done-sub">
              {saved.title} was added to {moment(saved.finishedOn).format("YYYY")}.
            </div>
            <div className="qa-done-actions">
              <button
                className="qa-save"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setStep("search");
                }}
                autoFocus
              >
                Add another <kbd>N</kbd>
              </button>
              <button
                className="qa-secondary"
                onClick={() => {
                  closeQuickAdd();
                  history.push(`/review/${saved.id}`);
                }}
              >
                View it
              </button>
              <button className="qa-secondary" onClick={closeQuickAdd}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

QuickAdd.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(QuickAdd);
