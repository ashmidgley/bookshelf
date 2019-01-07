import React, { Component } from 'react';
import './review.css';
import { Link } from "react-router-dom";

class Review extends Component {

    render() {
        return (
            <div>
                <Link to={'/'}>
                    <a>Back to Home</a>
                </Link>
                <div id="header">
                    <h1>{ this.props.review.title }</h1>
                    <h3>{ this.props.review.createdOn }</h3>
                    <img src={ this.props.review.image } alt='Review'></img>
                </div>
                <p>{ this.props.review.content }</p>
            </div>
        );
    }
}

export default Review;