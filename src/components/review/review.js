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
            book: this.props.books.find(b => b.id === this.props.match.params.id)
        });
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column">
                {this.state.book ?
                <div className="card review-card">
                    <div className="card-content">
                        <div className="media">
                            <img src="/images/krabs.jpeg" className="author-image" alt="Author" />
                            <div className="container has-text-centered review-media-content">
                                <p className="title"></p>
                                <p className="subtitle is-6">By {this.state.book.author}</p>
                                <div className="tags has-addons level-item">
                                    <span className="tag is-rounded is-success">{moment(this.state.book.createdOn).format('Do MMMM')}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="review-content has-text-centered" dangerouslySetInnerHTML={{ __html: this.state.book.summary }}></div>
                </div>
                :
                <div> </div>
                }
            </div>
        );
    }
}

  Review.propTypes = {
    books: PropTypes.array.isRequired,
  };
  
  const mapStateToProps = state => ({
    books: state.books.items
  });

export default connect(mapStateToProps)(Review);