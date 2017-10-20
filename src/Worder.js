import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
  Button,
  Paper
} from 'react-md';

import MorsePlayer from './MorsePlayer';

const StartStep = inject("store")(observer(class StartStep extends Component {
  render() {
    return (
      <div>
        <h1>Get ready to listen</h1>
        <Button
          raised
          primary
          onClick={this.props.store.play}
        >
          Start
        </Button>
      </div>
    )
  }
}))
StartStep.propTypes = {
}

const PlayStep = inject("store")(observer(class PlayStep extends Component {
  pickWord() {
    return "hi";
  }

  componentDidMount() {
    this.props.store.playText(this.pickWord());
  }

  render() {
    return (
      <div>
        <h1>Playing...</h1>
        <Button
          raised
          primary
          onClick={this.props.store.show}
        >
          Show
        </Button>
        <Button
          raised
          primary
          onClick={this.props.store.start}
        >
          Stop
        </Button>
      </div>
    )
  }
}))
PlayStep.propTypes = {
}

const ShowStep = inject("store")(observer(class ShowStep extends Component {
  render() {
    return (
      <div>
        <h1>The word was: {this.props.store.morseText}</h1>
        <Button
          raised
          primary
          onClick={this.props.store.play}
        >
          Correct
        </Button>
        <Button
          raised
          primary
          onClick={this.props.store.play}
        >
          Incorrect
        </Button>
      </div>
    )
  }
}))
ShowStep.propTypes = {
}

const Worder = inject("store")(observer(class Worder extends Component {
  render() {
    var step;
    switch (this.props.store.step) {
        case "start":
          step = <StartStep store={this.props.store} />
          break;
        case "play":
          step = <PlayStep store={this.props.store} />
          break;
        case "show":
          step = <ShowStep store={this.props.store} />
          break;
        default:
    }
    return (
      <Paper zDepth={2} className="md-grid">
        <MorsePlayer
          speed={30}
          frequency={500}
        />
        <div className="">
          {step}
        </div>
      </Paper>
    )
  }
}))

export default Worder;
