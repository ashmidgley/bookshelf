import React, { Component } from 'react';
import './admin.css';
import { connect } from 'react-redux';
import BookActions from '../book-actions/book-actions';
import CategoryActions from '../category-actions/category-actions';
import RatingActions from '../rating-actions/rating-actions';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { fetchBooks } from '../../actions/bookActions';
import { fetchCategories } from '../../actions/categoryActions';
import { fetchRatings } from '../../actions/ratingActions';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings))
            this.setState({
                loading: false
        });
    }

    componentDidMount() {
        if(!this.props.books || !this.props.categories || !this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
            this.props.fetchCategories(id);
            this.props.fetchRatings(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            );
        }

        return (
            <div className="column is-8 is-offset-2 admin-container">
                <Helmet>
                    <title>Bookshelf | Admin</title>
                </Helmet>
                <div className="card admin-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="admin-image-header-container">
                                <FontAwesomeIcon icon={faEye} className="admin-icon" size="lg"/>
                            </div>
                        </div>
                        <BookActions />
                        <hr />
                        <CategoryActions />
                        <hr />
                        <RatingActions />
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

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(Admin);