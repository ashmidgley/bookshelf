import React, { Component } from 'react';
import { Heading, Card, Media as Med, Content, Columns } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            columnSize: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.checkDimensions();
        window.addEventListener("resize", this.checkDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkDimensions);
    }

    /* = () => binds 'this' automatically to checkDimensions */
    checkDimensions = () => {
        var newVal = null;
        if(window.innerWidth < 769) {
            newVal = null;
        } else if(window.innerWidth > 769 && window.innerWidth < 900) {
            newVal = 'half';
        } else if(window.innerWidth > 900 && window.innerWidth < 1200) {
            newVal = 'one-third';
        } else if(window.innerWidth > 1000) {
            newVal = 'one-quarter';
        }
        this.setState({columnSize: newVal}); 
    }

    render(){
        return (
            <Columns id="parent">
                {this.props.reviews.map(review =>
                    <Columns.Column key={review.id} size={this.state.columnSize} className="child">
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