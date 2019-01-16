import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
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
        return (
            <div id="parent">
                <div id="progress-container">
                    <progress className="progress is-primary" value={this.props.reviews.length} max={this.props.totalReviews}></progress>
                    <p><FontAwesomeIcon icon={faCalculator}/> {this.props.reviews.length} of {this.props.totalReviews} complete</p>
                </div>
                <div className="columns">
                    {this.props.reviews.map(review =>
                        <div className="column child" key={review.id}>
                            <Link to={`/review/${review.id}`}>
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image">
                                            <img src={window.location.origin + '/images/' + review.image} alt="Review tile" />
                                        </figure>
                                    </div>
                                    <div className="card-content">
                                        <div className="media">
                                            <div className="media-content">
                                                <p className="title is-6">{review.title}</p>
                                                <p className="subtitle is-6">By {review.author}</p>
                                            </div>
                                        </div>
                                        <div className="content" >
                                            <p id="tile-content">{review.content.replace(/<[^>]+>/g, '').substr(0, 50)}...</p>
                                            <p id="tile-createdon">{review.createdOn}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                {/* <Columns>
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
                                    <Content id="tile-content">{review.content.replace(/<[^>]+>/g, '').substr(0, 50)}...</Content>
                                    <p id="tile-createdon">{review.createdOn}</p>
                                </Card.Content>
                                </Card>
                            </Link>
                        </Columns.Column>
                    )}
                </Columns> */}
            </div>
        )
    }
}

export default Home;