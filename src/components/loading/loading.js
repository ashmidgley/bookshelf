import React from 'react';
import './loading.css';

class Loading extends React.Component {

    render() {
        return (
            <div className="spinner">
               <img src="/logo.png"/>
            </div> 
        )
    }
}

export default Loading;