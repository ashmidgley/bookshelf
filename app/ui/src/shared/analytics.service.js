import { inject } from "@vercel/analytics";

let initialized = false;

export const initAnalytics = () => {
  if (initialized) {
    return;
  }

  inject();

  initialized = true;
};

export const identifyUserWithToken = (token) => {
  // Vercel Web Analytics does not support user identification.
  void token;
};

export const capturePageView = (path) => {
  // Vercel Web Analytics automatically tracks page views.
  void path;
};

export const resetAnalyticsUser = () => {
  // Vercel Web Analytics does not manage user identity state.
};
