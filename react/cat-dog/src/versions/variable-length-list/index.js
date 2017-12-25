import React, { Component } from 'react';

import List from './List'

let entries = {
    cat : "I like cats (fuck that).",
    dog : "I like dogs (I'm a compulsive liar).",
    iguana : "Iguanas are okay.",
    'komodo dragon' : "Komodo dragons? Where!?",
}

class App extends Component {
  render() {
      return <List entries={entries} none="I hate them all."/>
  }
}

export default App;
