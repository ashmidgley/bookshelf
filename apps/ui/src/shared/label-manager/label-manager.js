import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./label-manager.css";
import { Helmet } from "react-helmet";
import Loading from "../loading/loading";
import PageHeader from "../page-header/page-header";
import { fetchCurrentUserBooks } from "../book.service";

// Every book in one request so each drawer can show how many books it holds.
const ALL_BOOKS = { page: 0, entriesPerPage: 10000 };

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const LabelForm = ({ noun, initial, suggestions, saving, onSave, onCancel }) => {
  const [code, setCode] = useState(initial.code);
  const [description, setDescription] = useState(initial.description);
  const valid = code.trim() && description.trim();

  const submit = (e) => {
    e.preventDefault();
    if (valid && !saving) {
      onSave({ code: code.trim(), description: description.trim() });
    }
  };

  return (
    <form
      className="lm-drawer lm-editing"
      onSubmit={submit}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      <input
        className="lm-emoji-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="📚"
        maxLength={8}
        aria-label={`${noun} emoji`}
      />
      <div className="lm-suggestions">
        {suggestions.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={emoji === code ? "lm-suggestion lm-picked" : "lm-suggestion"}
            onClick={() => setCode(emoji)}
            aria-label={`Use ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        className="lm-name-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={`Name this ${noun}`}
        aria-label={`${noun} name`}
        autoFocus
      />
      <div className="lm-form-actions">
        <button className="nl-btn nl-btn-brass nl-btn-small" disabled={!valid || saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className="nl-btn nl-btn-ghost nl-btn-small" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <a
        className="lm-emojipedia"
        href="https://emojipedia.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        More emoji on Emojipedia
      </a>
    </form>
  );
};

LabelForm.propTypes = {
  noun: PropTypes.string.isRequired,
  initial: PropTypes.shape({
    code: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  saving: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// Shared page for categories and ratings: both are a name plus an emoji code,
// shown as card-catalogue drawers that are added, edited and removed in place.
const LabelManager = ({
  noun,
  title,
  subtitle,
  pageTitle,
  bookField,
  suggestions,
  fetchAll,
  create,
  update,
  remove,
}) => {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item id, "new" or null
  const [confirming, setConfirming] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState();
  const [error, setError] = useState();

  const load = useCallback(() => {
    const token = localStorage.getItem("token");
    return Promise.all([fetchAll(token), fetchCurrentUserBooks(token, ALL_BOOKS)])
      .then(([labels, response]) => {
        const tally = {};
        response.books.forEach((book) => {
          tally[book[bookField]] = (tally[book[bookField]] || 0) + 1;
        });
        setItems(labels);
        setCounts(tally);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [fetchAll, bookField]);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [load]);

  const run = (promise, message) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    return promise
      .then(() => load())
      .then(() => {
        setEditing(null);
        setConfirming(null);
        setNotice(message);
      })
      .catch((e) => setError(e))
      .finally(() => setSaving(false));
  };

  const save = (item, values) => {
    const token = localStorage.getItem("token");
    if (item) {
      run(
        update({ ...values, id: item.id, userId: item.userId }, token),
        `Updated “${values.description}”.`
      );
    } else {
      run(create(values, token), `Added “${values.description}”.`);
    }
  };

  const destroy = (item) => {
    const token = localStorage.getItem("token");
    run(remove(item.id, token), `Removed “${item.description}”.`);
  };

  if (loading) return <Loading />;

  return (
    <div className="lm">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader kicker="Card catalogue" title={title} subtitle={subtitle}>
        <button
          className="nl-btn nl-btn-brass"
          onClick={() => {
            setConfirming(null);
            setEditing("new");
          }}
          disabled={editing === "new"}
        >
          + New {noun}
        </button>
      </PageHeader>

      {notice && <div className="nl-notice">{notice}</div>}
      {error && <div className="nl-notice nl-notice-error">{error}</div>}

      <div className="lm-cabinet">
        {items.map((item) => {
          const count = counts[item.id] || 0;

          if (editing === item.id) {
            return (
              <LabelForm
                key={item.id}
                noun={noun}
                initial={item}
                suggestions={suggestions}
                saving={saving}
                onSave={(values) => save(item, values)}
                onCancel={() => setEditing(null)}
              />
            );
          }

          if (confirming === item.id) {
            return (
              <div key={item.id} className="lm-drawer lm-confirming">
                <span className="lm-emoji">{item.code}</span>
                <div className="lm-confirm-text">
                  Remove “{item.description}”?
                  {count > 0 && (
                    <small>
                      {plural(count, "book")} {count === 1 ? "is" : "are"} filed
                      here. {count === 1 ? "It stays" : "They stay"} on your
                      shelf, but without a {noun}.
                    </small>
                  )}
                </div>
                <div className="lm-form-actions">
                  <button
                    className="nl-btn nl-btn-danger nl-btn-small"
                    onClick={() => destroy(item)}
                    disabled={saving}
                  >
                    {saving ? "Removing…" : "Remove"}
                  </button>
                  <button
                    className="nl-btn nl-btn-ghost nl-btn-small"
                    onClick={() => setConfirming(null)}
                  >
                    Keep
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className="lm-drawer">
              <span className="lm-handle" aria-hidden="true" />
              <span className="lm-emoji">{item.code}</span>
              <span className="lm-name">{item.description}</span>
              <span className="lm-count">{plural(count, "book")}</span>
              <div className="lm-item-actions">
                <button
                  className="lm-link"
                  onClick={() => {
                    setConfirming(null);
                    setEditing(item.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="lm-link lm-link-danger"
                  onClick={() => {
                    setEditing(null);
                    setConfirming(item.id);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {editing === "new" ? (
          <LabelForm
            noun={noun}
            initial={{ code: "", description: "" }}
            suggestions={suggestions}
            saving={saving}
            onSave={(values) => save(null, values)}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <button
            className="lm-drawer lm-ghost"
            onClick={() => {
              setConfirming(null);
              setEditing("new");
            }}
          >
            <span className="lm-ghost-plus">+</span>
            <span>New {noun}</span>
          </button>
        )}
      </div>
    </div>
  );
};

LabelManager.propTypes = {
  noun: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  pageTitle: PropTypes.string.isRequired,
  bookField: PropTypes.oneOf(["categoryId", "ratingId"]).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchAll: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default LabelManager;
