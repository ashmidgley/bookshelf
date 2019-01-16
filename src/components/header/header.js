import React, { Component } from 'react';
import { Heading, Section, Hero, Container } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './header.css';

class Header extends Component {

  title = "2019 Reads";
  subtitle = "Man vs. New Year's resolution.";

  render() {
    return (
        <Section id="header-body">
            <Hero color="info">
            <Hero.Body id="header-hero">
                <Container id="header-container">
                    <Heading size={1}><Link to={'/'}>{this.title}</Link></Heading>
                    <Heading subtitle>{this.subtitle}</Heading>
                </Container>
            </Hero.Body>
            </Hero>
        </Section>
    )
  }
}

export default Header;
          