import React, { Component } from 'react';
import { Heading, Card, Media, Content, Columns } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render(){
        return (
            <Columns style={{ "margin" : "auto 80px" }}>
                {this.props.reviews.map(review =>
                    <Columns.Column size="one-quarter" style={{ "margin-top" : "30px" }}>
                        <Link to={`/review/${review.id}`}>
                            <Card>
                            <Card.Image src={window.location.origin + '/images/' + review.image} />
                            <Card.Content>
                                <Media>
                                <Media.Item>
                                    <Heading size={5}>{review.title}</Heading>
                                    <Heading subtitle size={7}>By {review.author}</Heading>
                                </Media.Item>
                                </Media>
                                <Content>{review.content.substr(0, 50)}...</Content>
                                <Heading size={7}>Posted on {review.createdOn}</Heading>
                            </Card.Content>
                            </Card>
                        </Link>
                    </Columns.Column>
                )}
            </Columns>
        )
    }
}

export default Home;