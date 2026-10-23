import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Landing from "./home/landing/landing";
import Shelf from "./shelf/shelf/shelf";
import Review from "./shelf/review/review";
import ManageBooks from "./books/manage-books/manage-books";
import ManageCategories from "./categories/manage-categories/manage-categories";
import ManageRatings from "./ratings/manage-ratings/manage-ratings";
import ManageUsers from "./users/manage-users/manage-users";
import UpdateUser from "./users/update-user/update-user";
import SearchForm from "./books/search-form/search-form";
import AddBook from "./books/add-book/add-book";
import UpdateBook from "./books/update-book/update-book";
import Login from "./auth/login/login";
import Register from "./auth/register/register";
import NoMatch from "./shared/no-match/no-match";
import MyAccount from "./users/my-account/my-account";
import ForgotPassword from "./auth/forgot-password/forgot-password";
import ResetPassword from "./users/reset-password/reset-password";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Landing} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/forgot-password" component={ForgotPassword} />
    <Route
      exact
      path="/reset-password/:userId/:resetToken"
      component={ResetPassword}
    />
    <Route exact path="/register" component={Register} />
    <Route exact path="/shelf/:id" component={Shelf} />
    <Route exact path="/review/:id" component={Review} />
    <Route exact path="/manage-books" component={ManageBooks} />
    <Route exact path="/manage-categories" component={ManageCategories} />
    <Route exact path="/manage-ratings" component={ManageRatings} />
    <Route exact path="/my-account" component={MyAccount} />
    {/* Email, password and account deletion now live on My Account. */}
    <Redirect exact from="/update-password" to="/my-account" />
    <Redirect exact from="/update-email" to="/my-account" />
    <Redirect exact from="/delete-account" to="/my-account" />
    <Route exact path="/search-form" component={SearchForm} />
    <Route exact path="/book-form" component={AddBook} />
    <Route exact path="/book-form/:id" component={UpdateBook} />
    {/* Categories and ratings are now edited in place on their manage pages. */}
    <Redirect exact from="/category-form/:id?" to="/manage-categories" />
    <Redirect exact from="/rating-form/:id?" to="/manage-ratings" />
    <Route exact path="/admin/manage-users" component={ManageUsers} />
    <Route exact path="/admin/manage-users/:id" component={UpdateUser} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
