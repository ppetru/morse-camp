import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import {
  Button,
  Paper
} from 'react-md';

import MorsePlayer from './MorsePlayer';

const StartStep = observer(class StartStep extends Component {
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
})
StartStep.propTypes = {
}

const PlayStep = (class PlayStep extends Component {
  pickWord() {
    return "hi";
  }

  componentDidMount() {
    this.props.store.morseText = this.pickWord();
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
        >
          Skip
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
})
PlayStep.propTypes = {
}

const ShowStep = observer(class ShowStep extends Component {
  render() {
    return (
      <div>
        <h1>The word was: {this.props.store.morseText}</h1>
        <Button
          raised
          primary
          onClick={this.props.store.start}
        >
          Correct
        </Button>
        <Button
          raised
          primary
          onClick={this.props.store.start}
        >
          Incorrect
        </Button>
      </div>
    )
  }
})
ShowStep.propTypes = {
}

const Worder = observer(class Worder extends Component {
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
        <div className="">
          {step}
        </div>
      </Paper>
    )
  }
})
  /*
        <MorsePlayer
          speed={30}
          frequency={500}
          message={this.state.morseText}
          audioContext={new (window.AudioContext || window.webkitAudioContext)()}
        />
        */

export default Worder;
