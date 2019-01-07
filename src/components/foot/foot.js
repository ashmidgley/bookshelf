
import React, { Component } from 'react';
import { Footer, Hero, Container, Content } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import logo from '../../images/github.png';

class Foot extends Component {

    render() {
        return (
          <Hero.Footer>
            <Footer>
              <Container>
                <Content style={{ textAlign: 'center' }}>
                  <p>
                      <a href="https://github.com/ash-midgley/reviews">
                        <img src={logo} alt='GitHub icon'/>
                      </a>
                  </p>
                </Content>
              </Container>
            </Footer>
          </Hero.Footer>
        )
    }
}

export default Foot;