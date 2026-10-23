import React, { useMemo } from "react";
import "./landing.css";
import { Link } from "react-router-dom";
import { parseUser, tokenExpired } from "../../shared/token.service";
import { useQuickAdd } from "../../books/quick-add/quick-add-context";

const SPINE_TITLES = [
  "Moby-Dick",
  "Middlemarch",
  "Jane Eyre",
  "Dracula",
  "Frankenstein",
  "Walden",
  "Persuasion",
  "The Odyssey",
  "Bleak House",
  "Little Women",
  "Don Quixote",
  "Wuthering Heights",
  "Ulysses",
  "War and Peace",
  "Great Expectations",
  "The Iliad",
];

const SPINE_COLOURS = [
  ["#5b1e1e", "#7a2b2b"],
  ["#1f3a2e", "#2c5241"],
  ["#1e2a4a", "#2c3d68"],
  ["#4a2e17", "#6b4423"],
  ["#3b2240", "#55325c"],
  ["#2a2a2a", "#3d3d3d"],
  ["#6b4b1e", "#8a6328"],
];

// Deterministic "random" spines so the shelf looks hand-stocked but never jumps.
const buildSpines = () =>
  SPINE_TITLES.map((title, i) => {
    const colour = SPINE_COLOURS[(i * 5) % SPINE_COLOURS.length];
    return {
      title,
      width: 30 + ((i * 17) % 20),
      height: 150 + ((i * 37) % 70),
      colour,
      bands: i % 3 !== 1,
      lean: i === 6 ? -7 : i === 12 ? 6 : 0,
    };
  });

const currentUser = () => {
  try {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiryDate");
    if (!token || !expiry || tokenExpired(expiry)) return null;
    return parseUser(token);
  } catch (e) {
    return null;
  }
};

const Landing = () => {
  const spines = useMemo(buildSpines, []);
  // Not memoised: logging out from the nav re-renders "/" without remounting it.
  const user = currentUser();
  const { openQuickAdd } = useQuickAdd();

  const primaryCta = user ? (
    <Link className="ld-btn ld-btn-brass" to={`/shelf/${user.id}`}>
      Enter your library →
    </Link>
  ) : (
    <Link className="ld-btn ld-btn-brass" to="/register">
      Start your library
    </Link>
  );

  const secondaryCta = user ? (
    <button className="ld-btn ld-btn-ghost" onClick={() => openQuickAdd()}>
      + Shelve a book
    </button>
  ) : (
    <Link className="ld-btn ld-btn-ghost" to="/login">
      I already have a card
    </Link>
  );

  return (
    <div className="ld">
      {/* ---------------- hero ---------------- */}
      <section className="ld-hero">
        <div className="ld-lamp" aria-hidden="true">
          <span className="ld-lamp-cord" />
          <span className="ld-lamp-shade" />
          <span className="ld-lamp-glow" />
        </div>

        <div className="ld-kicker">Ex Libris · Est. {new Date().getFullYear()}</div>
        <h1 className="ld-title">
          Every book you've finished,
          <br />
          <em>on one shelf.</em>
        </h1>
        <p className="ld-lede">
          Bookshelf is a quiet little library for the things you read. Shelve a
          book in seconds, give it a medal, and watch your years fill up, one
          volume at a time.
        </p>
        <div className="ld-ctas">
          {primaryCta}
          {secondaryCta}
        </div>

        <div className="ld-case" aria-hidden="true">
          <div className="ld-row">
            {spines.map((s, i) => (
              <span
                key={s.title}
                className="ld-spine"
                style={{
                  "--w": `${s.width}px`,
                  "--h": `${s.height}px`,
                  "--c1": s.colour[0],
                  "--c2": s.colour[1],
                  "--lean": `${s.lean}deg`,
                  "--delay": `${i * 55}ms`,
                }}
              >
                {s.bands && <span className="ld-band ld-band-top" />}
                <span className="ld-spine-title">{s.title}</span>
                {s.bands && <span className="ld-band ld-band-bottom" />}
              </span>
            ))}
            <span className="ld-slot" style={{ "--delay": `${spines.length * 55 + 200}ms` }}>
              <span className="ld-slot-plus">+</span>
            </span>
          </div>
          <div className="ld-plank" />
        </div>
        <div className="ld-caption">The empty slot is for whatever you finish next.</div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section className="ld-section">
        <div className="ld-section-kicker">How it works</div>
        <h2 className="ld-h2">Three steps to a well-kept library</h2>
        <div className="ld-steps">
          <article className="ld-card">
            <span className="ld-card-hole" />
            <div className="ld-numeral">I</div>
            <h3>Find it</h3>
            <p>
              Type a title and pick it from the results. The cover, author and
              page count come with it.
            </p>
            <div className="ld-mock-search">
              <span className="ld-mock-plus">+</span>
              <span className="ld-mock-typing">Project Hail Ma</span>
            </div>
          </article>

          <article className="ld-card ld-card-tilt">
            <span className="ld-card-hole" />
            <div className="ld-numeral">II</div>
            <h3>Rate it</h3>
            <p>
              Bronze, silver or gold, or make up your own ratings and categories
              with any emoji you like.
            </p>
            <div className="ld-mock-medals">
              <span role="img" aria-label="Bronze">
                🥉
              </span>
              <span role="img" aria-label="Silver">
                🥈
              </span>
              <span className="ld-mock-on" role="img" aria-label="Gold">
                🥇
              </span>
            </div>
          </article>

          <article className="ld-card">
            <span className="ld-card-hole" />
            <div className="ld-numeral">III</div>
            <h3>Shelve it</h3>
            <p>
              It lands on this year's shelf. Look back over the years and see
              what kind of reader you've been.
            </p>
            <div className="ld-mock-shelf">
              <span className="ld-mock-plaque">{new Date().getFullYear()}</span>
              <span className="ld-mock-books">
                <i />
                <i />
                <i />
                <i className="ld-mock-new" />
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* ---------------- features ---------------- */}
      <section className="ld-section">
        <div className="ld-features">
          <div className="ld-feature">
            <span className="ld-feature-icon">{"❦\uFE0E"}</span>
            <h4>Shelves by year</h4>
            <p>Your reading, grouped the way you remember it.</p>
          </div>
          <div className="ld-feature">
            <span className="ld-feature-icon">{"✒\uFE0E"}</span>
            <h4>Your own notes</h4>
            <p>Write a few lines on each book so you remember why it mattered.</p>
          </div>
          <div className="ld-feature">
            <span className="ld-feature-icon">{"⌕\uFE0E"}</span>
            <h4>A searchable catalogue</h4>
            <p>Find any book by title or author, or filter by medal or category.</p>
          </div>
          <div className="ld-feature">
            <span className="ld-feature-icon">{"✉\uFE0E"}</span>
            <h4>Share your shelf</h4>
            <p>Every library has a public link, ready to send to a friend.</p>
          </div>
        </div>
      </section>

      {/* ---------------- closing card ---------------- */}
      <section className="ld-section ld-closing">
        <div className="ld-borrower">
          <div className="ld-borrower-head">
            <span>Bookshelf Lending Library</span>
            <span className="ld-borrower-no">No. {user ? user.id : "—"}</span>
          </div>
          <div className="ld-borrower-body">
            <div className="ld-borrower-lines">
              <div>
                <span>Reader</span>
                <b>{user ? user.email : "You"}</b>
              </div>
              <div>
                <span>Books allowed</span>
                <b>As many as you can finish</b>
              </div>
              <div>
                <span>Late fees</span>
                <b>None, ever</b>
              </div>
            </div>
            <div className="ld-stamp">
              {user ? "Member" : "Free"}
              <small>for life</small>
            </div>
          </div>
          <div className="ld-borrower-cta">{primaryCta}</div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
