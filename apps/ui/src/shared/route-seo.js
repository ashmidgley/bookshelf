import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { matchPath, withRouter } from "react-router-dom";

const siteName = "Bookshelf";
const siteUrl = "https://boookshelf.xyz";
const socialImageUrl = `${siteUrl}/images/bookshelf.png`;
const defaultDescription =
  "Manage your reading list, reviews, ratings, and categories with your personal online bookshelf.";

const routeMetadata = [
  {
    path: "/",
    exact: true,
    title: "Bookshelf - An online shelf to keep track of your reads",
    description:
      "Track the books you read, rate your favourites, organise them into categories, and keep your reading history in one place.",
    shouldIndex: true,
  },
  {
    path: "/login",
    exact: true,
    title: "Login - Bookshelf",
    description:
      "Log in to Bookshelf to manage your shelf, reviews, ratings, and account settings.",
    shouldIndex: false,
  },
  {
    path: "/forgot-password",
    exact: true,
    title: "Forgot Password - Bookshelf",
    description:
      "Reset your Bookshelf password and get back to your reading list.",
    shouldIndex: false,
  },
  {
    path: "/reset-password/:userId/:resetToken",
    exact: true,
    title: "Reset Password - Bookshelf",
    description:
      "Create a new password and get back into your Bookshelf account.",
    shouldIndex: false,
  },
  {
    path: "/register",
    exact: true,
    title: "Register - Bookshelf",
    description:
      "Create a Bookshelf account to keep track of books, ratings, reviews, and categories.",
    shouldIndex: false,
  },
  {
    path: "/shelf/:id",
    exact: true,
    title: "Your Shelf - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/review/:id",
    exact: true,
    title: "Review - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/manage-books",
    exact: true,
    title: "Manage Books - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/manage-categories",
    exact: true,
    title: "Manage Categories - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/manage-ratings",
    exact: true,
    title: "Manage Ratings - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/my-account",
    exact: true,
    title: "My Account - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/update-password",
    exact: true,
    title: "Update Password - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/update-email",
    exact: true,
    title: "Update Email - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/delete-account",
    exact: true,
    title: "Delete Account - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/search-form",
    exact: true,
    title: "Search Books - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/book-form",
    exact: true,
    title: "Add Book - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/book-form/:id",
    exact: true,
    title: "Update Book - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/category-form",
    exact: true,
    title: "Add Category - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/category-form/:id",
    exact: true,
    title: "Update Category - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/rating-form",
    exact: true,
    title: "Add Rating - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/rating-form/:id",
    exact: true,
    title: "Update Rating - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/admin/manage-users",
    exact: true,
    title: "Manage Users - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
  {
    path: "/admin/manage-users/:id",
    exact: true,
    title: "Update User - Bookshelf",
    description: defaultDescription,
    shouldIndex: false,
  },
];

const getRouteMetadata = (pathname) => {
  const match = routeMetadata.find((route) =>
    matchPath(pathname, {
      path: route.path,
      exact: route.exact,
    })
  );

  return (
    match || {
      title: "Page Not Found - Bookshelf",
      description: "The page you were looking for could not be found.",
      shouldIndex: false,
    }
  );
};

const RouteSeoBase = ({ location }) => {
  const metadata = getRouteMetadata(location.pathname);
  const pageUrl = `${siteUrl}${location.pathname}`;
  const robotsContent = metadata.shouldIndex ? "index, follow" : "noindex, nofollow";

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={robotsContent} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={socialImageUrl} />
      {metadata.shouldIndex && <link rel="canonical" href={pageUrl} />}
    </Helmet>
  );
};

RouteSeoBase.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(RouteSeoBase);
