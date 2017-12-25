import React, { Component } from 'react';
import CheckMark from './CheckMark'

/* The list will take two properties:
 * entries: An object where:
 * - The key of each entry is a label of a list item.
 * - The value of each entry is the text for the corresponding list
 *   item.
 * none: The text for the "none of the other options" entry. For now,
 * I'm still treating this specially.
 */
class List extends Component {
    constructor(props) {
        super(props);

        /*
            let state = {}
        for (let label in props.entries) {
            state[label] = false;
        }
        state.none = false;
        this.state = state;
        */

        this.state = {};
        for (let label in props.entries) {
            this.state[label] = false;
        }
        this.state.none = false;

        this.checkEntry = this.checkEntry.bind(this);
        this.checkNone = this.checkNone.bind(this);
    }

    checkEntry(label) {
        console.log(`Check ${label}.`);
        /* I do this because I want to change the state of several
         * things, but change the overall state of the component once.
         * I can't use an object literal because I don't know the
         * names of all of the keys ahead of time. Though, if I
         * remember correctly, it might be possible in ES6 right now
         * to do computed field names in an objet literal.
         */
        let state = {}
        state[label] = !this.state[label];
        state.none = false;
        this.setState(state);
    }

    checkNone() {
        console.log("Check none.");
        let state = {};
        for (let label in this.props.entries) {
            state[label] = false;
        }
        state.none = true;
        this.setState(state);
    }

    render() {
        console.log(this.state);
        return (
            <ul>
            {
                /* First, render the animal choices. To do this, I map
                 * over a list of labels for each choice, and pretty
                 * similarly to the basic version, each animal choice
                 * is represented by a list item (li) that contains a
                 * checkmark. I set the state of the checkmark based
                 * on the state of the list.
                 */
                Object.keys(this.props.entries).map(label => {
                    return (
                        <li key={label}>
                            {this.props.entries[label]}
                            <CheckMark 
                                checked={this.state[label]}
                                onChange={() => this.checkEntry(label)}/>
                        </li>
                    );
                })
            }
            <li key="none">
                {this.props.none}
                <CheckMark 
                    checked={this.state.none}
                    onChange={this.checkNone}/>
            </li>
            </ul>
        );
    }
}

export default List;
