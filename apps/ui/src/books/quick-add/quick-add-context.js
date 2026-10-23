import React, { createContext, useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";

const QuickAddContext = createContext({ openQuickAdd: () => {} });

const listeners = new Set();

// Shelves subscribe so a book added from anywhere shows up without a reload.
export const subscribeBookAdded = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const notifyBookAdded = (book) => {
  listeners.forEach((fn) => fn(book));
};

export const QuickAddProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, query: "" });

  const openQuickAdd = useCallback((query = "") => {
    setState({ open: true, query: typeof query === "string" ? query : "" });
  }, []);

  const closeQuickAdd = useCallback(() => {
    setState({ open: false, query: "" });
  }, []);

  return (
    <QuickAddContext.Provider
      value={{ ...state, openQuickAdd, closeQuickAdd }}
    >
      {children}
    </QuickAddContext.Provider>
  );
};

QuickAddProvider.propTypes = {
  children: PropTypes.node,
};

export const useQuickAdd = () => useContext(QuickAddContext);
