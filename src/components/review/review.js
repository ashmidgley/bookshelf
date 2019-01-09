import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './review.css';

class Review extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        var paragraphs = this.props.review.content.split("\n");
        return (
            <div id="review-body">
                <div id="header">
                    <Heading size={2}>{this.props.review.title}</Heading>
                    <Heading subtitle>By {this.props.review.author}</Heading>
                    <img src={window.location.origin + '/images/' + this.props.review.image} alt='Review' id='review-img' />
                </div>
                {paragraphs.map(p =>
                    <p>{p}</p>
                )}
                <Heading size={6} id="createdon">{this.props.review.createdOn}</Heading>
                <Link to={'/'}>Back to Home</Link>
            </div>
        );
    }
}

export default Review;