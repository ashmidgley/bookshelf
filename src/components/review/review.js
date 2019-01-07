import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './review.css';

class Review extends Component {

    render() {
        return (
            <div id="body">
                <Link to={'/'}>
                    <a>Back to Home</a>
                </Link>
                <div id="header">
                    <Heading size={2} style={{ 'margin-bottom' : '.5rem' }}>{ this.props.review.title }</Heading>
                    <Heading size={6}>{ this.props.review.createdOn }</Heading>
                    <img src={ this.props.review.image } alt='Review' />
                </div>
                <p>{ this.props.review.content }</p>
            </div>
        );
    }
}

export default Review;