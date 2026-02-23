import posthog from "posthog-js";
import { parseUser } from "./token.service";

const posthogKey = process.env.REACT_APP_POSTHOG_KEY;
const posthogHost =
  process.env.REACT_APP_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

const analyticsEnabled = () => {
  return Boolean(posthogKey);
};

export const initAnalytics = () => {
  if (!analyticsEnabled() || initialized) {
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: true,
    capture_pageview: false,
  });

  initialized = true;

  const token = localStorage.getItem("token");
  if (token) {
    identifyUserWithToken(token);
  }
};

export const identifyUserWithToken = (token) => {
  if (!analyticsEnabled() || !token) {
    return;
  }

  try {
    const user = parseUser(token);
    posthog.identify(user.id.toString(), {
      email: user.email,
      is_admin: user.isAdmin,
    });
  } catch (error) {
    console.error("Unable to identify user in PostHog.", error);
  }
};

export const capturePageView = (path) => {
  if (!analyticsEnabled()) {
    return;
  }

  const routePath =
    path ||
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  posthog.capture("$pageview", {
    path: routePath,
    $current_url: window.location.href,
  });
};

export const resetAnalyticsUser = () => {
  if (!analyticsEnabled()) {
    return;
  }

  posthog.reset();
};
