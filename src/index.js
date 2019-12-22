import React from 'react';
import ReactDOM from 'react-dom';
import './bulma.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
