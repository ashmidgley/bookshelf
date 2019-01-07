import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './review.css';

class Review extends Component {

    render() {
        var paragraphs = this.props.review.content.split("\n");
        return (
            <div id="body">
                <Link to={'/'}>
                    <a href="#">Back to Home</a>
                </Link>
                <div id="header">
                    <Heading size={2} style={{ 'margin-bottom' : '.5rem' }}>{ this.props.review.title }</Heading>
                    <Heading size={6}>{ this.props.review.createdOn }</Heading>
                    <img id='review-img' src={ this.props.review.image } alt='Review' />
                </div>
                {paragraphs.map(p =>
                    <p>{ p }</p>
                )}
            </div>
        );
    }
}

export default Review;