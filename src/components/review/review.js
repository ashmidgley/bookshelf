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
                <div id="header">
                    <Heading size={2}>{ this.props.review.title }</Heading>
                    <Heading subtitle size={6}>By { this.props.review.author }</Heading>
                    <img id='review-img' src={ this.props.review.image } alt='Review' />
                </div>
                {paragraphs.map(p =>
                    <p>{ p }</p>
                )}
                <Heading size={6}>Posted on { this.props.review.createdOn }.</Heading>
                <Link to={'/'}>
                    <a href="#">Back to Home</a>
                </Link>
            </div>
        );
    }
}

export default Review;