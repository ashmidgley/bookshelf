import React from 'react';
import './my-account.css';
import Loading from '../loading/loading';
import { withRouter, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { parseUser } from '../../helpers/auth-helper';

class MyAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            shelfPath: null,
            copyText: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        var token = localStorage.getItem('token');
        var user = parseUser(token);
        this.setState({
            user: user,
            shelfPath: `${window.location.protocol}//${window.location.host}/shelf/${user.id}`,
            loading: false
        });
    }

    copyToClipboard = (e) => {
        e.preventDefault();
        this.shelfPath.select();
        document.execCommand('copy');
        e.target.focus();

        this.setState({ 
            copyText: 'Copied to clipboard!'
        });

        setTimeout(
            function() {
                this.setState({
                    copyText: null
                });
            }
            .bind(this), 2000
        );
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container"> 
                <Helmet>
                    <title>My Account - Bookshelf</title>
                </Helmet>
                <div className="card custom-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="image-header-container">
                                <FontAwesomeIcon icon={faMask} className="mask-icon" size="lg"/>
                            </div>
                        </div>
                        {
                            this.state.error && 
                            <div className="notification is-danger">{this.state.error}</div>
                        }
                        <form className="form">
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="columns is-mobile my-account-columns">
                                    <div className="column">
                                        <div className="control">
                                            <input className='input' type="text" readOnly 
                                                value={this.state.user ? this.state.user.email : ''} />
                                        </div>
                                    </div>
                                    <div className="column is-2">
                                        <Link to="/update-email" className="button">Edit</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="columns is-mobile my-account-columns">
                                    <div className="column">
                                        <div className="control">
                                            <input className='input' type="password" value="placeholder" readOnly />
                                        </div>
                                    </div>
                                    <div className="column is-2">
                                        <Link to="/update-password" className="button">Edit</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Share Shelf</label>
                                <div className="columns is-mobile my-account-columns" style={{'marginBottom': '0'}}>
                                    <div className="column">
                                        <div className="control">
                                            <input 
                                                ref={(input) => this.shelfPath = input} 
                                                className="input" type="text" name="id" readOnly
                                                value={this.state.shelfPath} 
                                            />
                                        </div>
                                    </div>
                                    {
                                        document.queryCommandSupported('copy') &&
                                        <div className="column is-2">
                                            <button className="button" onClick={this.copyToClipboard}>Copy</button>
                                        </div>
                                    }
                                </div>
                                <p className="is-size-7">{this.state.copyText}</p>  
                            </div>
                            <div className="field">
                                <label className="label">Delete My Account</label>
                                <div>
                                    <Link to="/delete-account" className="button">
                                        <span role="img" aria-label="Dynamite">🧨</span>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyAccount);