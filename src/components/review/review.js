import React, { Component } from 'react';
import './review.css';
import * as moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

class Review extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: [],
            paragraphs: []
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var book = this.props.books.find(b => b.id == this.props.match.params.id);
        this.setState({
            book: book,
            paragraphs: book.summary.split('\n')
        });
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column">
                <div className="card review-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="review-image-header-container">
                                <FontAwesomeIcon icon={faBookOpen} className="review-icon" size="lg"/>
                            </div>
                            <div className="container has-text-centered review-media-content">
                                <p className="title">{this.state.book.title}</p>
                                <p className="subtitle is-6">By {this.state.book.author}</p>
                                <div className="tags has-addons level-item">    
                                    <span id="tag-secondary" className="tag is-rounded">{moment(this.state.book.finishedOn).format('Do MMMM')}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="review-content has-text-centered">
                        <hr />
                        {this.state.paragraphs.map(paragraph =>
                            <p>{paragraph}</p>
                        )}
                        <hr />
                        <nav className="level is-mobile">
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Category</p>
                                    <p className="review-subtitle">
                                        {this.props.categories.find(c => c.id === this.state.book.categoryId)
                                        ?
                                        this.props.categories.find(c => c.id === this.state.book.categoryId).code
                                        :
                                        '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Pages</p>
                                    <p className="review-subtitle">{this.state.book.pageCount}</p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div> 
                                    <p className="heading">Rating</p>
                                    <p className="review-subtitle">
                                    {this.props.ratings.find(r => r.id === this.state.book.ratingId) ? 
                                    this.props.ratings.find(r => r.id === this.state.book.ratingId).code : "-"}</p>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

  Review.propTypes = {
    books: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ratings: PropTypes.array.isRequired,
  };
  
  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items
  });

export default connect(mapStateToProps)(Review);