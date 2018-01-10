import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

/* Create a website of your favorite movies. The page must include a
 * navbar with at least two links: Home and Movies. The movies page
 * will show a list of all your favorite movies, with the name and
 * a year for each one. When a movie is clicked, show a page with
 * more information about it: include at least the director, some
 * of the main actors, an image of the movie, and a link to an
 * external website like IMDB.  */

let movieList = [
    {
        name: 'Cat Death',
        year: '20XX',
        director: 'Me',
        actors: [
            'Me',
            'Dead Cat',
            'Soon to be dead Cat',
        ],
        image: 'http://media.boreme.com/post_media/2009/dead-cat.jpg',
        link: 'about:dontdothat',
        genre: 'real',
    },
    {
        name: 'Frankly my dear, I hate you' ,
        year: 'Now',
        director: 'Not Me',
        actors: [
            'Not Me',
            'Definitely You',
            'Witnesses?'
        ],
        image: 'about:noimagegoodenough',
        link: 'about:dne',
        genre: 'fake',
    },
    {
        name: 'Human Millipede',
        year: 'XXXX',
        director: 'For Sure Not Me',
        actors: [
            'Head',
            'Section 1',
            'Section 2',
            '...',
            'Section 1000',
        ],
        image: 'http://i2.wp.com/www.whaleoil.co.nz/wp-content/uploads/2014/07/Large-Weta.jpg',
        link: 'about:dneforeal',
        genre: 'fake',
    },
    {
        name: 'Dry Paint: Revelations',
        year: 'A long time ago',
        director: 'Time',
        actors: [
            'Paint',
        ],
        image: 'http://upload.wikimedia.org/wikipedia/commons/7/7d/White_wall_(Savvino-Storozhevsky_Monastery).jpg',
        link: 'about:didyoureallywantmoreinformation',
        genre: 'real',
    },
]

function getMoviesByGenre(genre) {
    return movieList.filter(movie => movie.genre === genre);
}

/* Gets the first movie with the given name.
 * This was necessary because of the genres section. I needed a way to
 * navigate to a particular movie without knowing where the movie was
 * in the array `movieList`.
 * Originally, I rendered the movie based on the location of the movie
 * in movieList. This worked fine when I was rendering all the movies,
 * but would've led to a really nasty solution for Genres, were I
 * would've needed to keep track of the locations of all of the
 * movies.
 */
function getMovieByName(name) {
    return movieList.filter(movie => movie.name === name)[0];
}

function getAllGenres(movieList) {
    let allGenres = movieList.map(movie => movie.genre);
    /* This line is about removing duplicates, which I didn't
     * particularly want to code. A Set is something like an array,
     * but without duplicates. I didn't want to actually mess with
     * sets, however, so I transformed the Set back into an array,
     * using the `Array.from` method, which transforms some other sort
     * of iterable object into an array.
     */
    return Array.from(new Set(allGenres));
}

/* The <nav> element is part of HTML5. It doesn't really do much
 * that's special. Nav bars are so omnipresent in webpages, and so
 * important to navigating a webpage that they were given a
 * special tag, particularly for making accessibililty services for
 * the blind easier (it's easy to navigate a nav bar by voice when you
 * know for sure which element is the nav bar).
 */
function Nav() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/genres">Genres</Link>
        </nav>
    );
}

function Home() {
    return <span>This is home. Not very homely.</span>
}

function SmallMovie(props) {
    let {name, year} = props;
    return <span>{name}: Year {year}</span>;
}

function BigMovie(props) {
    let { whichMovie } = props.match.params;
    let {image, link, ...movie} = getMovieByName(whichMovie);
    let keys = Object.keys(movie);
    let rows = keys.map(key => (
        <tr>
            <td>{key}</td>
            <td>{movie[key]}</td>
        </tr>));

    return (
        <div>
            <div>
                <a href={link}>
                    <img src={image}/>
                </a>
            </div>
            <table>{rows}</table>
        </div>
    );
}

function Movies(props) {
    /* When an element is given to <Route> as a component, that
     * component will get rendered with the following props:
     * - match : An object containing information about URL
     *   parameters. URL parameters are done exactly like
     *   Express.js's request.params. 
     *   - match.params: the URL parameters as an object, where the
     *     parameter name is the key and the parameter's value is the
     *     value.
     *   - match.path: The path pattern used to match the path. In
     *     other words, the value of the property `path` on the
     *     <Router>.
     *   - match.url: The actual matched portion of the URL (not the
     *     pattern, but the matched part of the actually entered URL).
     *   Source <https://reacttraining.com/react-router/web/api/match>
     * - location : Not sure
     * - history : Not sure
     * Source: <https://reacttraining.com/react-router/web/api/>
     */
    let {path} = props.match;
    let list = movieList
               .map(m => (<Link to={`${path}/${m.name}`}> 
                            <SmallMovie {...m}/>
                          </Link>))
               .map(m => <li>{m}</li>)
    let route = (
        <Route path={`${path}/:whichMovie`} component={BigMovie}/>
    );
    return (
        <div>
            <ul>{list}</ul>
            {route}
        </div>
    );
}

function Select(props) {
    let options = props.options.map(option => {
        return (
            <option value={option}>
                {option}
            </option>
        );
    });
    /* I figured out which attributes to provide by looking here:
     *      https://reactjs.org/docs/forms.html
     * This was a helpful reference, and it turns out that React
     * treats these elements a little differently than HTML does.
     */
    return <select 
                name={props.name} 
                onChange={props.onChange}
                value={props.checkedOption}>
                    {options}
           </select>
}

class Genres extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "genre" : null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value,
        });
    }

    render() {
        let genres = getAllGenres(movieList);
        let selector = <Select name="genre" options={genres}/>;
        let links = null;
        if (this.state.genre) {
            links = getMoviesByGenre(this.state.genre)
               .map(m => (<Link to={`/movies/${m.name}`}> 
                            <SmallMovie {...m}/>
                          </Link>))
               .map(m => <li>{m}</li>);
        }
        return (
            <div onChange={this.handleChange}>
                {selector}
                {links}
            </div>
        );
    }
}

/* The <Route> component takes the current URL and performs some
 * actions based on it. It has the following properties:
 * - path, string: A URL to match against. Will display some content
 *   based on whether or not the current URL matches the pattern in
 *   this path.
 * - exact, boolean: If true, then the <Route> will render some
 *   content only on an *exact* match. If false, then it seems that
 *   the <Route> Will render some content if some prefix of the URL
 *   matches. For example, if the <Route> for the root path ('/')
 *   didn't have `exact` set on it, then both the root path route and
 *   the movies route would render at the same time, since '/' is a
 *   prefix of '/movies'.
 * - component, React Component: A react component to render if the
 *   URL matches.
 * - render, function : Not used here today.
 * - children, function : Not used here today.
 *
 * Note: The Routes whose paths match the current URL will ALL render
 * at the same time. If you only want one to render, then make sure
 * only one path matches the current URL. There's another option, as
 * well: <https://reacttraining.com/react-router/web/api/Switch>.
 *
 * The component gets rendered basically like so:
 *      <Home match={...} location={...} history={...}/>
 * It will get a props object with three properties: match, location,
 * and history.
 *
 * Source: <https://reacttraining.com/react-router/web/api/Route>
 */
class Page extends Component {
    render() {
        return (
            <div>
                <Nav/>
                <Route exact path="/" component={Home}/>
                <Route path="/movies" component={Movies}/>
                <Route path="/genres" component={Genres}/>
            </div>
        );
    }
}

let App = () => {
    return (
        <BrowserRouter>
            <Page/>
        </BrowserRouter>
    );
}

export default App;
