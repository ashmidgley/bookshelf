import React from 'react';
import './home.css';

class Home extends React.Component {
    
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div id="home-container">
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-6 is-offset-3">
                                <img id="bookshelf-icon" src="/images/logo.png" alt="Bookshelf"/>
                            </div>
                        </div>
                    </div>
                </section>
                <img id="fight-club" src="/images/fight-club.png" alt="Fight Club cover" />
                <img id="the-martian" src="/images/the-martian.png" alt="The Martian cover" />
                <img id="neither-here-nor-there" src="/images/neither-here-nor-there.png" alt="Neither Here Nor There cover" />
                <img id="elon-musk" src="/images/elon-musk.png" alt="Elon Musk cover" />
                <img id="leonardo-da-vinci" src="/images/leonardo-da-vinci.png" alt="Leonardo Da Vinci cover" />
            </div>
        );
    }
}

export default Home;