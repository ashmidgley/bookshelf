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
            columnClass: 'column child',
            books: this.props.books,
            categorySelected: 0,
            ratingSelected: 0,
            categoryMenu: categoryMenu,
            ratingMenu: ratingMenu
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

    displayAllCategories = () => {
        var menu = this.state.categoryMenu.fill(false);
        var ratingId = this.state.ratingSelected;
        var books = this.state.ratingSelected == 0 ? this.props.books : this.props.books.filter(b => b.ratingId === ratingId);
        menu[0] = true;
        this.setState({
            books: books,
            categoryMenu: menu,
            categorySelected: 0
        });
     }

     displayAllRatings = () => {
        var menu = this.state.ratingMenu.fill(false);
        var categoryId = this.state.categorySelected;
        var books = this.state.categorySelected == 0 ? this.props.books : this.props.books.filter(b => b.categoryId === categoryId);
        menu[0] = true;
        this.setState({
            books: books,
            ratingMenu: menu,
            ratingSelected: 0
        });
     }

    filterBooksOnCategory(category) {
        var menu = this.state.categoryMenu.fill(false);
        menu[this.props.categories.indexOf(category)+1] = true;
        const result = this.state.ratingSelected == 0 ? this.props.books.filter(r => r.categoryId === category.id) : 
            this.props.books.filter(r => r.categoryId === category.id && r.ratingId === this.state.ratingSelected);
        this.setState({
            books: result,
            categoryMenu: menu,
            categorySelected: category.id
        });
    }

    filterBooksOnRating(rating) {
        var menu = this.state.ratingMenu.fill(false);
        menu[this.props.ratings.indexOf(rating)+1] = true;
        const result = this.state.categorySelected == 0 ? this.props.books.filter(r => r.ratingId === rating.id)
            : this.props.books.filter(r => r.ratingId === rating.id && r.categoryId === this.state.categorySelected);
        this.setState({
            books: result,
            ratingMenu: menu,
            ratingSelected: rating.id
        });
    }

    searchSubmit = (e) => {
        const query = e.target.value.toLowerCase();
        var books = this.props.books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
        if(this.state.categorySelected != 0) {
            books = books.filter(b => b.categoryId == this.state.categorySelected);
        }
        this.setState({
            books: books
        });
    }

    render() {
        return (
            <div className="home-container">
                <Helmet>
                    <title>Bookshelf | Reads from Jan 2019 onwards</title>
                </Helmet>
                <div className="home-menu-items columns is-mobile card">
                    <div className="columns">
                        <div className="column is-three-fifths">
                            <input className="input" type="text" placeholder="Search by title or author" onChange={this.searchSubmit} />
                        </div>
                        <div className="column is-one-fifth">
                            <button 
                                className={this.state.categoryMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllCategories} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {this.props.categories.map(category =>
                                <button 
                                    className={this.state.categoryMenu[this.props.categories.indexOf(category)+1] ? "button selected" : "button"}
                                    key={category.id}
                                    onClick={() => this.filterBooksOnCategory(category)}>
                                    <span role="img" aria-label="Category emoji">{category.code}</span>
                                </button>
                            )}
                        </div>
                        <div className="column is-one-fifth">
                            <button 
                                className={this.state.ratingMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllRatings} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {this.props.ratings.map(rating =>
                                <button 
                                    className={this.state.ratingMenu[this.props.ratings.indexOf(rating)+1] ? "button selected" : "button"}
                                    key={rating.id}
                                    onClick={() => this.filterBooksOnRating(rating)}>
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
                    {this.state.books.map(book =>
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