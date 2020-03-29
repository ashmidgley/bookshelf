import React from 'react';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

class Navigation extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }

  componentDidMount() {
    this.checkDimensions();
    window.addEventListener("resize", this.checkDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkDimensions);
  }

  checkDimensions = () => {
    this.setState({
      width: window.innerWidth
    });
  }

  render() {
      return(
          <div className="hero-head">
              {
                this.state.width <= 600 ?
                <MobileNav />
                :
                <DesktopNav />
              }
          </div>
      );
  }
}

export default Navigation;