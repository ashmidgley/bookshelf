import React, { Component } from 'react';
import { Heading, Card, Media, Content } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    render(){
        return (
            <div>
              {this.props.reviews.map(review =>
                <Card style={{ "maxWidth" : "300px", "margin" : "50px auto" }}>
                <Link to={`/review/${review.id}`}>
                    <Card.Image src={review.image} />
                </Link>
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

export default Home;