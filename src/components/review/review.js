import React from 'react';
import './review.css';
import Loading from '../loading/loading';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { getBook } from '../../actions/book-actions';
import { getCategory } from '../../actions/category-actions';
import { getRating } from '../../actions/rating-actions';

class Review extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookId: parseInt(props.match.params.id),
            book: null,
            category: null,
            rating: null,
            paragraphs: null,
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getBook(this.state.bookId);
    }

    getBook = (id) => {
        getBook(id)
            .then(response => {
                this.getCategory(response.categoryId);
                this.getRating(response.ratingId);
                this.setState({
                    book: response,
                    paragraphs: response.summary ? response.summary.split('\n') : null,
                    loading: false
                });
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    getCategory = (id) => {
        getCategory(id)
            .then(response => {
                this.setState({
                    category: response
                });
            })
    }

    getRating = (id) => {
        getRating(id)
            .then(response => {
                this.setState({
                    rating: response
                });
            })
    }

    handleError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container">
                <Helmet>
                    <title>{this.state.book ? `${this.state.book.title} - Bookshelf` : "Review - Bookshelf"}</title>
                    <meta
                        name="description"
                        content={this.state.book && this.state.book.summary.substring(0, 100)}
                    />
                </Helmet>
                <div className="card custom-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="image-header-container">
                                <FontAwesomeIcon icon={faBookOpen} className="book-open-icon" size="lg"/>
                            </div>
                            <div id="review-media-content" className="container has-text-centered">
                            {
                                this.state.error ?
                                <div className="notification is-danger">
                                    Error pulling user data. Please refresh and try again.
                                </div>
                                :
                                <div>
                                    <p className="title">{this.state.book.title}</p>
                                    <p className="subtitle is-6">By {this.state.book.author}</p>
                                    <div className="tags has-addons level-item">
                                        <span id="tag-secondary" className="tag is-rounded">
                                            {moment(this.state.book.finishedOn).format('Do MMMM')}
                                        </span>
                                    </div>
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                    {
                        !this.state.error &&
                        <div id="review-content" className="has-text-centered">
                            <hr />
                            {
                                this.state.paragraphs ?
                                this.state.paragraphs.map((paragraph, index) =>
                                    <p key={index} className="summary-text">{paragraph}</p>
                                )
                                :
                                <div className="notification">
                                    No summary to display.
                                </div>
                            }
                            <hr />
                            <nav className="level is-mobile">
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="heading">Category</p>
                                        <p className="review-subtitle">
                                            {this.state.category ? this.state.category.code : '-'}
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
                                            {this.state.rating ? this.state.rating.code : '-'}
                                        </p>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Review;