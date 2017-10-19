import React, { Component } from 'react';

import './App.css';
import Worder from './Worder';

class App extends Component {
  render() {
    return (
      <Worder store={this.props.store} />
    );
  }
}

export default App;
