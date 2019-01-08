
import React, { Component } from 'react';
import { Footer, Hero, Container, Content } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';

class Foot extends Component {

    render() {
        return (
          <Hero.Footer style= {{ "margin-top" : "15px" }}>
            <Footer>
              <Container>
                <Content style={{ textAlign: 'center' }}>
                  <p>
                      <a href="https://github.com/ash-midgley/reviews">
                        <img src={window.location.origin + '/images/github.png'} alt='GitHub icon'/>
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