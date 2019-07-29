import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css'
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

class Home extends Component {

    constructor(props){
        super(props);
        var menu = new Array(this.props.categories.length+1).fill(false);
        menu[0] = true;
        this.state = {
            columnClass: 'column child',
            books: this.props.books,
            categorySelected: 0,
            menu: menu
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

    displayAll = () => {
        var menu = this.state.menu.fill(false);
        menu[0] = true;
        this.setState({
            books: this.props.books,
            menu: menu,
            categorySelected: 0
        });
     }

    filterBooks(category) {
        var menu = this.state.menu.fill(false);
        menu[this.props.categories.indexOf(category)+1] = true;
        const result = this.props.books.filter(r => r.categoryId === category.id);
        this.setState({
            books: result,
            menu: menu,
            categorySelected: category.id
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
            <div id="parent">
                <Helmet>
                    <title>Bookshelf | Reads from Jan 2019 onwards</title>
                </Helmet>
                <div className="home-menu-items columns is-mobile card">
                        <div className="columns">
                        <div className="column is-three-quarters">
                            <input className="input" type="text" placeholder="Search by title or author" onChange={this.searchSubmit} />
                        </div>
                        <div className="column">
                            <button 
                                className={this.state.menu[0] ? "button selected" : "button"} 
                                onClick={this.displayAll} 
                                style={{'padding':'0 23px'}}>
                            </button>
                            {this.props.categories.map(category =>
                                <button 
                                    className={this.state.menu[this.props.categories.indexOf(category)+1] ? "button selected" : "button"}
                                    key={category.id}
                                    onClick={() => this.filterBooks(category)}>
                                    <span role="img" aria-label="Category emoji">{category.code}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
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
    categories: PropTypes.array.isRequired
  };
  
  const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items
  });

export default connect(mapStateToProps)(Home);