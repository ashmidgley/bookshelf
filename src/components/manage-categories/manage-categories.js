import React, { Component } from 'react';
import './manage-categories.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories, removeCategory } from '../../actions/categoryActions';
import Modal from 'react-modal';
import Category from '../../models/category';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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

class ManageCategories extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedCategoryId: null,
            loading: true
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.categories))
            this.setState({
                loading: false
        });

        if(nextProps.removedCategory) {
            var oldCategory = this.props.categories.find(b => b.id === nextProps.removedCategory.id);
            var i = this.props.categories.indexOf(oldCategory);
            this.props.categories.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedCategoryId: null
            })
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

    openModal = (id) => {
        this.setState({
            selectedCategoryId: id,
            modalIsOpen: true,
            success: false,
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        this.props.removeCategory(this.state.selectedCategoryId, this.props.token);
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            );
        }
        
        return (
            <div className="column is-8 is-offset-2 admin-container">
                <Helmet>
                    <title>Bookshelf | Manage Categories</title>
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
                                        <p>Are you sure?</p>
                                        <div className="modal-actions">
                                            <button className={this.state.submitting ? "button is-success is-loading" : "button is-success"} type="submit">Yes</button>
                                            <button id="cancel" className="button is-danger" onClick={this.closeModal}>No</button>
                                        </div>
                                    </form>
                                </Modal>
                                <h1 className="title">Categories</h1>
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
                                            {this.props.categories.map(category =>
                                                <tr key={category.id}>
                                                    <td>{category.description}</td>
                                                    <td>{category.code}</td>
                                                    <td className="has-text-centered">
                                                        <Link to={'/admin/category-form/' + category.id}><button className="button is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                                    </td>
                                                    <td className="has-text-centered">
                                                        <button onClick={() => this.openModal(category.id)} className="button is-outlined" disabled={this.state.submitting}>Delete</button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <Link to={'/admin/category-form'}><button className="button is-outlined">Add</button></Link>
                                </div>
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
    token: state.user.token
  });

export default connect(mapStateToProps, {fetchCategories, removeCategory})(ManageCategories);