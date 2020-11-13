import React from "react";
import "./no-match.css";
import { Link } from "react-router-dom";

const NoMatch = () => (
  <div className="not-found-container">
    <img src="/images/not-found.png" alt="404 Not Found error" />
    <p>
      Page not found. Return <Link to="/">home</Link>?
    </p>
  </div>
);

export default NoMatch;
