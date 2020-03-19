import React from 'react';
import './home.css';

class Home extends React.Component {
    
    render() {
        return (
            <div>
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-6 is-offset-3">
                                <img id="bookshelf-icon" src="/bookshelf.png" alt="Bookshelf"/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;