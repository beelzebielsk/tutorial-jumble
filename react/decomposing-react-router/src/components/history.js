/* This functionality requires the npm package history.
 * To install, do:
 *      npm install history
 * This package is what allows us to change the URL in the browser
 * without refreshing a page, or loading a whole new page.
 * Basically, all the URL manipulations happen through this object
 * instead.
 */
import createHistory from 'history/createBrowserHistory';
const history = createHistory();
/* Navigate to a different URL using a path. Manipulation of the
 * history object allows us to change the URL of the browser.
 * Arguments:
 * path, string:
 *      A string representing a path, such as `/` or `/movies`.
 */
function navigateTo(path) {
    history.push(path);
}
export { history, navigateTo };
export default navigateTo;
