import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

class Header extends Component {

  title = "2019 Reads";
  subtitle = "Man vs. New Year's resolution.";

  render() {
    return (
        // <Section id="header-body">
        //     <Hero color="info">
        //     <Hero.Body id="header-hero">
        //         <Container id="header-container">
        //             <Heading size={1}><Link to={'/'}>Midgley's 2019 Reads</Link></Heading>
        //             <Heading subtitle>Ticking off the New Year's resolution one cover at a time.</Heading>
        //         </Container>
        //     </Hero.Body>
        //     </Hero>
        // </Section>
        <p>Header</p>
    )
  }
}

export default Header;
          