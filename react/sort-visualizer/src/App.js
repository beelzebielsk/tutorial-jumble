import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function* bubbleSort(array, test, swap) {
    let length = array.length;
    for (let end = length - 1; end > 0 ; end--) {
        for (let i = 0; i < end; i++) {
            yield ['test', i, i+1];
            if (test(array[i], array[i+1]) < 0 ) {
                swap(array, i, i+1);
                yield ['swap', i, i+1];
            }
        }
    }
}


function ShowList(props) {
    let items = props.list.map(
        elem => <span className="item">{elem}</span>);
    return <div className="list">{items}</div>;
}

/* swap and test should be properties of this */
/* I can try to make this element aware of the heights of the
 * contained elements. I can position the elements relative to the top
 * of the containing <List> element.
 */
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list : props.list,
            done : false
        };
        this.actions = bubbleSort(
            [...props.list], this.props.test, this.props.swap
        );
        this.doAction = this.doAction.bind(this);
        console.log(this.state);
    }

    test(i, j) {
        let {list} = this.state;
        let result = this.props.test(list[i], list[j]);
        this.setState({});
    }
    swap(i, j) {
        let list = [...this.state.list];
        let temp = list[j];
        list[j] = list[i];
        list[i] = temp;
        this.setState({list});
    }

    doAction() {
        let nextAction = this.actions.next();
        if (nextAction.done) {
            this.setState({done:true});
            return;
        }
        nextAction = nextAction.value;
        if (nextAction[0] == 'test') {
            this.test(nextAction[1], nextAction[2]);
        } else if (nextAction[0] == 'swap') {
            this.swap(nextAction[1], nextAction[2]);
        }
    }
    render () {
        let list = <ShowList list={this.state.list}/>;
        if (!this.state.done) {
            window.setTimeout(this.doAction, 400);
            return list;
        }
        return (
            <div>
                {list}
                "Done!"
            </div>
        );
    }
    /*

    */


}

function swap(array, i, j) {
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
}

function test(elem1, elem2) {
    return elem2 - elem1;
}

class App extends Component {
  render() {
    return (
        <div>
            <List
                list={[5,4,3,2,1]}
                test={test}
                swap={swap}/>
        </div>
    );
  }
}

export default App;
