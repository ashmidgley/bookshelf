import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        <a href="https://github.com/ash-midgley/bookshelf-ui">
                            <img src="/images/github.png" alt='GitHub icon'/>
                        </a> 
                    </p>
                </div>
            </footer>   
        )
    }
}

export default Footer;