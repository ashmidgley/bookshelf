import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import * as punycode from 'punycode';
import './home.css'
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

class Home extends Component {
    
    plusCode ='0x2795';
    barCode = '0x1F4C8';
    totalReviews = 52;
    imageBase64Prefix = 'data:image/jpg;base64,';

    constructor(props){
        super(props);
        this.state = {
            columnClass: 'column child',
            books: this.props.books,
            menuSelected: [true, false, false]
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

    displayAll = () => {
        this.setState({
            books: this.props.books,
            menuSelected: [true, false, false]
        });
     }

     filterBooks(key) {
        var temp = new Array(this.state.menuSelected.length).fill(false);
        temp[key + 1] = true;
        var result = this.props.books.filter(r => r.categoryId === key);
        this.setState({
            books: result,
            menuSelected: temp
        });
     }

    render() {
        return (
            <div id="parent">
                <Helmet>
                    <title>Bookshelf 163 | Reads from Jan 19 onwards</title>
                </Helmet>
                <div className="home-menu-items">
                    <div className="is-pulled-left">
                        <Link to={'/admin'}>
                            <button className="button">
                                <span role="img" aria-label="Plus emoji">{punycode.ucs2.encode([this.plusCode])}</span>
                            </button>
                        </Link>
                    </div>
                    <button 
                        className={this.state.menuSelected[0] ? "button selected" : "button"} 
                        onClick={this.displayAll} 
                        style={{'padding':'0 23px'}}>
                    </button>
                    {this.props.categories.map(category =>
                        <button 
                            className={this.state.menuSelected[category.id + 1] ? "button selected" : "button"}
                            key={category.id}
                            onClick={() => this.filterBooks(category.id)}>
                            <span role="img" aria-label="Category emoji">{punycode.ucs2.encode([category.code])}</span>
                        </button>
                    )}
                    <div className="is-pulled-right">
                        <a href="#progress-container">
                            <button className="button">
                                <span role="img" aria-label="Progress emoji">{punycode.ucs2.encode([this.barCode])}</span>
                            </button>
                        </a>
                    </div>
                </div>
                <div className="columns is-multiline">
                    {this.state.books.map(book =>
                        <div key={book.id} className={this.state.columnClass}>
                            <Link to={`/review/${book.id}`} style={(book.summary) ? {} : { pointerEvents: 'none', cursor: 'default'}}>
                                <div className="card home-tile">
                                    <div className="card-image">
                                        <figure className="image">
                                            <img src={this.imageBase64Prefix + book.image} alt="Home tile" />
                                        </figure>
                                    </div>
                                    <div className="card-content home-card-content">
                                        <p className="title is-6 handle-wrap">{book.title}</p>
                                        <p className="subtitle is-6 handle-wrap">{book.author}</p>
                                        <div className="content home-content">
                                            {book.summary ? <p id="tile-content">{book.summary.replace(/<[^>]+>/g, '').substr(0, 50)}...</p> : <p></p>}
                                            <div className="tags has-addons level-item">
                                                <span className="tag is-rounded">{moment(book.finishedOn).format('Do MMMM ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
                <div id="progress-container">
                    <progress className="progress is-success" value={this.props.books.length} max={this.totalReviews}></progress>
                    <p><FontAwesomeIcon icon={faCalculator}/> {this.props.books.length} of {this.totalReviews} complete</p>
                </div>
            </div>
        )
    }
}

  Home.propTypes = {
    books: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired
  };
  
  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items
  });

export default connect(mapStateToProps)(Home);