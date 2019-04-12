import React, { Component } from 'react';
import './category-actions.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { removeCategory } from '../../actions/categoryActions';
import PropTypes from 'prop-types';

class CategoryActions extends Component {

    constructor(props){
        super(props);
        this.state = {
            submitting: false,
            success: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.removedCategory) {
            var oldCategory = this.props.categories.find(b => b.id == nextProps.removedCategory.id);
            var i = this.props.categories.indexOf(oldCategory);
            this.props.categories.splice(i, 1);
            this.setState({
                submitting: false,
                success: true
            })
        }
    }

    removeCategory(id) {
        this.setState({
            submitting: true,
            success: false
        });
        this.props.removeCategory(id);
    }

    render() {
        return (
           <div>
                <h1 className="title">Categories</h1>
                {this.state.success ? 
                    <div className="notification is-primary">Successfully removed entry.</div>
                    :
                    null
                }
                <table className="table is-fullwidth is-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Description</th>
                            <th>Code</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.categories.map(category =>
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.description}</td>
                                <td>{category.code}</td>
                                <td className="has-text-centered">
                                    <Link to={'/admin/category-form/' + category.id}><button className="button is-info is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                </td>
                                <td className="has-text-centered">
                                    <button onClick={() => this.removeCategory(category.id)} className="button is-danger is-outlined" disabled={this.state.submitting}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <Link to={'/admin/category-form'}><button className="button is-success is-outlined">Add</button></Link>
                </div>
            </div>
        )
    }
}


CategoryActions.propTypes = {
    categories: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    categories: state.categories.items,
    removedCategory: state.categories.item
  });

export default connect(mapStateToProps, {removeCategory})(CategoryActions);