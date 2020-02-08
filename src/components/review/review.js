import React, { Component } from 'react';
import './review.css';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { fetchBooks } from '../../actions/bookActions';
import { fetchCategories } from '../../actions/categoryActions';
import { fetchRatings } from '../../actions/ratingActions';
import Loading from '../loading/loading';

class Review extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookId: parseInt(props.match.params.id),
            book: null,
            paragraphs: null,
            loading: true
        };
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        if(!this.props.books || !this.props.categories || !this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
            this.props.fetchCategories(id);
            this.props.fetchRatings(id);
        } else {
            var book = this.props.books.find(b => b.id === this.state.bookId);
            this.setState({
                book: book,
                paragraphs: book.summary ? book.summary.split('\n') : null,
                loading: false
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings)) {
            var book = nextProps.books.find(b => b.id === this.state.bookId);
            this.setState({
                book: book,
                paragraphs: book.summary ? book.summary.split('\n') : null,
                loading: false
            });
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

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
                        {this.state.paragraphs ? this.state.paragraphs.map(paragraph =>
                                <p className="summary-text">{paragraph}</p>
                            )
                            :
                            <div className="notification is-link">
                                No summary to display.
                            </div>
                        }
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
  
  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items
  });

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(Review);