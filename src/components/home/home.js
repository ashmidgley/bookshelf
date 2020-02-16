import React, { Component } from "react";
import './home.css';
import { Link } from 'react-router-dom';

class Home extends Component {
    
    render() {
        return (
            <div>
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-6 is-offset-3">
                            <img src="/morpheus.png" className="morpheus"/>
                                <a href="https://google.com"><img src="/blue-pill.png" className="blue-pill"/></a>
                                <Link to="/red-pill"><img src="/red-pill.png" className="red-pill" /></Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;