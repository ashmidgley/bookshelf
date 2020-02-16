import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p className="text">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></p>
                    <p className="text">Book data pulled from <a href="https://developers.google.com/books/">Google Books API.</a></p> 
                    <a className="footer-icon" href="https://github.com/ash-midgley/my-bookshelf">
                        <i className="fa fa-github-square"></i>
                    </a>
                </div>
            </footer>   
        )
    }
}

export default Footer;