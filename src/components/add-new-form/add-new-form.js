import React, { Component } from 'react';
import './add-new-form.css';

class AddNewForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="column is-8 is-offset-2 review-column"> 
                <div className="card review-card">
                    <div className="card-content">
                        <form className="form">
                            <div class="field">
                                <label class="label">Title</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Author</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Image</label>
                                <div class="file has-name is-centered">
                                    <label class="file-label">
                                        <input class="file-input" type="file" name="resume" />
                                        <span class="file-cta">
                                        <span class="file-icon">
                                            <i class="fas fa-upload"></i>
                                        </span>
                                        <span class="file-label">
                                            Choose a file…
                                        </span>
                                        </span>
                                        <span class="file-name">
                                        Screen Shot 2017-07-29 at 15.54.25.png
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="add-new-image">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Cover upload" />
                            </div>
                            <div class="field">
                                <label class="label">Started On</label>
                                <div class="control">
                                    <input class="input" type="date" placeholder="Text input" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Finished On</label>
                                <div class="control">
                                    <input class="input" type="date" placeholder="Text input" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Page Count</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Category</label>
                                <div class="control">
                                    <div class="select">
                                        <select>
                                            <option></option>
                                            <option>Chewy</option>
                                            <option>Saucy</option>
                                            <option>Fiction</option>
                                            <option>Non-fiction</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Content</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="Textarea"></textarea>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Password</label>
                                <div class="control">
                                    <input class="input" type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button class="button is-link">Submit</button>
                                </div>
                                <div class="control">
                                    <button class="button is-text">Cancel</button>
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