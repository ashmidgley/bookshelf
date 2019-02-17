import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './add-new-form.css';

class AddNewForm extends Component {

    submit = () => {
        alert("Nice try dweeb");
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column"> 
                <div className="card review-card">
                    <div className="card-content">
                        <form className="form">
                            <div className="field">
                                <label className="label">Title</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Author</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Image</label>
                                <div className="file has-name is-centered">
                                    <label className="file-label">
                                        <input className="file-input" type="file" name="resume" />
                                        <span className="file-cta">
                                        <span className="file-icon">
                                            <i className="fas fa-upload"></i>
                                        </span>
                                        <span className="file-label">
                                            Choose a file…
                                        </span>
                                        </span>
                                        <span className="file-name">
                                        Screen Shot 2017-07-29 at 15.54.25.png
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="add-new-image">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Cover upload" />
                            </div>
                            <div className="field">
                                <label className="label">Started On</label>
                                <div className="control">
                                    <input className="input" type="date" placeholder="Text input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Finished On</label>
                                <div className="control">
                                    <input className="input" type="date" placeholder="Text input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Page Count</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Category</label>
                                <div className="control">
                                    <div className="select">
                                        <select>
                                            <option></option>
                                            {this.props.categories.map(category =>
                                                <option key={this.props.categories.indexOf(category)}>{category}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Content</label>
                                <div className="control">
                                    <textarea className="textarea" placeholder="Textarea"></textarea>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link" onClick={this.submit}>Submit</button>
                                </div>
                                <div className="control">
                                    <Link to="/">
                                        <button className="button is-text">Cancel</button>
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

export default AddNewForm;