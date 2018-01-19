import React, { Component } from 'react';
import './App.css';

const printAttributes = (event) => {
    console.log("The element that was clicked on and had this event listener:");
    console.log(event.currentTarget);
    let attributes;
    if (event.currentTarget.hasAttributes()) {
        attributes = event.currentTarget.attributes;
        console.log("The collection of attributes on the element:");
        // How to search through all of the attributes. Attributes can
        // be indexed both with numbers, and with the name of the
        // attribute. Here, we index with numbers.
        // NOTE: Despite having a `length` property, and being
        // indexable with numbers, `attributes` is not an array, so
        // you cannot use array methods/properties with it.
        for (let i = 0; i < attributes.length; i++) {
            console.log(`${attributes[i].name} : ${attributes[i].value}`);
        }
    }

};

const printWackyProp = (event) => {
    // Accessing a specific attribute of an element.
    console.log("Value of the wackyprop attribute, specifically:",
                event.currentTarget.attributes.wackyprop.value);
}

// This is a component that just places a special onClick function on
// onto a div, and then places all the passed properties onto the div,
// and puts all the passed children into the div.
//
// I could have done this by specifying some "master list" of
// properties and extracting those properties from props, and placing
// each of them onto the returned <div>, but using the spread operator
// with props is another way.
const NewComponent = (props) => {
    return <div onClick={printAttributes} {...props}>{props.children}</div>;
};

const CustomAttributeComponent = () => {
    return (
        <div 
            onClick={event => {printAttributes(event); printWackyProp(event);} } 
            wackyprop="some value" 
            anypropnameatall="another value">
            some children text
        </div>
    );
}

class App extends Component {
  render() {
    return (
        <div>
            <h4 style={{"maxWidth": "30em"}}>
                To create custom properties on an XHTML element from
                React, you must place the property on the component like any
                other property, but the property name must be all lowercase
                letters.
            </h4>

            <CustomAttributeComponent/>
            <NewComponent>
                Plain Component
            </NewComponent>
            <NewComponent id={1}>
                Component 1
            </NewComponent>
            <NewComponent id={2}>
                Component 2
            </NewComponent>
            <NewComponent id={3} wackyprop="hey">
                Component 3
            </NewComponent>
            <NewComponent id={4} wackyprop={{a:1}}>
                Component 4
            </NewComponent>
            <NewComponent id={5} wackyprop="a string" anypropnameatall={[1, 2, 3]}>
                Component 5
            </NewComponent>
        </div>
    );
  }
}

export default App;
