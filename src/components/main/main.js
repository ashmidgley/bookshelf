import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Card, Heading, Media, Content } from 'react-bulma-components';
import './main.css';

class Main extends Component {

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
        <div>
            {this.reviews.map(review =>
                <Card style={{ "max-width" : "300px", "margin" : "50px auto" }}>
                <a>
                    <Card.Image src={review.image} />
                </a>
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
    )
  }
}

export default Main;