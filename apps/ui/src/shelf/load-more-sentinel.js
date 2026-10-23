import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Calls onVisible when scrolled near; replaces react-infinite-scroller.
const LoadMoreSentinel = ({ onVisible, active, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (!active || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onVisible();
      },
      { rootMargin: "400px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [active, onVisible]);

  if (!active) return null;
  return <div ref={ref}>{children}</div>;
};

LoadMoreSentinel.propTypes = {
  onVisible: PropTypes.func.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node,
};

export default LoadMoreSentinel;
