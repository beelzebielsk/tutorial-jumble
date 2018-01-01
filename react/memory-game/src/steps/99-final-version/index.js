function Icon(props) {
    let { number } = props;
    return <span className="icon">{number}</span>;
}

function Table(props) {
    let {rows} = props;
    let table = rows.map(row => (
        <tr> {row.map(data => (
            <td>{data}</td>
            ))} 
        </tr>))
    return <table>{table}</table>;
}


function Board(props) {
    let { tiles, height, width } = props;
    return <Table rows={tiles}/>;
}

/* Tiles will contain the logic of revealing and hiding something.
 * Anything. It literally doesn't matter what's under, because that
 * has nothing to do with anything. They could all be empty.
 */

/* Steps of Creation:
 * 1.  Show an image.
 * 2.  Show several images.
 * 3.  Make a Component that takes in a number and shows a specific
 *     image. This way, the game logic knows nothing about the actual
 *     image shown, and you can freely swap out one image for another
 *     without any troubles.
 * 4.  Show images in a grid.
 * 5.  Create a Component for the game and have it render tiles in a
 *     gird. It doesn't matter if they're random or not. Just show
 *     them. For now, we won't do them randomly.
 * 6.  Figure out how the player can interact with the game at any
 *     given time and model all the ways that the game can change
 *     state.
 */

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

/* What if I want the second clicked Icon to show, and then unshow?
 * - Perhaps, in this case, we can set a function to happen a second
 *   or two later which will revert the game's state to the state as
 *   it is right now, then add the unmatched tiles to the matched
 *   array.
 * - We can also expand the role of the matching state to hold the
 *   current cards that we're trying to match. This sounds cheaper.
 *   Once both are selected, we take some time to react to the player,
 *   show some stuff. If the two cards matched, then we concatenate
 *   the matching cards onto the matched cards. Either way, we empty
 *   the list of matching cards.
 */

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // For noting which tiles have already been matched.
            matched: [],
            // For noting the current flipped tiles.
            matching: []
        }
    }
    render() {
        let { images } = this.props;
    }
}

export default Game;
