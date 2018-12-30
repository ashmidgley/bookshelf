import React, { Component } from 'react';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Card, Heading, Media, Content, Section, Hero, Container } from 'react-bulma-components';

class App extends Component {

  reviews = [
    {
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 1",
      content: "This is content 1",
      createdOn: "30-12-2018"
    },
    {
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 2",
      content: "This is content 2",
      createdOn: "30-12-2018"
    },
    {
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 3",
      content: "This is content 3",
      createdOn: "30-12-2018"
    }
  ];

  render() {
    return (
      <div className="App">

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

        {this.reviews.map(review =>
        <Card style={{ "max-width" : "300px", "margin" : "30px auto" }}>
          <Card.Image src={review.image} />
          <Card.Content>
            <Media>
              <Media.Item>
                <Heading size={4}>{review.title}</Heading>
                <Heading subtitle size={6}>{review.createdOn}</Heading>
              </Media.Item>
            </Media>
            <Content>{review.content.substr(0, 50)}...</Content>
          </Card.Content>
        </Card>
        )}
      </div>
    );
  }
}

export default App;
