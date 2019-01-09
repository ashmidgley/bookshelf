import React, { Component } from 'react';
import { Heading, Section, Hero, Container } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './header.css';

class Header extends Component {

  render() {
    return (
        <Section id="header-body">
            <Hero color="info">
            <Hero.Body>
                <Container>
                    <Heading size={1}><Link to={'/'}>Midgley's 2019 Reads</Link></Heading>
                    <Heading subtitle>Ticking off the New Year's resolution one cover at a time.</Heading>
                </Container>
            </Hero.Body>
            </Hero>
        </Section>
    )
  }
}

export default Header;
          