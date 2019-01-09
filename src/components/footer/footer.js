import React, { Component } from 'react';
import { Footer as Foot, Hero, Container, Content } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './footer.css';

class Footer extends Component {

    render() {
        return (
          <Hero.Footer id="footer-body">
            <Foot>
              <Container>
                <Content id="footer-content">
                  <p>
                      <a href="https://github.com/ash-midgley/reviews">
                        <img src={window.location.origin + '/images/github.png'} alt='GitHub icon'/>
                      </a>
                  </p>
                </Content>
              </Container>
            </Foot>
          </Hero.Footer>
        )
    }
}

export default Footer;