import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, clearUser } from './actions/user-actions';

import Home from './components/home/home';
import Shelf from './components/shelf/shelf';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import ManageBooks from './components/manage-books/manage-books';
import ManageCategories from './components/manage-categories/manage-categories';
import ManageRatings from './components/manage-ratings/manage-ratings';
import ManageUsers from './components/manage-users/manage-users';
import UpdateUser from './components/update-user/update-user';
import AddBook from './components/add-book/add-book';
import UpdateBook from './components/update-book/update-book';
import CategoryForm from './components/category-form/category-form';
import RatingForm from './components/rating-form/rating-form';
import Navigation from './components/navigation/navigation';
import Login from './components/login/login';
import Register from './components/register/register';
import NoMatch from './components/no-match/no-match';
import MyAccount from './components/my-account/my-account';
import UpdateEmail from './components/update-email/update-email';
import UpdatePassword from './components/update-password/update-password';
import DeleteAccount from './components/delete-account/delete-account';
import ForgotPassword from './components/forgot-password/forgot-password';
import ResetPassword from './components/reset-password/reset-password';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      redirectLogin: false
    };
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    if(token) {
      var currentTime = new Date().getTime();
      var expiryDate = localStorage.getItem('expiryDate');
      if(expiryDate < currentTime) {
        var user = {
          userId: localStorage.getItem('userId'),
          email: localStorage.getItem('userEmail'),
          isAdmin: localStorage.getItem('userIsAdmin')
        };
        
        var data = { token, expiryDate, user };
        this.props.setUser(data);
      }
    } else {
      this.props.clearUser();
      if(window.location.pathname !== '/' && !window.location.pathname.includes('shelf')) {
        this.setState({
          redirectLogin: true
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
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
                  {
                    this.state.redirectLogin && <Redirect to="/login"/>
                  }
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route exact path="/reset-password/:userId/:resetToken" component={ResetPassword} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/shelf/:id" component={Shelf} />
                    <Route exact path="/review/:id" component={Review} />
                    <Route exact path="/manage-books" component={ManageBooks} />
                    <Route exact path="/manage-categories" component={ManageCategories} />
                    <Route exact path="/manage-ratings" component={ManageRatings} />
                    <Route exact path="/my-account" component={MyAccount} />
                    <Route exact path="/update-password" component={UpdatePassword} />
                    <Route exact path="/update-email" component={UpdateEmail} />
                    <Route exact path="/delete-account" component={DeleteAccount} />
                    <Route exact path="/book-form" component={AddBook} />
                    <Route exact path="/book-form/:id" component={UpdateBook} />
                    <Route exact path="/category-form" component={CategoryForm} />
                    <Route exact path="/category-form/:id" component={CategoryForm} />
                    <Route exact path="/rating-form" component={RatingForm} />
                    <Route exact path="/rating-form/:id" component={RatingForm} />
                    <Route exact path="/admin/manage-users" component={ManageUsers} />
                    <Route exact path="/admin/manage-users/:id" component={UpdateUser} />
                    <Route component={NoMatch} />
                </Switch>
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

export default connect(mapStateToProps, {setUser, clearUser})(App);