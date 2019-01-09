import React, { Component } from 'react';
import { Heading, Card, Media as Med, Content, Columns, Progress } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './home.css'

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            columnSize: null,
            loading: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({loading: false});
        }, 2000);
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
        }else if(window.innerWidth > 769 && window.innerWidth < 1000) {
            newVal = 'one-third';
        } else if(window.innerWidth > 1000 && window.innerWidth < 1200) {
            newVal = 'one-quarter';
        } else if(window.innerWidth > 1200) {
            newVal = 'one-fifth';
        }
        this.setState({columnSize: newVal}); 
    }

    render(){
        if(this.state.loading) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            )
        } else {
            return (
                <div id="parent">
                    <div id="progress-container">
                        <Progress max={this.props.totalReviews} value={this.props.reviews.length} color="success" />
                        <p><FontAwesomeIcon icon={faCalculator}/> {this.props.reviews.length} of {this.props.totalReviews} complete</p>
                    </div>
                    <Columns>
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
                                        <Content id="tile-content">{review.content.substr(0, 50)}...</Content>
                                        <p id="tile-createdon">{review.createdOn}</p>
                                    </Card.Content>
                                    </Card>
                                </Link>
                            </Columns.Column>
                        )}
                    </Columns>
                </div>
            )
        }
    }
}

export default Home;