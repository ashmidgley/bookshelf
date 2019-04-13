import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import { Link } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchBooks } from './actions/bookActions';
import { fetchCategories } from './actions/categoryActions';
import Admin from './components/admin/admin';
import BookForm from './components/book-form/book-form';
import CategoryForm from './components/category-form/category-form';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPropsLoaded: false,
      loading: true
    };
  }

  componentDidMount() {
    this.props.fetchBooks();
    this.props.fetchCategories();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.books) {
      this.setState({
        initialPropsLoaded: true
      })
    }
    if(nextProps.books && this.state.initialPropsLoaded) {
      this.setState({
        loading: false
      })
    }
  }

  render() {
    return (
        <Router>
          <div className="App">
            <div className="screen-content">
              <Link to={'/'}>
                <div className="header-content"></div>
              </Link>
              {this.state.loading ?
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
              :
                <div>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/admin" component={Admin} />
                  <Route exact path="/admin/book-form" component={BookForm} />
                  <Route exact path="/admin/book-form/:id" component={BookForm} />
                  <Route exact path="/admin/category-form" component={CategoryForm} />
                  <Route exact path="/admin/category-form/:id" component={CategoryForm} />
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
  books: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  books: state.books.items,
  categories: state.categories.items
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories})(App);