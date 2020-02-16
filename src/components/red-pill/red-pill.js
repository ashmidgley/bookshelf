import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './red-pill.css';

class RedPill extends Component {

    constructor(props) {
        super(props);
        setTimeout(function () {
            props.history.push('/login');
        }, 1000);
    }

    render() {
        return (
            <div className="columns is-centered">
                <img src="/matrix-text.png" className="matrix-text" />     
            </div>
        );
    }
}

export default withRouter(RedPill);