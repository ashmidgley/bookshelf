import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import './App.css';
import { connect } from 'react-redux';
import { fetchBooks } from './actions/bookActions';
import { fetchCategories } from './actions/categoryActions';
import { fetchRatings } from './actions/ratingActions';
import Admin from './components/admin/admin';
import BookForm from './components/book-form/book-form';
import CategoryForm from './components/category-form/category-form';
import RatingForm from './components/rating-form/rating-form';
import Navigation from './components/navigation/navigation'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPropsLoaded: false,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.props.fetchBooks();
    this.props.fetchCategories();
    this.props.fetchRatings();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.bookError || nextProps.categoryError || nextProps.ratingError) {
      var error = nextProps.ratingError ? nextProps.ratingError : null;
      error = nextProps.categoryError ? nextProps.categoryError : error;
      error = nextProps.bookError ? nextProps.bookError : error;
      error += '. Check log for details.';
      this.setState({
        error: error,
        loading: false
      })
      return;
    }
    if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings)) {
      this.setState({
        loading: false
      })
    }
  }

  render() {
    return (
        <Router>
          <div>
            <div className="screen-content">
              <Navigation />
              {this.state.loading ?
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
                  :
                  null
                }
              {this.state.error ?
                <div className="container error-container">
                  <div className="notification is-danger">
                    {this.state.error}
                  </div>
                </div>
                :
                null
              }
              {!this.state.loading && !this.state.error ?
                <div className="container app-container">
                  <Route exact path="/" component={Home} />
                  <Route exact path="/admin" component={Admin} />
                  <Route exact path="/admin/book-form" component={BookForm} />
                  <Route exact path="/admin/book-form/:id" component={BookForm} />
                  <Route exact path="/admin/category-form" component={CategoryForm} />
                  <Route exact path="/admin/category-form/:id" component={CategoryForm} />
                  <Route exact path="/admin/rating-form" component={RatingForm} />
                  <Route exact path="/admin/rating-form/:id" component={RatingForm} />
                  <Route path="/review/:id" component={Review} />
                </div>
                :
                null
              }
            </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

const mapStateToProps = state => ({
  books: state.books.items,
  bookError: state.books.error,
  categories: state.categories.items,
  categoryError: state.categories.error,
  ratings: state.ratings.items,
  ratingError: state.ratings.error
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(App);