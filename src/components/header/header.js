import React, { Component } from 'react';
import { Heading, Section, Hero, Container } from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import 'react-bulma-components/dist/react-bulma-components.min.css';

class Header extends Component {

  render() {
    return (
        <Section style= {{ "padding": "0" }}>
            <Hero color="primary">
            <Hero.Body>
                <Container>
                <Heading>2019 Book Reviews</Heading>
                <Heading subtitle size={4}><FontAwesomeIcon icon={faCalculator}/> 0 down, 25 to go.</Heading>
                </Container>
            </Hero.Body>
            </Hero>
        </Section>
    )
  }
}

export default Header;
          