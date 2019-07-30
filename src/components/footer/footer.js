import React, { Component } from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        <a href="https://github.com/ash-midgley/bookshelf-ui">
                            <FontAwesomeIcon icon={faCode} className="footer-icon" size="lg"/>
                        </a> 
                    </p>
                </div>
            </footer>   
        )
    }
}

export default Footer;