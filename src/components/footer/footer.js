import React from 'react';
import './footer.css';

class Footer extends React.Component {

    render() {
        return (
            <footer className="footer">
                <div className="has-text-centered">
                    <p>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></p>
                    <p>Book data pulled from <a href="https://developers.google.com/books/">Google Books API.</a></p> 
                    <a id="footer-icon" href="https://github.com/ashmidgley/bookshelf">
                        <i className="fa fa-github-square"></i>
                    </a>
                </div>
            </footer>   
        )
    }
}

export default Footer;