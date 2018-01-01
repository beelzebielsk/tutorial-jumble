import React, { Component } from 'react';

function Icon(props) {
    let images = {
        0:  "icons/abra.svg",                
        1:  "icons/action-1.svg",            
        2:  "icons/action.svg",              
        3:  "icons/augmented-reality-1.svg", 
        4:  "icons/augmented-reality.svg",   
        5:  "icons/backpack.svg",            
        6:  "icons/battle.svg",              
        7:  "icons/bellsprout.svg",          
        8:  "icons/blue-team.svg",           
        9:  "icons/bracelet.svg",            
        10: "icons/bullbasaur.svg",          
        11: "icons/camera.svg",              
    }
    let { number } = props;
    return <img src={images[number]}/>
}

function App() {
    let images = [0, 1, 2, 3, 4].map(imageIndex =>
        <Icon number={imageIndex}/>)
    return <div>{images}</div>
}

export default App;
