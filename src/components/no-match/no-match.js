import React, { Component } from 'react';
import './no-match.css';
import { Link } from 'react-router-dom';

class NoMatch extends Component {

    render() {
        return (
            <div className="not-found-container">
                <img src="/not-found.png" alt="404 Not Found error"/>
                <p>Page not found. Return <Link to="/">home</Link>?</p>
            </div> 
        )
    }
}

export default NoMatch;