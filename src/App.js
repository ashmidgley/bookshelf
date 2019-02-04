import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import reviewsData from './reviewData.json';
import * as moment from 'moment';
import './App.css';
import AddNew from './components/add-new-form/add-new-form';

class App extends Component {

  reviews = [];

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.reviews = reviewsData.reviews.sort((a, b) => moment(b.finishedOn).valueOf() - moment(a.finishedOn).valueOf());
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({loading: false});
    }, 2000);
  }

  render() {
    if(this.state.loading) {
      return (
        <Router>
          <div className="App">
            <Header />
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
            <Footer />
          </div>
        </Router>
      )
    } else {
      return (
        <Router>
          <div className="App">
            <div className="screen-content">
              <Header />

              <Route exact={true} path="/" render={() => (
                <Home reviews={this.reviews} totalReviews={50} />
              )} />
              <Route path="/review/:reviewId" render={({match}) => (
                <Review review={ this.reviews.find(r => r.id === match.params.reviewId )} />
              )} />
              <Route path="/add-new" render={() => (
                <AddNew />
              )} />

          </div>
            <Footer />
          </div>
        </Router>
      )
    }
  }
}

export default App;