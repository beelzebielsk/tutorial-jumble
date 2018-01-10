import React, { Component } from 'react';
import { history } from './history';

const allRoutes = [];

/* Sources:
 * - <https://reactjs.org/docs/react-component.html#forceupdate>
 * - <https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate#30626072>
 */
const forceUpdate = () => {
    allRoutes.forEach(route => route.forceUpdate());
}

/* There's one other reason to use a class component, aside from
 * state: lifecycle methods. Fancier components have "different
 * defaults" from the simple functional component. Somtimes that means
 * state and extra properties. Here, it means doing an action only
    * when*/

class Route extends Component {
    constructor(props) {
        super(props);
        allRoutes.push(this);
    }
    render() {
        const { path, component} = this.props;
        const exact = this.props.exact ? true : false;
        const currentLocation = history.location;
        let renderComponent = false;
        if (exact) {
            renderComponent = (path === currentLocation.pathname);
        } else {
            renderComponent = currentLocation.pathname.startsWith(path)
        }

        if (path === currentLocation.pathname) {
            return React.createElement(
                component,
                null,
                null
            );
        } else {
            return null;
        }
    }
}

/* forceUpdate will get called every time the URL changes.
 * All the Routes will re-render, which means that they'll check their
 * path against the URL. I needed to do this because I don't change
 * the props or state of any of the Route components, and renders only
 * happen when props or state are changed.
 *
 * NOTE: This implementation is not actually what react-router does.
 * But this is probably a rough approximation of what they do. For
 * now, this level of detail is okay.
 */
history.listen(forceUpdate);

export default Route;
