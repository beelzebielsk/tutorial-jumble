import React, { Component } from 'react';

function CheckMark(props) {
    return (
        <input 
            type="checkbox" 
            checked={props.checked} 
            onChange={props.onChange}/>
    );
}

class List extends Component {
    constructor(props) {
        super(props);
        /* I keep track of the states of the checkboxes in this react
         * component. Notice that the checkboxes themselves don't hold
         * their own state: the list tells the checkboxes what they
         * ought to do based on the List's state. It's easier to
         * program this way. With all related state in one place, its
         * easier to check the state of more than one thing at once
         * (which we do), and you know where the state information is
         * coming from. That's the React gospel, at least.
         */
        this.state = {
            cat: false,
            dog: false,
            neither: false,
        };

        /* You have to do these things when you're going to pass
         * around the methods of your object as callbacks, and the
         * methods themselves use `this`.
         */
        this.checkDog = this.checkDog.bind(this);
        this.checkCat = this.checkCat.bind(this);
        this.checkNeither = this.checkNeither.bind(this);
    }

    checkDog() {
        console.log("Check Dog.");
        this.setState({
            /* This toggles the state of the checkbox, which is what
             * you actually want. If the box is checked, and you click
             * the box again, you want the check to disappear. So you
             * want the state of the box to be the opposite of what it
             * was before. This is known as a "toggle", and this is
             * pretty much how you express toggling.
             */
            dog: !this.state.dog,
            /* Toggling the dog's state also had te effect of setting
             * neither to unchecked-- regardless of its current state.
             * If neither is unchecked, then it will stay unchecked
             * (which is fine), and if neither is checked then it will
             * become unchecked (which is what we want).
             *
             * Note that the above behavior is technically wrong if it
             * were the case that both dog and neither were checked at
             * the same time. I'm not worrying about that case because
             * the only possible way for it to happen is for dog and
             * neither to start checked. There's no possible way to
             * navigate to that state otherwise (theoretically).
             */
            neither: false,
        });
    }

    checkCat() {
        console.log("Check Cat.");
        this.setState({
            cat: !this.state.cat,
            neither: false,
        });
    }

    checkNeither() {
        console.log("Check Neither.");
        this.setState({
            cat: false,
            dog: false,
            neither: !this.state.neither,
        });
    }

    render() {
        console.log(this.state);
        return (
            <ul>
                <li>{"I like cats (who am I kidding?)"}
                    <CheckMark 
                        checked={this.state.cat} 
                        onChange={this.checkCat}/> 
                </li>
                <li>{"I like dogs (I'm gonna blow my brains out)"}
                    <CheckMark 
                        checked={this.state.dog} 
                        onChange={this.checkDog}/> 
                </li>
                <li>{"I like neither (the truth... feels good"}
                    <CheckMark 
                        checked={this.state.neither} 
                        onChange={this.checkNeither}/> 
                </li>
            </ul>
        );
    }
}

class App extends Component {
  render() {
      return <List />
  }
}

export default App;
