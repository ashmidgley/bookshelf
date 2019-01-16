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
                {/* <div className="review-header">
                    <Heading size={2}>{this.props.review.title}</Heading>
                    <Heading subtitle>By {this.props.review.author}</Heading>
                    <img src={'/images/' + this.props.review.image} alt='Review Book' />
                </div>
                <div className="review-content" dangerouslySetInnerHTML={{ __html: this.props.review.content }}></div>
                <Heading size={6} id="createdon">{this.props.review.createdOn}</Heading> */}
                <Link to={'/'}>Back to Home</Link>
            </div>
        );
    }
}

export default Review;