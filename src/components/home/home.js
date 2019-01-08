import React, { Component } from 'react';
import { Heading, Card, Media, Content } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render(){
        return (
            <div style={{ "text-align": "center"}}>
              {this.props.reviews.map(review =>
                <div style={{ "maxWidth" : "300px", "margin" : "30px", "display" : "inline-block"  }}>
                    <Link to={`/review/${review.id}`}>
                        <Card>
                        <Card.Image src={window.location.origin + '/images/' + review.image} />
                        <Card.Content>
                            <Media>
                            <Media.Item>
                                <Heading size={4}>{review.title}</Heading>
                                <Heading subtitle size={6}>By {review.author}</Heading>
                            </Media.Item>
                            </Media>
                            <Content style={{ "text-align" : "left" }}>{review.content.substr(0, 50)}...</Content>
                            <Heading size={6}>Posted on {review.createdOn}</Heading>
                        </Card.Content>
                        </Card>
                    </Link>
                </div>
                )}
            </div>
        )
    }
}

export default Home;