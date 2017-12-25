import React, { Component } from 'react';
import CheckMark from './CheckMark'

/* Now I'm going to look at the problem as having groups of check
 * marks, where you can't have a check in one group and a check in
 * another group. All of the checks have to be in exactly one of the
 * groups. This is a slightly more general version of having a list
 * of choices whose length can change, and having just one option that
 * unchecks all of the other options.
 *
 * You can see the animal options as belonging to one group, and the
 * disliking animals option as belonging to a second group.
 */

/* class CheckList:
 * Takes an object whose keys are labels of list items, and whose
 * values are objects of the form:
 *      {content:string, checked:boolean, onChange:function}.
 * So, the whole object's structure is:
 * {
 *      ...entries,
 *      entryName : {
 *         content: string,
 *         checked: boolean,
 *         onChange: function,
 *      }
 *      ...more entries,
 * }
 */
function CheckList(props) {
    return (
        <ul>
            {
                Object.keys(props.entries).map(label => {
                    return (<li key={label}>
                        {props.entries[label].content}
                        <CheckMark
                            checked={props.entries[label].checked}
                            onChange={props.entries[label].onChange}/>
                    </li>);
                            
                })
            }
        </ul>
    );
}

/* This is useful for initialization of state, since all of the
 * entries in the state object are false in the beginning.
 */
function makeFalseDict(keys) {
    let dict = {};
    for (let key of keys) {
        dict[key] = false;
    }
    return dict;
}

/* Takes an object which may have nested objects or arrays as values
 * and returns a 'flattened' object, which is an object whose values
 * are only simple values, like strings, or numbers.
 */
function makeFlatDict(object) {
    let joinChar = '/';
    function isSimpleValue(value) {
        //let simpleTypes = ['string', 'boolean', 'number', 'undefined'];
        //let isNull = value === null;
        //return simpleTypes.includes(typeof value) || isNull;
        return typeof value !== 'object' || value === null;
    }

    function flatten(toFlatten, objectSoFar, keyPrefix) {
        for (let key in toFlatten) {
            let value = toFlatten[key];
            if (isSimpleValue(value)) {
                objectSoFar[`${keyPrefix}${key}`] = value;
            } else {
                let newPrefix = `${keyPrefix}${key}${joinChar}`;
                flatten(value, objectSoFar, newPrefix);
            }
        }
    }
    let flattenedObject = {};
    flatten(object, flattenedObject, '');
    return flattenedObject;
}

function accessFlatDict(object, ...keys) {
    let joinChar = '/';
    let realKey = keys.join(joinChar);
    return object[realKey];
}

/* Takes an object whose structure is like:
 * {
 *      ...groups,
 *      groupName : {
 *          ...entries,
 *          entryLabel : content
 *          ...more entries,
 *      }
 *      ...more groups,
 * }
 * Takes renders each group in a CheckList. All of the groups are
 * mutually exclusive with one another. When an option in a group is
 * checked off, all options in every other group are shut off. 
 */
class MutuallyExclusiveChoices extends Component {
    constructor(props) {
        super(props);

        /* Unfortunately, the implementation of this component has
         * been made a little muddy by the fact that React doesn't
         * work well when you make its state a nested object (an
         * object that contains objects as values). To get around
         * this, I've had to 'flatten' the state object by turning
         * every reference like:
         *      state[group][entry] 
         * into: 
         *      state[`${group}/${entry}`]
         * It's an ugly hack, but at the very least, the semantics of
         * accessing this object aren't too different from accessing a
         * normal object, since I made functions for flattening the
         * object, and accessing the flattened object. Together, they
         * create an 'interface' to the flattened object, such that
         * code that depends on the flattened object doesn't have to
         * understand that it's flattened. It's just a detail, now.
         */
        let state = {};
        for (let groupLabel in props.entries) {
            state[groupLabel] = {};
            for (let entryLabel in props.entries[groupLabel]) {
                state[groupLabel][entryLabel] = false;
            }
        }
        this.state = makeFlatDict(state);

        this.checkEntry = this.checkEntry.bind(this);
    }

    checkEntry(group, label) {
        console.log(`Check ${label} of ${group}.`);

        let state = {};
        for (let groupLabel in this.props.entries) {
            let currentGroup = this.props.entries[groupLabel];
            if (groupLabel === group) {
                state[group] = {};
                state[group][label] = 
                    !accessFlatDict(this.state, group, label);
            } else {
                state[groupLabel] = makeFalseDict(Object.keys(currentGroup));
            }
        }
        this.setState(makeFlatDict(state));
    }

    render() {
        console.log(this.state);
        /* Make a copy of entries, since we're going to modify the
         * entries slightly in order to comply with CheckList.
         */
        let lists = {};
        for (let groupLabel in this.props.entries) {
            lists[groupLabel] = {};
            let group = this.props.entries[groupLabel];
            for (let entryLabel in group) {
                let content = group[entryLabel];
                lists[groupLabel][entryLabel] = {
                    content: content,
                    checked : accessFlatDict(this.state, groupLabel,
                                             entryLabel),
                    onChange : () => this.checkEntry(groupLabel, entryLabel)
                };
            }
        }

        console.log(lists);

        let checkLists = Object.keys(lists).map(groupLabel => {
            return <CheckList key={groupLabel} entries={lists[groupLabel]}/>;
        })

        return <div>{checkLists}</div>;
    }
}

export default MutuallyExclusiveChoices;
