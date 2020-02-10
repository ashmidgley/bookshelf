import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p className="text">Book data pulled from <a href="https://developers.google.com/books/">Google Books API.</a></p>  
                    <p className="text">Issues or pull requests welcome.</p>
                    <a className="footer-icon" href="https://github.com/ash-midgley/my-bookshelf">
                        <i className="fa fa-github-square"></i>
                    </a>
                </div>
            </footer>   
        )
    }
}

export default Footer;