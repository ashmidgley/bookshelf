import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import './home.css'

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            columnClass: 'column child',
            reviews: this.props.reviews
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.checkDimensions();
        window.addEventListener("resize", this.checkDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkDimensions);
    }

    /* = () => binds 'this' automatically to checkDimensions */
    checkDimensions = () => {
        var newVal = 'column child';
        if(window.innerWidth > 769 && window.innerWidth < 1000) {
            newVal = 'column is-one-third child';
        } else if(window.innerWidth > 1000 && window.innerWidth < 1200) {
            newVal = 'column is-one-quarter child';
        } else if(window.innerWidth > 1200) {
            newVal = 'column is-one-fifth child';
        }
        this.setState({columnClass: newVal}); 
    }

    displayAll() {
        this.setState({reviews: this.props.reviews});
     }

     filterReviews(key){
         var result = this.props.reviews.filter(r => r.category === key);
         this.setState({reviews: result});
     }

    render(){
        return (
            <div id="parent">
                <div className="home-menu-items">
                    <div className="is-pulled-left">
                        <Link to={'/add-new'}><button className="button"><span role="img">➕</span></button></Link>
                    </div>
                    <button className="button" onClick={() => this.displayAll()} style={{'padding':'0 23px'}}></button>
                    {this.props.categories.map(category =>
                        <button className="button" onClick={() => this.filterReviews(this.props.categories.indexOf(category))}>
                            <span role="img">{category}</span>
                        </button>
                    )}
                    <div className="is-pulled-right">
                        <a href="#progress-container"><button className="button"><span role="img">📊</span></button></a>
                    </div>
                </div>
                <div className="columns is-multiline">
                    {this.state.reviews.map(review =>
                        <div className={this.state.columnClass} key={review.id}>
                            <Link to={`/review/${review.id}`} style={(review.content) ? {} : { pointerEvents: 'none', cursor: 'default'}}>
                                <div className="card home-tile">
                                    <div className="card-image">
                                        <figure className="image">
                                            <img src={'/images/' + review.image} alt="Home tile" />
                                        </figure>
                                    </div>
                                    <div className="card-content home-card-content">
                                        <p className="title is-6 handle-wrap">{review.title}</p>
                                        <p className="subtitle is-6 handle-wrap">{review.author}</p>
                                        <div className="content home-content">
                                            <p id="tile-content">{review.content.replace(/<[^>]+>/g, '').substr(0, 50)}...</p>
                                            <div className="tags has-addons level-item">
                                                <span className="tag is-rounded">{moment(review.finishedOn).format('Do MMMM ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
                <div id="progress-container">
                    <progress className="progress is-success" value={this.props.reviews.length} max={this.props.totalReviews}></progress>
                    <p><FontAwesomeIcon icon={faCalculator}/> {this.props.reviews.length} of {this.props.totalReviews} complete</p>
                </div>
            </div>
        )
    }
}

export default Home;