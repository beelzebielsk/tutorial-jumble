import React, { Component } from 'react';

function CheckMark(props) {
    return (
        <input 
            type="checkbox" 
            checked={props.checked} 
            onChange={props.onClick}/>
    );
}

export default CheckMark;
