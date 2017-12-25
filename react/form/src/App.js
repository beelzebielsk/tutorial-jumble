import React, { Component } from 'react';

function Input(props) {
    return (
        <label>
            {`${props.label}: `}
            <input
                type="text"
                name={props.name}
                value={props.value}
                onChange={props.onChange}/>
        </label>
    );
}

//`

function RadioButtons(props) {
    let options = props.options.map(option => {
        console.log(option, props.checkedOption,
                    option === props.checkedOption);
        return (
            <label>
                {option}
                <input 
                    type="radio"
                    name={props.name}
                    value={option}
                    checked={option === props.checkedOption}
                    onChange={props.onChange}/>
            </label>
        );
    });
    return <div>{options}</div>
}

/* An example of properties for HTML selects:
 * https://www.w3schools.com/TAGS/tryit.asp?filename=tryhtml5_select_form
 */
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

function validEmail(email) {
    let emailExpression = /[\w-]+@[\w-]+\.\w+/;
    // ldh stands for letter, digit, hyphen.
    let ldh = "[\\w-]";

    //let emailExpresion = RegExp(`^${name}@${domain}$$`);
    return emailExpression.test(email);
}

class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            confirm: "",
            rating: "",
            identity: "",
            submitted: false
        }
    }

    onFormChange = (event, field) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.value);
        console.log(event.target.name);
        this.setState({
            [field] : event.target.value,
        });
    }

    incompleteSubmit = () => {
        alert("Please finish the form by following the directions!");
    }

    onSubmit = () => {
        console.log("Submitting...");
        this.setState({submitted: true});
    }

    render() {
        let ratings = ["1", "2", "3", "4", "5"];
        let identities = ["yes", "no", "maybe"];
        let instructions = [];
        console.log(this.state);
        let formState = this.state;
        if (formState.email === "") {
            instructions.push("Type in an email.");
        }
        if (formState.confirm !== formState.email) {
            instructions.push(
                "Your confirmation email must match your email!");
        }
        if (!validEmail(formState.email)) {
            instructions.push("You have not typed in a valid email.");
        }
        if (!formState.rating) {
            instructions.push("Choose a rating for liking cats!");
        }
        if (!formState.identity) {
            instructions.push("Decide on your identity in drop-down menu.");
        }

        let renderedInstructions = instructions.map(instruction => {
            return <li>{instruction}</li>
        });

        let submitFunction = (instructions.length === 0 ?
                              this.onSubmit :
                              this.incompleteSubmit);


        let recap = (
            <ul>
                <li>Your email is: {this.state.email}</li>
                <li>On a scale of 1 to 5, you rate your love of cats at
                    {" "} {formState.rating}. </li>
                <li>
                    {formState.identity === "yes" ? "You are a cat."      :
                    formState.identity === "maybe" ? "You may be a cat." :
                    formState.identity === "no" ? "You are not a cat."   :
                    "You are... something else. Something not of this list."}
                </li>
            </ul>
        );

        return (
            <div>
                <Input
                    label="Email"
                    name="email"
                    value={this.state.email}
                    onChange={(event) => this.onFormChange(event, "email")}/>
                <Input
                    label="Confirm Email"
                    name="confirm"
                    value={this.state.confirm}
                    onChange={(event) => this.onFormChange(event, "confirm")}/>
                <RadioButtons 
                    options={ratings}
                    name="rating"
                    checkedOption={this.state.rating}
                    onChange={(event) => this.onFormChange(event, "rating")}/>
                <Select
                    name="identity"
                    options={identities}
                    checkedOption={this.state.identity}
                    onChange={(event) => this.onFormChange(event, "identity")}/>
                <button
                    name="submitted"
                    onClick={submitFunction}>
                        Submit
                </button>
                        

            <ul>{renderedInstructions}</ul>
            {this.state.submitted ? recap : ""}
            </div>
        );
    }
}

export default Form;
