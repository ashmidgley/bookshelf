
import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Heading, Section, Hero, Container } from 'react-bulma-components';

class Header extends Component {

    render() {
        return (
            <Section style= {{ "padding": "0" }}>
                <Hero color="primary">
                <Hero.Body>
                    <Container>
                    <Heading>Midgley's Book Reviews</Heading>
                    <Heading subtitle size={4}>Eat, sleep, read, repeat.</Heading>
                    </Container>
                </Hero.Body>
                </Hero>
            </Section>
        );
    };
}

export default Header;