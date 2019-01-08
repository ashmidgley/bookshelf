import React, { Component } from 'react';
import { Heading, Section, Hero, Container } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import 'react-bulma-components/dist/react-bulma-components.min.css';

class Header extends Component {

  render() {
    return (
        <Section style= {{ "padding": "0" }}>
            <Hero color="info">
            <Hero.Body>
                <Container>
                    <Heading size={1}><Link to={'/'}>2019 Book Reviews</Link></Heading>
                    <Heading subtitle><FontAwesomeIcon icon={faCalculator}/> 0 down, 25 to go.</Heading>
                </Container>
            </Hero.Body>
            </Hero>
        </Section>
    )
  }
}

export default Header;
          