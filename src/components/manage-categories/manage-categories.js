import React from 'react';
import Modal from 'react-modal';
import Loading from '../loading/loading';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { customStyles } from '../../helpers/custom-modal';
import { fetchCategories, removeCategory, clearError } from '../../actions/category-actions';

class ManageCategories extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedCategoryId: null,
            modalIsOpen: false,
            loading: true,
            submitting: false,
            success: false,
            error: null
        }
    }

    componentDidMount() {
        if(!this.props.categories) {
            var id = localStorage.getItem('userId');
            this.props.fetchCategories(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.categories)) {
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
        } else if(this.state.submitting && nextProps.removedCategory) {
            var oldCategory = this.props.categories.find(b => b.id === nextProps.removedCategory.id);
            var i = this.props.categories.indexOf(oldCategory);
            this.props.categories.splice(i, 1);
            this.setState({
                selectedCategoryId: null,
                modalIsOpen: false,
                submitting: false,
                success: true
            });
        }
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var token = localStorage.getItem('token');
        this.props.removeCategory(this.state.selectedCategoryId, token);
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
                    <title>Bookshelf | Manage Categories</title>
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
                            <h1 className="title">Categories</h1>
                            {
                                this.state.success && this.props.categories && this.props.categories.length &&
                                <div className="notification is-primary">Successfully removed entry.</div>
                            }
                            {
                                this.state.error && 
                                <div className="notification is-danger">{this.state.error}</div>
                            }
                            <div style={{'marginBottom': '25px'}}>
                                <Link to={'/category-form'}>
                                    <button className="button is-outlined">Add</button>
                                </Link>
                            </div>
                            {
                                !this.props.categories || !this.props.categories.length ?
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
                                            {this.props.categories.map(category =>
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

const mapStateToProps = state => ({
    categories: state.categories.items,
    removedCategory: state.categories.item,
    error: state.categories.error
});

export default connect(mapStateToProps, {fetchCategories, removeCategory, clearError})(ManageCategories);