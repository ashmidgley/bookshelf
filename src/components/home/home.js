import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css'
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

class Home extends Component {

    constructor(props){
        super(props);
        var categoryMenu = new Array(this.props.categories.length+1).fill(false);
        var ratingMenu = new Array(this.props.ratings.length+1).fill(false);
        categoryMenu[0] = true;
        ratingMenu[0] = true;
        this.state = {
            columnClass: 'column is-one-third child',
            books: this.props.books,
            categoryMenu: categoryMenu,
            ratingMenu: ratingMenu,
            searchQuery: null,
            selectedCategory: null,
            selectedRating: null,
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

    checkDimensions = () => {
        var newVal = 'column is-one-third child';
        if(window.innerWidth > 1000 && window.innerWidth < 1200) {
            newVal = 'column is-one-quarter child';
        } else if(window.innerWidth > 1200) {
            newVal = 'column is-one-fifth child';
        }
        this.setState({columnClass: newVal}); 
    }

    searchSubmit = (e) => {
        this.setState({
            searchQuery: e.target.value.toLowerCase()
        });
    }

    displayAllCategories = () => {
        var menu = this.state.categoryMenu.fill(false);
        menu[0] = true;
        this.setState({
            categoryMenu: menu,
            selectedCategory: null
        });
     }

     categorySelected(category) {
        var menu = this.state.categoryMenu.fill(false);
        menu[this.props.categories.indexOf(category)+1] = true;
        this.setState({
            selectedCategory: category.id,
            categoryMenu: menu
        });
     }

     displayAllRatings = () => {
        var menu = this.state.ratingMenu.fill(false);
        menu[0] = true;
        this.setState({
            ratingMenu: menu,
            selectedRating: null
        });
     }

     ratingSelected(rating) {
        var menu = this.state.ratingMenu.fill(false);
        menu[this.props.ratings.indexOf(rating)+1] = true;
        this.setState({
            selectedRating: rating.id,
            ratingMenu: menu
        });
    }

    render() {
        var books = this.props.books;
        if(this.state.searchQuery) books = books.filter(b => b.title.toLowerCase().includes(this.state.searchQuery) || b.author.toLowerCase().includes(this.state.searchQuery));
        if(this.state.selectedCategory) books =  books.filter(b => b.categoryId === this.state.selectedCategory);
        if(this.state.selectedRating) books = books.filter(b => b.ratingId === this.state.selectedRating);
        return (
            <div className="home-container">
                <Helmet>
                    <title>Bookshelf | Reads from Jan 2019 onwards</title>
                </Helmet>
                <div className="home-menu-items columns is-mobile card">
                    <div className="columns">
                        <div className="column is-three-fifths">
                            <input className="input" type="text" placeholder="Search by title or author..." onChange={this.searchSubmit} />
                        </div>
                        <div className="column is-one-fifth hide-mobile">
                            <button 
                                className={this.state.categoryMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllCategories} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {this.props.categories.map(category =>
                                <button 
                                    className={this.state.categoryMenu[this.props.categories.indexOf(category)+1] ? "button selected" : "button"}
                                    key={category.id}
                                    onClick={() => this.categorySelected(category)}>
                                    <span role="img" aria-label="Category emoji">{category.code}</span>
                                </button>
                            )}
                        </div>
                        <div className="column is-one-fifth hide-mobile">
                            <button 
                                className={this.state.ratingMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllRatings} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {this.props.ratings.map(rating =>
                                <button 
                                    className={this.state.ratingMenu[this.props.ratings.indexOf(rating)+1] ? "button selected" : "button"}
                                    key={rating.id}
                                    onClick={() => this.ratingSelected(rating)}>
                                    <span role="img" aria-label="Rating emoji">{rating.code}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {this.props.books.length == 0 ?
                    <div className="notification is-link home-notification">
                        No books to display.
                    </div>
                    : null 
                }
                <div className="columns is-multiline is-mobile home-tiles">
                    {books.map(book =>
                        <div key={book.id} className={this.state.columnClass}>
                            <Link to={`/review/${book.id}`} style={(book.summary) ? {} : { pointerEvents: 'none', cursor: 'default'}}>
                                <div className="card home-tile">
                                    <figure className="image">
                                        <img src={process.env.REACT_APP_STORAGE_URL + '/' + book.image} alt="Home tile" />
                                    </figure>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

  Home.propTypes = {
    books: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ratings: PropTypes.array.isRequired
  };
  
  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items
  });

export default connect(mapStateToProps)(Home);