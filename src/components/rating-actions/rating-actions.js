import React, { Component } from 'react';
import './rating-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeRating } from '../../actions/ratingActions';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class RatingActions extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedRating: null,
            password: '',
            passwordError: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.removedRating) {
            var oldRating = this.props.ratings.find(b => b.id == nextProps.removedRating.id);
            var i = this.props.ratings.indexOf(oldRating);
            this.props.ratings.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedRating: null
            })
        }
    }

    openModal = (id) => {
        this.setState({
            selectedRating: id,
            modalIsOpen: true,
            success: false,
            password: '',
            passwordError: false
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        if (this.state.password.localeCompare(process.env.REACT_APP_FORM_PASSWORD) == 0) {
            this.props.removeRating(this.state.selectedRating);
        } else {
            this.setState({
                passwordError: true,
                submitting: false
            });
        }
    }

    render() {
        return (
           <div>
               <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                    <form onSubmit={this.handleSubmit}>
                        <label className="label">Password</label>
                        <input className={this.state.passwordError ? "input is-danger" : "input"} type="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Enter password" />
                        <div className="password-modal-actions">
                            <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">Submit</button>
                            <button id="cancel" className="button" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
                <h1 className="title">Ratings</h1>
                {this.state.success ? 
                    <div className="notification is-primary">Successfully removed entry.</div>
                    :
                    null
                }
                <div className="admin-table">
                    <table className="table is-fullwidth is-bordered">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Code</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.ratings.map(rating =>
                                <tr key={rating.id}>
                                    <td>{rating.description}</td>
                                    <td>{rating.code}</td>
                                    <td className="has-text-centered">
                                        <Link to={'/admin/rating-form/' + rating.id}><button className="button is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                    </td>
                                    <td className="has-text-centered">
                                        <button onClick={() => this.openModal(rating.id)} className="button is-outlined" disabled={this.state.submitting}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Link to={'/admin/rating-form'}><button className="button is-outlined">Add</button></Link>
                </div>
            </div>
        )
    }
}

  const mapStateToProps = state => ({
    ratings: state.ratings.items,
    removedRating: state.ratings.item
  });

export default connect(mapStateToProps, {removeRating})(RatingActions);