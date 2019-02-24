import React, { Component } from 'react';
import './review.css';
import * as moment from 'moment';

class Review extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column">
                <div className="card review-card">
                    <div className="card-content">
                        <div className="media">
                            <img src="/images/krabs.jpeg" className="author-image" alt="Author" />
                            <div className="container has-text-centered review-media-content">
                                <p className="title">{this.props.review.title}</p>
                                <p className="subtitle is-6">By {this.props.review.author}</p>
                                <div className="tags has-addons level-item">
                                    <span className="tag is-rounded is-success">{moment(this.props.review.createdOn).format('Do MMMM')}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="review-content has-text-centered" dangerouslySetInnerHTML={{ __html: this.props.review.summary }}></div>
                </div>
            </div>
        );
    }
}

export default Review;