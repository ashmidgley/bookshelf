import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import { NavLink } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchBooks } from './actions/bookActions';
import { fetchCategories } from './actions/categoryActions';
import { fetchRatings } from './actions/ratingActions';
import Admin from './components/admin/admin';
import BookForm from './components/book-form/book-form';
import CategoryForm from './components/category-form/category-form';
import RatingForm from './components/rating-form/rating-form';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPropsLoaded: false,
      loading: true,
      dropdownOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchBooks();
    this.props.fetchCategories();
    this.props.fetchRatings();
  }

  componentWillReceiveProps(nextProps) {
    if(Array.isArray(nextProps.books) && nextProps.books.length) {
      this.setState({
        loading: false
      })
    }
  }

  dropdownSelected = () => {
    var result = !this.state.dropdownOpen;
    this.setState({
      dropdownOpen: result
    });
  }

  render() {
    return (
        <Router>
          <div className="App">
            <div className="screen-content">
              <div class="hero-head nav-container">
                <nav class="navbar">
                  <div class="container">
                    <div class="navbar-brand">
                      <a class="navbar-item" href="/">
                        <img src='/images/fa_book.png'></img>
                      </a>
                      <span className={this.state.dropdownOpen ? "navbar-burger burger is-active" : "navbar-burger burger"} 
                        onClick={this.dropdownSelected}
                        data-target="navbarMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    </div>
                    <div id="navbarMenu" className={this.state.dropdownOpen ? "navbar-menu is-active" : "navbar-menu"} >
                      <div className="navbar-end">
                        <div class="tabs is-right">
                          <ul>
                              <NavLink exact activeClassName="active-nav" to="/">Home</NavLink>
                              <NavLink activeClassName="active-nav" to="/admin">Admin</NavLink>
                          </ul>
                        </div>
                      </div>  
                    </div>
                  </div>
                </nav>
              </div>
              {this.state.loading ?
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
              :
                <div className="container">
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
              }
            </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

App.propTypes = {
  fetchBooks: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchRatings: PropTypes.func.isRequired,
  books: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  ratings: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  books: state.books.items,
  categories: state.categories.items,
  ratings: state.ratings.items
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(App);