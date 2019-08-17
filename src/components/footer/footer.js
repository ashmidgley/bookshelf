import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <a className="footer-icon" href="https://github.com/ash-midgley/my-bookshelf">
                        <i className="fa fa-github-square"></i>
                    </a>
                </div>
            </footer>   
        )
    }
}

export default Footer;