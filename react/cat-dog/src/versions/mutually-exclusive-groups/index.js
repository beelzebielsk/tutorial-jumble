import React, { Component } from 'react';

import MutuallyExclusiveChoices from './List'

let entries = {
    'like' : {
        cat    : "I like cats (fuck that).",
        dog    : "I like dogs (I'm a compulsive liar).",
        iguana : "Iguanas are okay.",
    },
    'neutral' : {
        mildLike    : "I'm not bothered by animals.",
        trueNeutral : "I don't care about animals.",
        mildDislike : "I can tolerate animals.",
    },
    'hate' : {
        mildHate : "I don't like animals.",
        hate     : "I'd be happy if I never had to see an anmial again.",
        trueHate : "Lemme clean the puppy blood off my hands first " +
                   "then I'll answer your question.",
    }
}

class App extends Component {
  render() {
      return <MutuallyExclusiveChoices entries={entries}/>;
  }
}

export default App;
