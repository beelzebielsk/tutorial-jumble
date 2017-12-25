import React, { Component } from 'react';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cat: true,
            dog: true,
            neither: true,
        };

        this.checkDog = this.checkDog.bind(this);
        this.checkCat = this.checkCat.bind(this);
        this.checkNeither = this.checkNeither.bind(this);
    }

    checkDog() {
        console.log("Check Dog.");
        this.setState({
            dog: !this.state.dog,
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
                        onClick={this.checkCat}/> 
                </li>
                <li>{"I like dogs (I'm gonna blow my brains out)"}
                    <CheckMark 
                        checked={this.state.dog} 
                        onClick={this.checkDog}/> 
                </li>
                <li>{"I like neither (the truth... feels good"}
                    <CheckMark 
                        checked={this.state.neither} 
                        onClick={this.checkNeither}/> 
                </li>
            </ul>
        );
    }
}

export default List;
