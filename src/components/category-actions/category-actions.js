import React, { Component } from 'react';
import './category-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeCategory } from '../../actions/categoryActions';
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

class CategoryActions extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedCategory: null,
            password: '',
            passwordError: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(Object.entries(nextProps.removedCategory).length !== 0) {
            var oldCategory = this.props.categories.find(b => b.id == nextProps.removedCategory.id);
            var i = this.props.categories.indexOf(oldCategory);
            this.props.categories.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedCategory: null
            })
        }
    }

    openModal = (id) => {
        this.setState({
            selectedCategory: id,
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
            this.props.removeCategory(this.state.selectedCategory);
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
        )
    }
}

  const mapStateToProps = state => ({
    categories: state.categories.items,
    removedCategory: state.categories.item
  });

export default connect(mapStateToProps, {removeCategory})(CategoryActions);