import React, { Component } from 'react';
import './manage-ratings.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchRatings, removeRating } from '../../actions/ratingActions';
import Modal from 'react-modal';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Loading from '../loading/loading';

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

class ManageRatings extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedRatingId: null,
            loading: true
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.ratings))
            this.setState({
                loading: false
        });

        if(nextProps.removedRating) {
            var oldRating = this.props.ratings.find(b => b.id === nextProps.removedRating.id);
            var i = this.props.ratings.indexOf(oldRating);
            this.props.ratings.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedRatingId: null
            })
        }
    }

    componentDidMount() {
        if(!this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchRatings(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    openModal = (id) => {
        this.setState({
            selectedRatingId: id,
            modalIsOpen: true,
            success: false
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        this.props.removeRating(this.state.selectedRatingId, this.props.token);
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 admin-container">
                <Helmet>
                    <title>Bookshelf | Manage Ratings</title>
                </Helmet>
                <div className="card admin-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="admin-image-header-container">
                                <FontAwesomeIcon icon={faEye} className="admin-icon" size="lg"/>
                            </div>
                        </div>
                        <div>
                        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                                <form onSubmit={this.handleSubmit}>
                                    <div>Are you sure you would like to delete this rating?</div>
                                    <div className="modal-actions">
                                        <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">Confirm</button>
                                        <button id="cancel" className="button" onClick={this.closeModal}>Cancel</button>
                                    </div>
                                </form>
                            </Modal>
                            <h1 className="title">Ratings</h1>
                            {this.state.success && this.props.ratings.length ? 
                                <div className="notification is-primary">Successfully removed entry.</div>
                                :
                                null
                            }
                            <div style={{'marginBottom': '25px'}}>
                                <Link to={'/admin/rating-form'}>
                                    <button className="button is-outlined">Add</button>
                                </Link>
                            </div>
                            {!this.props.ratings.length ?
                                <div className="notification is-link">
                                    No ratings to display.
                                </div>
                                :
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
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

  const mapStateToProps = state => ({
    ratings: state.ratings.items,
    removedRating: state.ratings.item,
    token: state.user.token
  });

export default connect(mapStateToProps, {fetchRatings, removeRating})(ManageRatings);