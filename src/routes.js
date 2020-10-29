import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home/home/home";
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
import CategoryForm from "./categories/category-form/category-form";
import RatingForm from "./ratings/rating-form/rating-form";
import Login from "./auth/login/login";
import Register from "./auth/register/register";
import NoMatch from "./shared/no-match/no-match";
import MyAccount from "./users/my-account/my-account";
import UpdateEmail from "./users/update-email/update-email";
import UpdatePassword from "./users/update-password/update-password";
import DeleteAccount from "./users/delete-account/delete-account";
import ForgotPassword from "./auth/forgot-password/forgot-password";
import ResetPassword from "./users/reset-password/reset-password";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
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
  );
}

export default Routes;
