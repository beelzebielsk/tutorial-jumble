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


function ArithmeticProgression(start, stepSize, steps) {
    return Array(steps).fill(0).reduce(
        (prev, _, index) => {prev[index] = start + index*stepSize; return prev;},
        []
    );
}
function Element(props) {
    let style = {
        position : 'absolute',
        top : props.top,
        border : "solid #333",
        padding : "10px",
        transitionProperty : "top",
        transitionDuration : (props.transitionDuration ?
            `${props.transitionDuration}s` : ".2s") ,
    }
    return <span style={style}>{props.children}</span>
}
function ShowList(props) {
    let items = [];
    let {list, positions, spacing, transitionDuration} = props;
    if (spacing) {
        positions = 
            ArithmeticProgression(0, spacing, list.length)
            .map(num => `${num}px`);
    }
    //console.log("Spacing:", spacing);
    //console.log(list);
    //console.log("Positions", positions);
    for (let i = 0; i < list.length; i++) {
        items.push(
            <Element 
                key={i} 
                top={positions[i]}
                transitionDuration={transitionDuration}>
            {list[i]}</Element>);
    }
    return <div className="list" position="relative">{items}</div>;
}

/* swap and test should be properties of this */
/* I can try to make this element aware of the heights of the
 * contained elements. I can position the elements relative to the top
 * of the containing <List> element.
 */
class List extends Component {
    constructor(props) {
        super(props);
        let positions = ArithmeticProgression(0, 50, props.list.length);
        /* A list where each element is an index into props.list. */
        let argsortList = ArithmeticProgression(0, 1, props.list.length);
        this.state = {
            argsortList : argsortList,
            positions : positions,
            done : false
        };
        this.actions = bubbleSort(
            [...props.list], this.props.test, this.props.swap
        );
        this.doAction = this.doAction.bind(this);
        /* Will use these to check if there are any transitions
         * happening.
         */
        this.activeTransitions = 0;
        window.addEventListener('transitionend', () => {
            console.log('transitionend', this.activeTransitions);
            this.activeTransitions--;
            // 2, because swaps involve moving two objects (unless we
            // swap an element with itself, in which case this code
            // breaks. But that shouldn't happen.
            if (this.activeTransitions == -2) {
                this.activeTransitions = 0;
                console.log(this.activeTransitions);
                this.doAction();
            }
        });
    }

    componentDidMount() {
        console.log('Component Mounted');
        console.log('Component Finished Mounting');
        /* Have to leave time for the component to fully render, so
         * that the swapping of elements during doAction causes a CSS
         * transition.
         */
        window.setTimeout(this.doAction, 500);
    }

    /* This is going to do a test through the argsort list */
    test(i, j) {
        let {argsortList} = this.state;
        let {list} = this.props;
        let result = this.props.test(
            list[argsortList[i]], list[argsortList[j]]);
        this.setState({});
    }

    /* This is going to force the position change, and keep an argsort
     * list */
    swap(i, j) {
        let argsortList = [...this.state.argsortList];
        let positions = [...this.state.positions];
        this.props.swap(argsortList, i, j);
        //this.props.swap(positions, i, j);
        this.props.swap(positions, argsortList[i], argsortList[j]);
        this.setState({argsortList, positions});
    }

    doAction() {
        let nextAction;
        /* Right now, doAction has to force a CSS transition to occur,
         * and tests don't cause those. Only swaps do.*/
        while (true) {
            nextAction = this.actions.next();
            if (nextAction.done) {
                this.setState({done:true});
                return;
            }
            if (nextAction.value[0] == 'swap')
                break;
        }
        nextAction = nextAction.value;
        if (nextAction[0] == 'test') {
            this.test(nextAction[1], nextAction[2]);
        } else if (nextAction[0] == 'swap') {
            this.swap(nextAction[1], nextAction[2]);
        }
    }

    render () {
        let {positions} = this.state;
        let {list} = this.props;
        //console.log(positions);
        let listComponent = (
            <ShowList 
                list={list} 
                positions={positions}
                transitionDuration={.3}/>);
        if (!this.state.done) {
            return listComponent;
        }
        return (
            <div>
                <div>
                    {listComponent}
                </div>
                <div>
                    "Done!"
                </div>
            </div>
        );
    }
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
                list={[10,9,8,7,6,5,4,3,2,1]}
                test={test}
                swap={swap}/>
        </div>
    );
  }
}

export default App;


