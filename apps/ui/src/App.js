import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Redirect, withRouter } from "react-router-dom";
import { clearUser } from "./shared/user.service";
import { capturePageView, initAnalytics } from "./shared/analytics.service";
import Routes from "./routes";
import Footer from "./shared/footer/footer";
import Navigation from "./shared/navigation/navigation";

const AnalyticsRouteTrackerBase = ({ location }) => {
  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    capturePageView(path);
  }, [location.hash, location.pathname, location.search]);

  return null;
};

const AnalyticsRouteTracker = withRouter(AnalyticsRouteTrackerBase);

const App = () => {
  useEffect(() => {
    initAnalytics();

    if (process.env.REACT_APP_ERROR) {
      clearUser();
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        <AnalyticsRouteTracker />
        <div className="screen-content">
          <Navigation />
          <div className="container app-container">
            {process.env.REACT_APP_ERROR ? (
              <div>
                <div id="global-error" className="notification is-danger">
                  {process.env.REACT_APP_ERROR}
                </div>
                <Redirect to="/" />
              </div>
            ) : (
              <Routes></Routes>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
