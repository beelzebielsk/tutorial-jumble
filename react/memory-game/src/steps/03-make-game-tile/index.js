import React, { Component } from 'react';
import './App.css';

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
    return <img src={images[number]} height="150px" width="150px"/>
}

/* Revealed: boolean
 * If true, then the children of the Tile are visible. If false, then
 * the children of the Tile are not visible (though the tile itself is
 * still visible.
 */
function Tile(props) {
    let {revealed, children} = props;
    console.log("revealed from Tile:", revealed);
    let overlay = <div className="overlay"/>;
    if (!revealed) {
        return <div>{overlay}</div>;
    }
    return <div>{children}</div>;
}

function Table(props) {
    let {rows} = props;
    let table = rows.map(row => (
        <tr> {row.map(data => (
            <td className="tile">{data}</td>
            ))} 
        </tr>))
    return <table>{table}</table>;
}

function Board(props) {
    let {height, width} = props;
    let tiles = [];
    for (let row = 0; row < height; row++) {
        let rowTiles = [];
        for (let column = 0; column < width; column++) {
            let imageIndex = row * width + column;
            let revealed = (imageIndex % 2) === 0;
            console.log(revealed);
            rowTiles.push(
                <Tile revealed={revealed}>
                    <Icon number={imageIndex}/>
                </Tile>);
        }
        tiles.push(rowTiles);
    }
    return <Table rows={tiles}/>;
}

function App() {
    return <Board height={3} width={4}/>;
}

export default App;
