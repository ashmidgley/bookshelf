import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Redirect } from "react-router-dom";
import { clearUser } from "./shared/user.service";
import Routes from "./routes";
import Footer from "./shared/footer/footer";
import Navigation from "./shared/navigation/navigation";

const App = () => {
  useEffect(() => {
    if (process.env.REACT_APP_ERROR) {
      clearUser();
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
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
