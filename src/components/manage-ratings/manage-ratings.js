import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { customStyles } from '../../helpers/custom-modal';
import { fetchRatings, removeRating, clearError } from '../../actions/rating-actions';

class ManageRatings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedRatingId: null,
            modalIsOpen: false,
            loading: true,
            submitting: false,
            success: false,
            error: null
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

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.ratings)) {
            this.setState({
                loading: false
            });
            return;
        }

        if(nextProps.error) {
            this.setState({
                error: nextProps.error,
                modalIsOpen: false,
                loading: false,
                submitting: false
            });
            this.props.clearError();
            window.scrollTo(0, 0);
        } else if(this.state.submitting && nextProps.removedRating) {
            var oldRating = this.props.ratings.find(b => b.id === nextProps.removedRating.id);
            var i = this.props.ratings.indexOf(oldRating);
            this.props.ratings.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedRatingId: null
            });
            window.scrollTo(0, 0);
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
        this.setState({
            modalIsOpen: false
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var token = localStorage.getItem('token');
        this.props.removeRating(this.state.selectedRatingId, token);
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
                    <title>Bookshelf | Manage Ratings</title>
                </Helmet>
                <div className="card form-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="image-header-container">
                                <FontAwesomeIcon icon={faEye} className="eye-icon" size="lg"/>
                            </div>
                        </div>
                        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                            <form onSubmit={this.handleSubmit}>
                                <div>Are you sure you would like to delete this rating?</div>
                                <div className="modal-actions">
                                    <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">Confirm</button>
                                    <button id="cancel" className="button" onClick={this.closeModal}>Cancel</button>
                                </div>
                            </form>
                        </Modal>
                        <div>
                            {
                                this.state.success && this.props.ratings && this.props.ratings.length &&
                                <div className="notification is-success">Successfully removed entry.</div>
                            }
                            {
                                this.state.error && 
                                <div className="notification is-danger">{this.state.error}</div>
                            }
                            <div style={{'marginBottom': '25px'}}>
                                <Link to={'/rating-form'}>
                                    <button className="button is-outlined">
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </button>
                                </Link>
                            </div>
                            {
                                !this.props.ratings || !this.props.ratings.length ?
                                <div className="notification is-link">
                                    No ratings to display.
                                </div>
                                :
                                <div className="form-table">
                                    <table className="table is-fullwidth is-bordered">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Code</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.ratings.map(rating =>
                                                <tr key={rating.id}>
                                                    <td>{rating.description}</td>
                                                    <td>{rating.code}</td>
                                                    <td className="has-text-centered">
                                                        <Link to={'/rating-form/' + rating.id}>
                                                            <button className="button is-outlined" disabled={this.state.submitting}>
                                                                Edit
                                                            </button>
                                                        </Link>
                                                    </td>
                                                    <td className="has-text-centered">
                                                        <button onClick={() => this.openModal(rating.id)} className="button is-outlined" disabled={this.state.submitting}>
                                                            Delete
                                                        </button>
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
    error: state.ratings.error
});

export default connect(mapStateToProps, {fetchRatings, removeRating, clearError})(ManageRatings);