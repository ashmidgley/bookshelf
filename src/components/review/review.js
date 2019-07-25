import React, { Component } from 'react';
import './review.css';
import * as moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Review extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: []
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            book: this.props.books.find(b => b.id == this.props.match.params.id)
        });
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column">
                <div className="card review-card">
                    <div className="card-content">
                        <div className="media">
                            <img src="/images/book.jpeg" className="author-image" alt="Author" />
                            <div className="container has-text-centered review-media-content">
                                <p className="title">{this.state.book.title}</p>
                                <p className="subtitle is-6">By {this.state.book.author}</p>
                                <div className="tags has-addons level-item">
                                    <span id="tag-primary" className="tag is-rounded">{moment(this.state.book.startedOn).format('Do MMMM')}</span>
                                    <span id="tag-secondary" className="tag is-rounded">{moment(this.state.book.finishedOn).format('Do MMMM')}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="review-content has-text-centered">
                        <hr />
                        <p>{this.state.book.summary}</p>
                        <hr />
                        <nav className="level is-mobile">
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Category</p>
                                    <p className="title">Code</p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Pages</p>
                                    <p className="title">{this.state.book.pageCount}</p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div> 
                                    <p className="heading">Rating description</p>
                                    <p className="title">Rating code</p>
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