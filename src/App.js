import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import AddNewForm from './components/add-new-form/add-new-form';
import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchBooks } from './actions/bookActions';
import { fetchCategories } from './actions/categoryActions';

class App extends Component {
  plusCode ='0x2795';
  barCode = '0x1F4C8';
  totalReviews = 52;

  componentDidMount() {
    this.props.fetchBooks();
    this.props.fetchCategories();
  }

  render() {
    var loading = true;
    if (this.props.books !== undefined && this.props.books.length > 0) {
      loading = false;
    }
    return (
        <Router>
          <div className="App">
            <div className="screen-content">
              <Link to={'/'}>
                <div className="header-content">
                  <Particles
                        params={{
                        "particles": {
                            "number": {
                                "value": 160,
                                "density": {
                                    "enable": false
                                }
                            },
                            "size": {
                                "value": 3,
                                "random": true,
                                "anim": {
                                    "speed": 4,
                                    "size_min": 0.3
                                }
                            },
                            "line_linked": {
                                "enable": false
                            },
                            "move": {
                                "random": true,
                                "speed": 1,
                                "direction": "top",
                                "out_mode": "out"
                            }
                        },
                        "interactivity": {
                            "events": {
                                "onhover": {
                                    "enable": true,
                                    "mode": "bubble"
                                },
                                "onclick": {
                                    "enable": true,
                                    "mode": "repulse"
                                }
                            },
                            "modes": {
                                "bubble": {
                                    "distance": 100,
                                    "duration": 1,
                                    "size": 0,
                                    "opacity": 0
                                },
                                "repulse": {
                                    "distance": 200,
                                    "duration": 2
                                }
                            }
                        }
                    }} />
                </div>
              </Link>
              {loading ?
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
              :
                <div>
                  <Route exact={true} path="/" render={() => (
                    <Home reviews={this.props.books} categories={this.props.categories} totalReviews={this.totalReviews} plusCode={this.plusCode} barCode={this.barCode} />
                  )} />
                  <Route path="/review/:reviewId" render={({match}) => (
                    <Review review={this.props.books.find(r => r.id === match.params.reviewId)} />
                  )} />
                  <Route path="/add-new" render={() => (
                    <AddNewForm categories={this.props.categories} />
                  )} />
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