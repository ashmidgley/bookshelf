import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Shelf from './components/shelf/shelf';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import './App.css';
import { connect } from 'react-redux';
import ManageBooks from './components/manage-books/manage-books';
import ManageCategories from './components/manage-categories/manage-categories';
import ManageRatings from './components/manage-ratings/manage-ratings';
import ManageUsers from './components/manage-users/manage-users';
import AddBook from './components/book-form/add-book';
import UpdateBook from './components/book-form/update-book';
import CategoryForm from './components/category-form/category-form';
import RatingForm from './components/rating-form/rating-form';
import Navigation from './components/navigation/navigation'
import Login from './components/login/login';
import RedPill from './components/red-pill/red-pill';
import Register from './components/register/register';
import { setUser } from './actions/userActions';
import User from './models/user';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
   
    var token = localStorage.getItem('token');
    var currentTime = new Date().getTime();
    var expiryDate = localStorage.getItem('expiryDate');
    if(token && expiryDate < currentTime) {
      var user = new User(localStorage.getItem('userId'), localStorage.getItem('userEmail'), localStorage.getItem('userIsAdmin'));
      var data = { token, expiryDate, user };
      this.props.setUser(data);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.bookError || nextProps.categoryError || nextProps.ratingError || nextProps.loginError) {
      this.handleError(nextProps);
    }
  }

  handleError(nextProps) {
    var error = "";
    if(nextProps.bookError)
      error += 'Book error: ' + nextProps.bookError + '. ';
    if(nextProps.categoryError)
      error += 'Category error: ' + nextProps.categoryError + '. ';
    if(nextProps.ratingError)
      error += 'Rating error: ' + nextProps.ratingError + '. ';
    if(nextProps.loginError) {
      error += 'Login error: ' + nextProps.loginError + '. ';
    }
    error += 'Please refresh page and try again.';
    this.setState({
      error: error,
      loading: false
    })
    window.scrollTo(0, 0);
  }

  render() {
    return (
        <Router>
          <div>
            <div className="screen-content">
              <Navigation />
              {this.state.error ?
                <div className="container error-container">
                  <div className="notification is-danger">
                    {this.state.error}
                  </div>
                </div>
                :
                <div className="container app-container">
                <Route exact path="/" component={Home} />
                <Route path="/red-pill" component={RedPill} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/shelf/:id" component={Shelf} />
                <Route path="/review/:id" component={Review} />
                <Route exact path="/admin/manage-books" component={ManageBooks} />
                <Route exact path="/admin/manage-categories" component={ManageCategories} />
                <Route exact path="/admin/manage-ratings" component={ManageRatings} />
                <Route exact path="/admin/manage-users" component={ManageUsers} />
                <Route exact path="/admin/book-form" component={AddBook} />
                <Route exact path="/admin/book-form/:id" component={UpdateBook} />
                <Route exact path="/admin/category-form" component={CategoryForm} />
                <Route exact path="/admin/category-form/:id" component={CategoryForm} />
                <Route exact path="/admin/rating-form" component={RatingForm} />
                <Route exact path="/admin/rating-form/:id" component={RatingForm} />
              </div>
              }
            </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

const mapStateToProps = state => ({
  bookError: state.books.error,
  categoryError: state.categories.error,
  ratingError: state.ratings.error,
  loginError: state.user.error
});

export default connect(mapStateToProps, {setUser})(App);