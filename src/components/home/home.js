import React, { Component } from 'react';
import { Heading, Card, Media as Med, Content, Columns } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render(){
        return (
            <Columns id="parent">
                {this.props.reviews.map(review =>
                    <Columns.Column key={review.id} size="one-quarter" className="child">
                        <Link to={`/review/${review.id}`}>
                            <Card>
                            <Card.Image src={window.location.origin + '/images/' + review.image} />
                            <Card.Content>
                                <Med>
                                <Med.Item>
                                    <Heading size={6}>{review.title}</Heading>
                                    <Heading subtitle size={6}>By {review.author}</Heading>
                                </Med.Item>
                                </Med>
                                <Content>{review.content.substr(0, 50)}...</Content>
                                <Heading size={6}>{review.createdOn}</Heading>
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