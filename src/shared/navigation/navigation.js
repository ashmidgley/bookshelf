import React, { useState, useEffect } from "react";
import DesktopNav from "../desktop-nav/desktop-nav";
import MobileNav from "../mobile-nav/mobile-nav";

const Navigation = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    checkDimensions();
    window.addEventListener("resize", checkDimensions);

    return () => {
      window.removeEventListener("resize", checkDimensions);
    };
  }, []);

  const checkDimensions = () => {
    setWidth(window.innerWidth);
  };

  return (
    <div className="hero-head">
      {width <= 600 ? <MobileNav /> : <DesktopNav />}
    </div>
  );
};

export default Navigation;
