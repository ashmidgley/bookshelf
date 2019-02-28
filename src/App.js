import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import reviewsData from './reviewData.json';
import AddNewForm from './components/add-new-form/add-new-form';
import Particles from 'react-particles-js';
import Category from './models/category';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import './App.css';

class App extends Component {
  reviews;
  categories;
  totalReviews;

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.reviews = reviewsData.reviews.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
    this.categories = [new Category(0, 'Fiction', '0x1F9DD'), new Category(1, 'Non-fiction', '0x1F9E0')];
    this.plusCode = '0x2795';
    this.barCode = '0x1F4C8';
    this.totalReviews = 52;
  }

  render() { return (
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
                <Route exact={true} path="/" render={() => (
                  <Home reviews={this.reviews} totalReviews={this.totalReviews} categories={this.categories} plusCode={this.plusCode} barCode={this.barCode} />
                )} />
                <Route path="/review/:reviewId" render={({match}) => (
                  <Review review={this.reviews.find(r => r.id === match.params.reviewId)} />
                )} />
                <Route path="/add-new" render={() => (
                  <AddNewForm categories={this.categories} />
                )} />
              </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

export default App;