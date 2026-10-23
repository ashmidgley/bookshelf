import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./my-account.css";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import PageHeader from "../../shared/page-header/page-header";
import { parseUser } from "../../shared/token.service";
import { fetchCurrentUserBooks } from "../../shared/book.service";
import {
  updateEmail,
  updatePassword,
  deleteUser,
  clearUser,
} from "../../shared/user.service";
import {
  validateEmail,
  validatePasswordLength,
} from "../../shared/field-validator";

const ALL_BOOKS = { page: 0, entriesPerPage: 10000 };

const IndexCard = ({ title, children, className }) => (
  <section className={`acct-panel ${className || ""}`}>
    <span className="acct-hole" aria-hidden="true" />
    <h2 className="acct-panel-title">{title}</h2>
    {children}
  </section>
);

IndexCard.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

const EmailPanel = ({ email, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();

  const submit = (e) => {
    e.preventDefault();
    if (!validateEmail(value)) {
      setError("That doesn't look like an email address.");
      return;
    }
    setSaving(true);
    setError(null);
    updateEmail({ email: value }, localStorage.getItem("token"))
      .then(onChanged)
      .catch((err) => {
        setError(err);
        setSaving(false);
      });
  };

  return (
    <IndexCard title="Email">
      <div className="acct-value">{email}</div>
      {!open ? (
        <button className="acct-link" onClick={() => setOpen(true)}>
          Change email
        </button>
      ) : (
        <form className="acct-form" onSubmit={submit}>
          <input
            className="acct-input"
            type="email"
            placeholder="New email address"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <p className="acct-hint">
            You'll be signed out and asked to log in with the new address.
          </p>
          {error && <p className="acct-error">{error}</p>}
          <div className="acct-actions">
            <button className="nl-btn nl-btn-brass nl-btn-small" disabled={saving || !value}>
              {saving ? "Updating…" : "Update email"}
            </button>
            <button
              type="button"
              className="nl-btn nl-btn-ghost nl-btn-small"
              onClick={() => {
                setOpen(false);
                setValue("");
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </IndexCard>
  );
};

EmailPanel.propTypes = {
  email: PropTypes.string.isRequired,
  onChanged: PropTypes.func.isRequired,
};

const PasswordPanel = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  const [done, setDone] = useState(false);

  const reset = () => {
    setOpen(false);
    setPassword("");
    setConfirm("");
    setError(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validatePasswordLength(password)) {
      setError("Use at least 5 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setSaving(true);
    setError(null);
    updatePassword({ password }, localStorage.getItem("token"))
      .then(() => {
        reset();
        setDone(true);
      })
      .catch((err) => setError(err))
      .finally(() => setSaving(false));
  };

  return (
    <IndexCard title="Password">
      <div className="acct-value acct-dots" aria-label="Password hidden">
        ••••••••••
      </div>
      {done && !open && <p className="acct-success">Password updated.</p>}
      {!open ? (
        <button
          className="acct-link"
          onClick={() => {
            setDone(false);
            setOpen(true);
          }}
        >
          Change password
        </button>
      ) : (
        <form className="acct-form" onSubmit={submit}>
          <input
            className="acct-input"
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <input
            className="acct-input"
            type="password"
            placeholder="Repeat new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && <p className="acct-error">{error}</p>}
          <div className="acct-actions">
            <button
              className="nl-btn nl-btn-brass nl-btn-small"
              disabled={saving || !password || !confirm}
            >
              {saving ? "Saving…" : "Save password"}
            </button>
            <button type="button" className="nl-btn nl-btn-ghost nl-btn-small" onClick={reset}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </IndexCard>
  );
};

const SharePanel = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    // Older approach, for insecure contexts or when the Clipboard API refuses.
    const fallback = () => {
      const field = document.createElement("textarea");
      field.value = url;
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(field);
      if (ok) done();
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else {
      fallback();
    }
  };

  return (
    <IndexCard title="Share your shelf" className="acct-share">
      <p className="acct-hint">
        Anyone with this link can browse your shelf. They can't change
        anything.
      </p>
      <div className="acct-url" title={url}>
        {url}
      </div>
      <div className="acct-actions">
        <button className="nl-btn nl-btn-brass nl-btn-small" onClick={copy}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
        <a
          className="nl-btn nl-btn-ghost nl-btn-small"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>
      </div>
    </IndexCard>
  );
};

SharePanel.propTypes = {
  url: PropTypes.string.isRequired,
};

const DangerZone = ({ userId, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState();
  const armed = typed.trim().toLowerCase() === "delete";

  const submit = (e) => {
    e.preventDefault();
    if (!armed) return;
    setDeleting(true);
    setError(null);
    deleteUser(userId, localStorage.getItem("token"))
      .then(onDeleted)
      .catch((err) => {
        setError(err);
        setDeleting(false);
      });
  };

  return (
    <section className="acct-danger">
      <div>
        <h2 className="acct-danger-title">Close your account</h2>
        <p>
          This permanently removes your shelf, every book on it, and your
          categories and ratings. It can't be undone.
        </p>
      </div>
      {!open ? (
        <button className="nl-btn nl-btn-danger" onClick={() => setOpen(true)}>
          Close account…
        </button>
      ) : (
        <form className="acct-danger-form" onSubmit={submit}>
          <label htmlFor="acct-delete-confirm">
            Type <b>delete</b> to confirm
          </label>
          <input
            id="acct-delete-confirm"
            className="acct-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          {error && <p className="acct-error">{error}</p>}
          <div className="acct-actions">
            <button className="nl-btn nl-btn-danger nl-btn-small" disabled={!armed || deleting}>
              {deleting ? "Closing…" : "Close my account forever"}
            </button>
            <button
              type="button"
              className="nl-btn nl-btn-ghost nl-btn-small"
              onClick={() => {
                setOpen(false);
                setTyped("");
                setError(null);
              }}
            >
              Keep my account
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

DangerZone.propTypes = {
  userId: PropTypes.number.isRequired,
  onDeleted: PropTypes.func.isRequired,
};

const MyAccount = ({ history }) => {
  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? parseUser(token) : null;
  }, []);
  const [books, setBooks] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) return;
    fetchCurrentUserBooks(localStorage.getItem("token"), ALL_BOOKS)
      .then((response) => setBooks(response.books))
      .catch(() => setBooks([]));
  }, [user]);

  const stats = useMemo(() => {
    if (!books) return null;
    const years = books.map((b) => moment(b.finishedOn).year());
    return {
      count: books.length,
      pages: books.reduce((sum, b) => sum + (b.pageCount || 0), 0),
      since: years.length ? Math.min(...years) : null,
    };
  }, [books]);

  // Signed out: the nav redirects to /login, so render nothing meanwhile.
  if (!user) return null;

  const shelfUrl = `${window.location.protocol}//${window.location.host}/shelf/${user.id}`;

  const signOutTo = (path) => () => clearUser().then(() => history.push(path));

  return (
    <div className="acct">
      <Helmet>
        <title>My Account - Bookshelf</title>
      </Helmet>
      <PageHeader
        kicker="Reader's file"
        title="Your account"
        subtitle={`Member No. ${user.id}`}
      />

      <div className="acct-card">
        <div className="acct-card-head">
          <span>Bookshelf Lending Library</span>
          <span className="acct-card-no">No. {user.id}</span>
        </div>
        <div className="acct-card-body">
          <div className="acct-card-reader">
            <span>Reader</span>
            <b>{user.email}</b>
          </div>
          <dl className="acct-card-stats">
            <div>
              <dt>Books shelved</dt>
              <dd>{stats ? stats.count.toLocaleString() : "…"}</dd>
            </div>
            <div>
              <dt>Pages read</dt>
              <dd>{stats ? stats.pages.toLocaleString() : "…"}</dd>
            </div>
            <div>
              <dt>Reading since</dt>
              <dd>{stats ? stats.since || "Today" : "…"}</dd>
            </div>
          </dl>
          <div className="acct-stamp" aria-hidden="true">
            Member
            <small>in good standing</small>
          </div>
        </div>
      </div>

      <div className="acct-grid">
        <EmailPanel email={user.email} onChanged={signOutTo("/login")} />
        <PasswordPanel />
        <SharePanel url={shelfUrl} />
      </div>

      <DangerZone userId={user.id} onDeleted={signOutTo("/")} />
    </div>
  );
};

MyAccount.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(MyAccount);
