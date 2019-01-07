import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Review from './components/review/review';
import Foot from './components/foot/foot';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './App.css';

class App extends Component {
  
  reviews = [
    {
      id: "0",
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 1",
      content: `Lorem ipsum dolor sit amet, 

      Double space
      
      consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      createdOn: "30-12-2018"
    },
    {
      id: "1",
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 2",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Posuere urna nec tincidunt praesent semper feugiat nibh sed. Eget aliquet nibh praesent tristique magna sit amet. Id consectetur purus ut faucibus pulvinar elementum integer. Quisque non tellus orci ac auctor augue mauris augue neque. Convallis a cras semper auctor. At risus viverra adipiscing at in tellus. Id ornare arcu odio ut. In massa tempor nec feugiat nisl pretium fusce id. At erat pellentesque adipiscing commodo elit at imperdiet dui. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Ipsum consequat nisl vel pretium lectus quam id.",
      createdOn: "30-12-2018"
    },
    {
      id: "2",
      image: "http://bulma.io/images/placeholders/1280x960.png",
      title: "Title 3",
      content: "Ornare suspendisse sed nisi lacus sed viverra tellus in. Nunc sed blandit libero volutpat. Nunc sed id semper risus in hendrerit gravida rutrum. Molestie at elementum eu facilisis sed odio morbi quis commodo. Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Dictumst quisque sagittis purus sit. Odio tempor orci dapibus ultrices in. At volutpat diam ut venenatis tellus in metus. Viverra adipiscing at in tellus integer feugiat scelerisque varius. Id faucibus nisl tincidunt eget nullam non nisi. Purus in massa tempor nec feugiat nisl. Euismod quis viverra nibh cras pulvinar mattis nunc sed. Pharetra magna ac placerat vestibulum. Ac odio tempor orci dapibus ultrices in. Elit sed vulputate mi sit. Faucibus pulvinar elementum integer enim neque volutpat ac. Ornare aenean euismod elementum nisi quis eleifend quam.",
      createdOn: "30-12-2018"
    }
  ];

  componentDidMount(){
    //grab reviews from API
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />

          <Route exact={true} path="/" render={() => (
            <Home reviews={this.reviews} />
          )} />

          <Route path="/review/:reviewId" render={({ match }) => (
            <Review review={ this.reviews.find(r => r.id === match.params.reviewId )} />
          )} />

          <Foot />
        </div>
      </Router>
    );
  }
}

export default App;