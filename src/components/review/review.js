import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './review.css';

class Review extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="review-body">
                <div className="review-header">
                    <h1 className="title is-2">{this.props.review.title}</h1>
                    <h1 className="subtitle">By {this.props.review.author}</h1>
                    <img src={'/images/' + this.props.review.image} alt='Review Book' />
                </div>
                <div className="review-content" dangerouslySetInnerHTML={{ __html: this.props.review.content }}></div>
                <p id="createdon">{this.props.review.createdOn}</p>
                <Link to={'/'}>Back to Home</Link>
            </div>
        );
    }
}

export default Review;