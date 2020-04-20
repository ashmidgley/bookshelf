import React from 'react';
import './home.css';

class Home extends React.Component {
    
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div id="icon-container" className="column is-6 is-offset-3">
                                <img id="bookshelf-icon" src="/logo.png" alt="Bookshelf"/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;