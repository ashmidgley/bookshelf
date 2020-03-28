import React from 'react';
import './review.css';
import Loading from '../loading/loading';
import moment from 'moment';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { fetchBooks } from '../../actions/book-actions';
import { fetchCategories } from '../../actions/category-actions';
import { fetchRatings } from '../../actions/rating-actions';

class Review extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookId: parseInt(props.match.params.id),
            book: null,
            paragraphs: null,
            loading: true,
            error: false
        };
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
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings)) {
            var book = nextProps.books.find(b => b.id === this.state.bookId);
            this.setState({
                book: book,
                paragraphs: book.summary ? book.summary.split('\n') : null,
                loading: false
            });
            return;
        }
        
        if(nextProps.bookError || nextProps.categoryError || nextProps.ratingError) {
            this.setState({
                error: true,
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
            <div className="column is-8 is-offset-2 form-container">
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
                                this.state.paragraphs.map(paragraph =>
                                    <p className="summary-text">{paragraph}</p>
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
                                            {
                                                this.props.categories.find(c => c.id === this.state.book.categoryId) ?
                                                this.props.categories.find(c => c.id === this.state.book.categoryId).code
                                                :
                                                '-'
                                            }
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
                                            {
                                                this.props.ratings.find(r => r.id === this.state.book.ratingId) ? 
                                                this.props.ratings.find(r => r.id === this.state.book.ratingId).code 
                                                :
                                                '-'
                                            }
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
  
const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items,
    bookError: state.books.error,
    categoryError: state.categories.error,
    ratingError: state.ratings.error
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(Review);