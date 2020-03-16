import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './shelf.css'
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { fetchBooks } from '../../actions/bookActions';
import { fetchCategories } from '../../actions/categoryActions';
import { fetchRatings } from '../../actions/ratingActions';
import Loading from '../loading/loading'; 

class Shelf extends Component {

    constructor(props){
        super(props);
        this.state = {
            userId: parseInt(this.props.match.params.id),
            columnClass: 'column is-one-third child',
            books: null,
            years: null,
            categoryMenu: null,
            ratingMenu: null,
            searchQuery: null,
            selectedCategory: null,
            selectedRating: null,
            loading: true
        }
    }

    getYears(books) {
        var distinctYears = [...new Set(books.map(item => item.year))];
        var years = [];
        distinctYears.forEach((year) => years.push({ value: year, show: true }));
        return years;
    }

    getMenu(length) {
        var menu = new Array(length).fill(false);
        menu[0] = true;
        return menu;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings))
            this.setState({
                books: nextProps.books,
                years: this.getYears(nextProps.books),
                categoryMenu: this.getMenu(nextProps.categories.length+1),
                ratingMenu: this.getMenu(nextProps.ratings.length+1),
                loading: false
            });
      }

    componentDidMount() {
        this.props.fetchBooks(this.state.userId);
        this.props.fetchCategories(this.state.userId);
        this.props.fetchRatings(this.state.userId);

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
            newVal = 'column is-2';
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

    toggleYear(value) {
        var years = this.state.years;
        var index = years.map(year => year.value).indexOf(value);
        years[index].show = !years[index].show;
        this.setState({ 
            years: years
        });
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        var books = this.props.books;
        if(this.state.searchQuery) books = books.filter(b => b.title.toLowerCase().includes(this.state.searchQuery) || b.author.toLowerCase().includes(this.state.searchQuery));
        if(this.state.selectedCategory) books =  books.filter(b => b.categoryId === this.state.selectedCategory);
        if(this.state.selectedRating) books = books.filter(b => b.ratingId === this.state.selectedRating);
        return (
            <div className="shelf-container">
                <Helmet>
                    <title>Bookshelf | A Free Platform to Keep Track of Your Reads</title>
                </Helmet>
                <div className="shelf-menu-items columns is-mobile card">
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
                {this.props.books.length === 0 ?
                    <div className="notification is-link shelf-notification">
                        No books to display.
                    </div>
                    : null 
                }
                <div>
                    {this.state.years.map(year =>
                        <div key={year.value}>
                            <div className="year-toggle-container">
                                <button className="button is-link" onClick={() => this.toggleYear(year.value)}>
                                    {year.value}
                                    {year.show ?
                                        <i className="fa fa-sort-down shelf-year-dropdown"></i>
                                        :
                                        <i className="fa fa-sort-up shelf-year-dropdown"></i>
                                    }
                                </button>
                            </div>
                            <div className="columns is-multiline is-mobile shelf-tiles">
                                {books.filter(book => book.year === year.value && year.show).map(book =>
                                    <div key={book.id} className={this.state.columnClass}>
                                        <div className="shelf-tile">
                                            <Link to={`/review/${book.id}`} className="tile-link">
                                                <img src={book.imageUrl} className="tile-image" alt="Shelf tile" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
  
const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings})(Shelf);