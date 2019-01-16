import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

class Header extends Component {

  title = "2019 Reads";
  subtitle = "Man vs. New Year's resolution";

  render() {
    return (
        <section className="hero is-info">
          <div className="hero-body">
            <div className="container">
              <h1 className="title"><Link to={'/'}>{this.title}</Link></h1>
              <h2 className="subtitle">{this.subtitle}</h2>
            </div>
          </div>
        </section>
    )
  }
}

export default Header;
          