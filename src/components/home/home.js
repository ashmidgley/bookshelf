import React, { Component } from 'react';
import { Heading, Card, Media as Med, Content, Columns } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render(){
        return (
            <Media query="(max-width: 600px)">
                {matches => matches ? 
                    (
                        <Columns style={{ "margin" : "auto 15px" }}>
                            {this.props.reviews.map(review =>
                                <Columns.Column key={review.id} style={{ "marginTop" : "30px", "padding" : "1.25rem" }}>
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
                    ) : (
                        <Columns style={{ "margin" : "auto 80px" }}>
                            {this.props.reviews.map(review =>
                                <Columns.Column key={review.id} size="one-quarter" style={{ "marginTop" : "30px", "padding" : "1.25rem" }}>
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
            </Media>
        )
    }
}

export default Home;