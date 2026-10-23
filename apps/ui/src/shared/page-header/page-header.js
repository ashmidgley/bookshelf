import React from "react";
import PropTypes from "prop-types";
import "./page-header.css";

// Night Library page heading: small brass kicker, italic serif title, optional
// subtitle and actions aligned to the right.
const PageHeader = ({ kicker, title, subtitle, children }) => (
  <header className="ph">
    <div className="ph-text">
      {kicker && <div className="ph-kicker">{kicker}</div>}
      <h1 className="ph-title">{title}</h1>
      {subtitle && <p className="ph-subtitle">{subtitle}</p>}
    </div>
    {children && <div className="ph-actions">{children}</div>}
  </header>
);

PageHeader.propTypes = {
  kicker: PropTypes.node,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node,
};

export default PageHeader;
