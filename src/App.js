import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { clearUser } from './actions/user-actions';

import Home from './components/home/home';
import Shelf from './components/shelf/shelf';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import ManageBooks from './components/manage-books/manage-books';
import ManageCategories from './components/manage-categories/manage-categories';
import ManageRatings from './components/manage-ratings/manage-ratings';
import ManageUsers from './components/manage-users/manage-users';
import UpdateUser from './components/update-user/update-user';
import SearchForm from './components/add-book/search-form';
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

  componentDidMount() {
    if(process.env.REACT_APP_ERROR) {
      clearUser();
    }
  }

  render() {
    return (
        <Router>
          <div>
            <div className="screen-content">
              <Navigation />
                <div className="container app-container">
                  {
                    process.env.REACT_APP_ERROR ?
                    <div>
                      <div id="global-error" className="notification is-danger">{process.env.REACT_APP_ERROR}</div>
                      <Redirect to="/" />
                    </div>
                    :
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
                      <Route exact path="/search-form" component={SearchForm} />
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
                  }
                </div>
              </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

export default App;