import React, { Component } from 'react';

/* Just learn to show a single image. The path for the `src` attribute
 * is relative to the `public` directory.
 */

/* Icons from:
 * https://www.flaticon.com/packs/pokemon-go
 */
function Icon(props) {
    return <img src="icons/weedle.svg"/>
}

function App() {
    return <Icon />
}

export default App;
