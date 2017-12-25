import React, { Component } from 'react';
import './App.css';

function Table(props) {
    let {rows} = props;
    let table = rows.map(row => (
        <tr> {row.map(data => (
            <td>{data}</td>
            ))} 
        </tr>))
    return <table>{table}</table>;
}

function Text(props) {
    //let {onChange, value, name} = props;
    //let requestedProps = {onChange, value};
    return (
        <input
            type="text"
            {...props}
            />
    );
}

function reactMap(children, callback) {
    if (Array.isArray(children)) {
        return children.map(callback);
    } else {
        return callback(children)
    }
}

function reactReduce(children, callback, initialValue) {
    if (Array.isArray(children)) {
        return children.map(callback);
    } else {
        return callback(children)
    }
}
/* Receives a dictionary of URLs: image name : image source, displays
 * radio buttons and an image to display them.
function Images(props) {
    constructor(props) {
        super(props);
        this.state = {
            choice : "";
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log(event.target);
        // console.log(event.target.name);
        // console.log(event.target.value);
        // console.log(event.bubbles);
        this.setState({
            [event.target.name] : event.target.value,
        });
    }

    render() {
    }
}
 */

function RadioButtons(props) {
    let {options, checkedOption, onChange, labels} = props;
    let buttons = options.map(option => (
        <label>
            {option}
            <input
                type="radio"
                value={option}
                checked={option === checkedOption}
                onChange={onChange}/>
        </label>
    ));
}
function Images(props) {
    let radioButtons = [];
    for (let key in props.images) {
        //radioButtons.push(
    }
    let names = Object.keys(props.images);
    let URLs = Object.keys(props.images).map(key => props.imags[key]);

}

class Form extends Component {
    constructor(props) {
        super(props);

        let state;
        // Create the state entries based on the children passed to
        // the form.
        if (Array.isArray(this.props.children)) {
            state = this.props.children.reduce((obj, child) => {
                let name = child.props.name;
                if (name)
                    obj[child.props.name] = null;
                return obj;
            }, {});
        } else {
            state = {
                [this.props.children.props.name] : null
            }
        }
        console.log("Test state:", state);
        this.state = state;

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = () => {
            console.log("Enter onSubmit.");
            this.props.onSubmit(this.state)
        }
        this.onEnter = this.onEnter.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value,
        });
    }

    onEnter(event) {
        if (event.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        let {input} = this.state;
        let {onSubmit} = this;
        let children = reactMap(this.props.children, child => {
            let name = child.props.name;
            if (name) {
                return React.cloneElement(child, {
                    'value' : this.state[name]
                });
            }
            return child;
        });

        console.log(this.props);
        console.log(typeof this.props.children);

        return (
            <div 
                onChange={this.handleChange} 
                onKeyPress={this.onEnter}>
                {children}
                <input
                    type="submit"
                    onClick={onSubmit}
                    onSubmit={onSubmit}/>
            </div>
        );
    }
}


class App extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            height: "",
            weight: "",
            imgURL: "",
            types: [],
            habitat: [],
            moves: [],
        };
        this.fetchPokemonInfo = this.fetchPokemonInfo.bind(this);
    }

    fetchPokemonInfo(pokemon) {
        console.log("Entered fetchPokemonInfo.");
        //let baseURL = 'https://pokeapi.co';
        let baseURL = 'http://localhost:8000';
        let API = "api/v2";
        let pokemonResource = 'pokemon';
        let URL = [baseURL, API, pokemonResource, pokemon, ''].join('/');
        console.log("URL:", URL);
        let info = {};
        fetch(URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Unsuccessful iniital request:")
                throw response
            }
        })
        .then(data => {
            let moves = data.moves.map(move => move.move.name);
            let types = data.types.map(Type => Type.type.name);
            let habitatURL = data.location_area_encounters;

            info.name = data.name;
            info.height = data.height;
            info.weight = data.weight;
            info.imgURL = data.sprites.back_shiny;
            info.moves = moves;
            info.types = types;

            let URL = `${baseURL}${habitatURL}`;
            console.log("URL:", URL);
            return fetch(URL);
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Unsuccessful iniital request:")
                throw response;
            }
        })
        .then(data => {
            console.log("Habitat data:", data);
            //info.habitat = data;
            info.habitat = data.map(entry => entry.location_area.name)
            this.setState(info);
        })
        .catch(err => {
            console.error("Error in fetchPokemonInfo:");
            console.error(err);
        });
    }
    render() {
        console.log(this.state);
        let {imgURL, ...characteristics} = this.state;
        let rows = Object.keys(characteristics).map(
            key => {
                let value = characteristics[key];
                if (Array.isArray(value)) {
                    return [key].concat(value);
                } else {
                    return [key, value];
                }
            })
        console.log("Rows:", rows);
        let formSubmit = ({input}) => { this.fetchPokemonInfo(input) };
        return (
            <div>
                <Form onSubmit={formSubmit}>
                    <Text name="input"/>
                </Form>
                <Table rows={rows}/>
                <img src={imgURL} />
            </div>
        );
    }
}

export default App;
