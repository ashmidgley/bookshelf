import React from 'react';
import Loading from '../loading/loading';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { createCategory, updateCategory, fetchCategories, clearError } from '../../actions/category-actions';

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            action: props.match.params.id ? 'Update' : 'Create',
            categoryId: parseInt(props.match.params.id),
            category: null,
            loading: true,
            submitting: false,
            success: false,
            error: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if(!this.props.categories) {
            var id = localStorage.getItem('userId');
            this.props.fetchCategories(id);
        } else {
            this.setState({
                category: this.state.categoryId ? this.props.categories.find(b => b.id === this.state.categoryId) : null,
                loading: false
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.loading && Array.isArray(nextProps.categories)) {
            this.setState({
                category: this.state.categoryId ? nextProps.categories.find(b => b.id === this.state.categoryId) : null,
                loading: false
            });
            return;
        }

        if(nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
                submitting: false
            });
            this.props.clearError();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if(this.state.submitting && nextProps.category) {
            if(this.props.match.params.id){
                var oldCategory = this.props.categories.find(b => b.id === nextProps.category.id);
                var i = this.props.categories.indexOf(oldCategory);
                this.props.categories[i] = nextProps.category;
            } else {
                this.props.categories.push(nextProps.category);
            }
            this.setState({
                submitting: false,
                success: true
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    submitEntry(values) {
        this.setState({
            submitting: true,
            success: false,
            error: null
        });

        var category = {
            userId: parseInt(localStorage.getItem('userId')),
            description: values.description,
            code: values.code
        };
        
        var token = localStorage.getItem('token');
        if(!this.props.match.params.id) {
            this.props.createCategory(category, token);
        } else {
            category.id = this.state.category.id;
            this.props.updateCategory(category, token);
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="column is-8 is-offset-2 form-container"> 
                <div className="card custom-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faPlus} className="plus-icon" size="lg"/>
                        </div>
                    </div>
                    {
                        this.state.success && 
                        <div className="notification is-success">
                            Successfully {this.state.action.toLowerCase()}d category.
                        </div>
                    }
                    {
                        this.state.error && 
                        <div className="notification is-danger">{this.state.error}</div>
                    }
                    <Formik
                        initialValues=
                        {
                            {
                                description: this.state.category ? this.state.category.description : '',
                                code: this.state.category ? this.state.category.code : ''
                            }
                        }
                        validate={values => {
                            let errors = {};
                            if (!values.description)
                                errors.description = 'Required';
                            if(!values.code)
                                errors.code = 'Required';
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.submitEntry(values);
                            setSubmitting(false);
                        }}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Description</label>
                                    <div className="control">
                                        <input className={errors.description && touched.description ? 'input is-danger' : 'input'} type="text" name="description" placeholder="Enter description" onChange={handleChange} onBlur={handleBlur} value={values.description} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Code</label>
                                    <div className="control">
                                        <input className={errors.code && touched.code ? 'input is-danger' : 'input'} type="text" name="code" placeholder="Enter code" onChange={handleChange} onBlur={handleBlur} value={values.code} />
                                    </div>
                                    <a href="https://emojipedia.org" className="is-size-7">Emojipedia</a>
                                </div>
                                <button className={this.state.submitting ? "button is-link is-loading" : "button is-link"} type="submit" disabled={isSubmitting}>{this.state.action}</button>
                                <Link to="/manage-categories">
                                    <button className="button cancel-button">Cancel</button>
                                </Link>
                            </form>
                        )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    categories: state.categories.items,
    category: state.categories.item,
    error: state.categories.error
});

export default connect(mapStateToProps, {createCategory, updateCategory, fetchCategories, clearError})(CategoryForm);