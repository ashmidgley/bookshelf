import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import AddNewForm from './components/add-new-form/add-new-form';
import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import axios from 'axios';
import './App.css';

class App extends Component {
  apiEndpoint = "http://128.199.129.60:5000/api/";
  plusCode ='0x2795';
  barCode = '0x1F4C8';
  totalReviews = 52;

  constructor(props){
    super(props);
    this.state = {
      books: [],
      categories: []
    }
  }

  componentDidMount() {
    this.getBooks();
    this.getCategories();
  }

  getBooks() {
    axios.get(this.apiEndpoint + 'books')
    .then(response => {
      const books = response.data.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
      this.setState({books});
    })
    .catch(error => {
      console.log(error);
    })
  }

  getCategories() {
    axios.get(this.apiEndpoint + 'categories')
    .then(response => {
      this.setState({categories: response.data});
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    var loading = true;
    if (this.state.books !== undefined && this.state.books.length > 0) {
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
                      <Home reviews={this.state.books} totalReviews={this.totalReviews} categories={this.state.categories} plusCode={this.plusCode} barCode={this.barCode} />
                    )} />
                    {/* <Route path="/review/:reviewId" render={({match}) => (
                      <Review review={this.state.books.find(r => r.id === match.params.reviewId)} />
                    )} /> */}
                    <Route path="/add-new" render={() => (
                      <AddNewForm categories={this.state.categories} apiEndpoint={this.apiEndpoint} />
                    )} />
                  </div>}
              </div>
            <Footer />
          </div>
        </Router>
      )
  }
}

export default App;