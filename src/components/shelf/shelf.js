import React from 'react';
import './shelf.css'
import Loading from '../loading/loading';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { fetchBooks } from '../../actions/book-actions';
import { fetchCategories } from '../../actions/category-actions';
import { fetchRatings } from '../../actions/rating-actions';
import { parseUser } from '../../helpers/auth-helper';

class Shelf extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userId: parseInt(props.match.params.id),
            storageId: null,
            columnClass: 'column is-one-third child',
            books: null,
            categories: null,
            ratings: null,
            years: null,
            categoryMenu: null,
            ratingMenu: null,
            searchQuery: null,
            selectedCategory: null,
            selectedRating: null,
            loading: true,
            error: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.checkDimensions();
        window.addEventListener("resize", this.checkDimensions);

        var token = localStorage.getItem("token");
        if(token) {
            var user = parseUser(token);
            this.setState({
                storageId: user.id
            });
        }
        
        this.getShelfData();
    }

    getShelfData() {
        fetchBooks(this.state.userId)
            .then(response => {
                var books = response;
                fetchCategories(this.state.userId)
                    .then(response => {
                        var categories = response;
                        fetchRatings(this.state.userId)
                            .then(response => {
                                var ratings = response;
                                this.handleSuccess(books, categories, ratings);
                            })
                    })
            })
            .catch(() => {
                this.handleError();
            })
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

    handleSuccess = (books, categories, ratings) => {
        this.setState({
            books: books,
            categories: categories,
            ratings: ratings,
            years: this.getYears(books),
            categoryMenu: this.getMenu(categories.length + 1),
            ratingMenu: this.getMenu(ratings.length + 1),
            loading: false
        });
    }
    
    handleError = () => {
        this.setState({
            error: true,
            loading: false
        });
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

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkDimensions);
    }

    componentDidUpdate() {
        var id = parseInt(this.props.match.params.id);
        if(id !== this.state.userId) {
            window.location.reload(false);
        }
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
        menu[this.state.categories.indexOf(category)+1] = true;
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
        menu[this.state.ratings.indexOf(rating)+1] = true;
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

        var books = this.state.books;
        if(this.state.searchQuery) books = books.filter(b => b.title.toLowerCase().includes(this.state.searchQuery) || b.author.toLowerCase().includes(this.state.searchQuery));
        if(this.state.selectedCategory) books =  books.filter(b => b.categoryId === this.state.selectedCategory);
        if(this.state.selectedRating) books = books.filter(b => b.ratingId === this.state.selectedRating);

        return (
            <div className="shelf-container">
                <Helmet>
                    <title>Bookshelf - A free platform to keep track of your reads</title>
                </Helmet>
                <div className="shelf-menu-items columns card hide-mobile">
                    <div className="columns">
                        <div className="column is-three-fifths">
                            <input 
                                className="input" type="text" placeholder="Search by title or author..."
                                onChange={this.searchSubmit}
                                disabled={this.state.error} 
                            />
                        </div>
                        <div className="column is-one-fifth hide-mobile">
                            <button 
                                className={this.state.categoryMenu && this.state.categoryMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllCategories} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {
                                this.state.categories &&
                                this.state.categories.map(category =>
                                <button 
                                    className={this.state.categoryMenu[this.state.categories.indexOf(category)+1] ? "button selected" : "button"}
                                    key={category.id}
                                    onClick={() => this.categorySelected(category)}>
                                    <span role="img" aria-label="Category emoji">{category.code}</span>
                                </button>
                            )}
                        </div>
                        <div className="column is-one-fifth hide-mobile">
                            <button 
                                className={this.state.ratingMenu && this.state.ratingMenu[0] ? "button selected" : "button"} 
                                onClick={this.displayAllRatings} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {
                                this.state.ratings &&
                                this.state.ratings.map(rating =>
                                <button 
                                    className={this.state.ratingMenu[this.state.ratings.indexOf(rating)+1] ? "button selected" : "button"}
                                    key={rating.id}
                                    onClick={() => this.ratingSelected(rating)}>
                                    <span role="img" aria-label="Rating emoji">{rating.code}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {
                    this.state.error ?
                    <div className="notification is-danger">
                        Error pulling user data. Please refresh and try again.
                    </div>
                    :
                    <div>
                        {
                            this.state.books.length === 0 &&
                            <div className="notification is-link shelf-notification">
                                No books to display.&nbsp;
                                {
                                    this.state.storageId === this.state.userId &&
                                    <Link to="/search-form">Add one?</Link>
                                }
                            </div>
                        }
                        <div>
                            {this.state.years.map(year =>
                                <div key={year.value} className={this.state.years.indexOf(year) > 0 ? "child-toggle" : ""}>
                                    {
                                        books.some(x => x.year === year.value) &&
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
                                    }
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
                }
            </div>
        )
    }
}

export default Shelf;