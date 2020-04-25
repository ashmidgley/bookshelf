import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Link }from 'react-router-dom';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { customStyles } from '../../helpers/custom-modal';
import { fetchCategories, removeCategory } from '../../actions/category-actions';

class ManageCategories extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            categories: null,
            selectedCategoryId: null,
            modalIsOpen: false,
            loading: true,
            submitting: false,
            success: false,
            error: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var userId = localStorage.getItem('userId');
        fetchCategories(userId)
            .then(response => {
                this.setState({
                    categories: response,
                    loading: false
                });
            })
            .catch(error => {
                this.handleError(error);
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
        removeCategory(this.state.selectedCategoryId, token)
            .then(response => {
                var oldCategory = this.state.categories.find(b => b.id === response.id);
                var index = this.state.categories.indexOf(oldCategory);
                this.state.categories.splice(index, 1); 
                this.setState({
                    selectedCategoryId: null,
                    modalIsOpen: false,
                    submitting: false,
                    success: true
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleError = (error) => {
        this.setState({
            error: error,
            modalIsOpen: false,
            loading: false,
            submitting: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    openModal = (id) => {
        this.setState({
            selectedCategoryId: id,
            modalIsOpen: true,
            success: false,
        });
    }
    
    closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
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
                    <title>Manage Categories - Bookshelf</title>
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
                                <div>Are you sure you would like to delete this category?</div>
                                <div className="modal-actions">
                                    <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit">Confirm</button>
                                    <button id="cancel" className="button" onClick={this.closeModal}>Cancel</button>
                                </div>
                            </form>
                        </Modal>
                        <div>
                            {
                                this.state.success && this.state.categories && this.state.categories.length &&
                                <div className="notification is-success">Successfully removed entry.</div>
                            }
                            {
                                this.state.error && 
                                <div className="notification is-danger">{this.state.error}</div>
                            }
                            <div style={{'marginBottom': '25px'}}>
                                <Link to={'/category-form'}>
                                    <button className="button is-outlined">
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </button>
                                </Link>
                            </div>
                            {
                                !this.state.categories || !this.state.categories.length ?
                                <div className="notification is-link">
                                    No categories to display.
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
                                            {
                                                this.state.categories.map(category =>
                                                <tr key={category.id}>
                                                    <td>{category.description}</td>
                                                    <td>{category.code}</td>
                                                    <td className="has-text-centered">
                                                        <Link to={'/category-form/' + category.id}>
                                                            <button className="button is-outlined" disabled={this.state.submitting}>
                                                                Edit
                                                            </button>
                                                        </Link>
                                                    </td>
                                                    <td className="has-text-centered">
                                                        <button onClick={() => this.openModal(category.id)} className="button is-outlined" disabled={this.state.submitting}>
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

export default ManageCategories;