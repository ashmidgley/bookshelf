import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import reviewsData from './reviewData.json';
import AddNewForm from './components/add-new-form/add-new-form';
import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import './App.css';

class App extends Component {

  reviews = [];
  categories = ['🧙', '🧠'];
  categoryNames = ['Fiction', 'Non-fiction'];
  totalReviews = 52;

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.reviews = reviewsData.reviews.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
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
                                    "distance": 250,
                                    "duration": 2,
                                    "size": 0,
                                    "opacity": 0
                                },
                                "repulse": {
                                    "distance": 400,
                                    "duration": 4
                                }
                            }
                        }
                    }} />
                </div>
              </Link>
                <Route exact={true} path="/" render={() => (
                  <Home reviews={this.reviews} totalReviews={this.totalReviews} categories={this.categories} />
                )} />
                <Route path="/review/:reviewId" render={({match}) => (
                  <Review review={ this.reviews.find(r => r.id === match.params.reviewId )} />
                )} />
                <Route path="/add-new" render={() => (
                  <AddNewForm categories={this.categoryNames} />
                )} />
              </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

export default App;