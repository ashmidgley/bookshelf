import React, { Component } from "react";
import './home.css';

class Home extends Component {
    
    render() {
        return (
            <div>
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-6 is-offset-3">
                                <h1 className="title">Title</h1>
                                <h2 className="subtitle">Blah blah blah blah blah...</h2>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;