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
                        <div class="media">
                            <div class="media-center">
                                <img src="/images/krabs.jpeg" class="author-image" alt="Author" />
                            </div>
                            <div class="media-content has-text-centered review-media-content">
                                <p class="title">{this.props.review.title}</p>
                                <p class="subtitle is-6">By {this.props.review.author}</p>
                                <div class="tags has-addons level-item">
                                    <span class="tag is-rounded is-success">{moment(this.props.review.createdOn).format('Do MMMM YYYY')}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="review-content has-text-centered" dangerouslySetInnerHTML={{ __html: this.props.review.content }}></div>
                </div>
            </div>
        );
    }
}

export default Review;