import React, { Component } from 'react';
import Link from './components/Link';
import Route from './components/Route';
import { history } from './components/history';

const BrowserRouter = (props) => {
    return props.children;
}


const SpecialMessage = () => {
    return <p>I'm special!</p>;
}

const styles = {
    fontFamily: 'sans-serif',
    display: 'block'
};

class StatefulComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        };
        this.increment = this.increment.bind(this);
        let { name } = this.props;
        console.log(`${name} has been constructed.`);
    }
    componentWillUnmount() {
        let { name } = this.props;
        let { counter } = this.state;
        console.log(`${name} has been destroyed. Had state ${counter}.`);
    }
    increment() {
        this.setState({
        counter: this.state.counter + 1
        })
    }
    render() {
        let { name } = this.props;
        let { counter } = this.state;
        console.log(`${name} has been rendered. Has state ${counter}.`);
        return (
            <div>
                <p>
                    Current counter value from {name}:
                    {this.state.counter}
                </p>
                <button 
                    style={styles} 
                    onClick={this.increment}>
                    up
                </button>
                {this.props.children}
            </div>
        )
    }
}

class Page extends Component {
  render() {
      return (
          <div>
          <StatefulComponent name="top-level">
            <p><Link to="/1">Show Stateful Component</Link></p>
            <p><Link to="/2">Show Stateless Component</Link></p>
          
            <hr/>

            <Route path="/1" component={StatefulComponent} />
            <Route path="/2" component={SpecialMessage} />
          </StatefulComponent>
          </div>
      );
  }
}

const App = () => {
    return (
        <BrowserRouter>
            <Page />
        </BrowserRouter>
    );

}

export default App;

/* This is also located at: <https://codesandbox.io/s/3y8zw2r1r5>.
 * Usage of history package based on:
 * - <https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d>
 * - <https://www.npmjs.com/package/history>
 *
 * React Router Repository:
 * <https://github.com/ReactTraining/react-router>
 */
