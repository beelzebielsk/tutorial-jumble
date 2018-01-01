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
    let { number, ...other } = props;
    return <img src={images[number]} {...other} height="150px" width="150px"/>
}

/* Revealed: boolean
 * If true, then the children of the Tile are visible. If false, then
 * the children of the Tile are not visible (though the tile itself is
 * still visible.
 */
function Tile(props) {
    let {revealed, children, ...other} = props;
    //console.log("revealed from Tile:", revealed);
    let overlay = <div className="overlay"/>;
    if (!revealed) {
        return <div {...other}>{overlay}</div>;
    }
    return <div {...other}>{children}</div>;
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
    let {items, revealed, tileProps} = props;
    let height = items.length;
    let width = items[0].length;
    let tiles = [];
    for (let row = 0; row < height; row++) {
        let rowTiles = [];
        for (let column = 0; column < width; column++) {
            let imageIndex = items[row][column];
            let isRevealed = revealed[row][column];
            let tileId = `${row},${column}`;
            rowTiles.push(
                <Tile 
                    revealed={isRevealed} 
                    key={tileId}
                    id={tileId}
                    {...tileProps}>
                    <Icon number={imageIndex}/>
                </Tile>);
        }
        tiles.push(rowTiles);
    }
    return <Table rows={tiles}/>;
}

/* Steps of the Game:
 * 1. Show the tiles. If a tile has already been matched, then the
 *    tile should be "revealed", meaning that you show the actual
 *    picture. If a tile has not already been matched, then the tile
 *    should be "covered" in some way.
 * 2. The player clicks on a tile.
 *    - The player clicked on an already revealed tile. Do nothing.
 *    - The player clicked on an unrevealed tile. Reveal the tile.
 *      This is the tile that the player will now try to match with
 *      another tile.
 * 3. The player clicks on another tile.
 *    - The player clicked on an already revealed tile. Do nothing.
 *    - The player clicked on an unrevealted tile. Check to see if the
 *      image on the new tile matches the image on the previously
 *      clicked tile.
 *      - If they match, then both tiles become permanently revealed.
 *      - If they don't match, then both tiles become unrevealed.
 * 4. If all of the tiles are matched now, then the game ends. If not
 *    all of the tiles are matched, then the game continues.
 */

class Game extends Component {
    constructor() {
        super();
        this.tiles = [
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11],
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11],
        ]
        this.width = 4;
        this.height = 6;
        this.state = {
            revealed : Array(6).fill(Array(4).fill(false)),
            matched: [],
        }
        this.revealTile = this.revealTile.bind(this);
    }

    /* index: A string of the form "row,column".
     * Returns: this.tiles[row][column]. The tile at position row,
     * column.
     */
    getTile(index) {
        let [row, column] = index.split(",");
        return this.tiles[row][column];
    }
    revealTile(event) {
        /* currentTarget returns the element whose event listener
         * triggered the event. It returns the element that was
         * clciked which also had the `onClick` eventListener set.
         * Reference:
         * <https://www.w3schools.com/jsref/event_currenttarget.asp>
         */
        let { id } = event.currentTarget;
        if (this.state.matched.includes(id)) {
            return;
        }
        let numMatched = this.state.matched.length;
        if (numMatched === 0) {
            /* Array.prototype.concat does not modify either the
             * original array, nor the argument array, so this makes a
             * copy. Copies are needed when dealing with React.
             */
            let matched = this.state.matched.concat([id]);
            this.setState({
                matched : matched
            });
            return;
        }
        // At this point, we know that there's an already selected
        // tile, and the user clicked on a second tile. This is where
        // the game actually progresses: this is the matching step.
        let firstTile = this.getTile(this.state.matched[0]);
        let secondTile = this.getTile(id);
        let matched = [];
        if (firstTile !== secondTile) {
            this.setState({
                matched : matched
            })
            return;
        }
        /* This little hack was needed because I needed to copy
            * the whole array. Normally `[...arr]` ought to be enough
            * to copy the array `arr`, but this is not always the
            * case. In particular, it is not the case when the
            * elemnets of the array are objects or arrays. This is
            * because the spread operator isn't a "deep" copy, it's a
            * "shallow" copy. The difference between the two is a
            * little too much to explain in a comment here.
            */
        let revealed = this.state.revealed.map(row => [...row]);
        let [row, column] = this.state.matched[0].split(",");
        revealed[row][column] = true;
        [row, column] = id.split(",");
        revealed[row][column] = true;
        this.setState({
            matched : matched,
            revealed : revealed
        });
    }

    render() {
        let {width, height, tiles} = this;
        let {revealed, matched} = this.state;
        let revealedCopy = revealed.map(row => [...row]);
        //console.log(matched);
        matched.forEach(id => {
            //console.log("Revealed Copy:", revealedCopy);
            //console.log("id:", id);
            let index = id.split(",");
            revealedCopy[index[0]][index[1]] = true;
        });
        //console.log(revealed);
        //console.log(revealedCopy);

        let board = <Board 
                        items={tiles}
                        revealed={revealedCopy}
                        tileProps={{onClick: this.revealTile}}/>


        return board;

    }
}

function App() {
    return <Game/>;
}

export default App;
