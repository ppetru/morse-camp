import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Paper
} from 'react-md';

import MorsePlayer from './MorsePlayer';

class StartStep extends Component {
  render() {
    return (
      <Button
        raised
        primary
        onClick={this.props.onStateChange}
      >
        Start
      </Button>
    )
  }
}
StartStep.propTypes = {
  onStateChange: PropTypes.func.isRequired,
}

class PlayStep extends Component {
  pickWord() {
    return "hi";
  }

  componentDidMount() {
    const word = this.pickWord();
    this.setState({ word })
    this.props.setMorse(word);
  }

  render() {
    return (
      <div>
        <Button
          raised
          primary
          onClick={this.props.onStateChange}
        >
          Show
        </Button>
        <Button
          raised
          primary
          onClick={this.props.onStateChange}
        >
          Show
        </Button>
        <Button
          raised
          primary
          onClick={this.props.onStateChange}
        >
          Stop
        </Button>
      </div>
    )
  }
}
PlayStep.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  setMorse: PropTypes.func.isRequired,
}

class Worder extends Component {
  state = {
    morseText: "",
    flowStep: "start",
  };

  render() {
    var step;
    switch (this.state.flowStep) {
        case "start":
          step = <StartStep onStateChange={() => this.setState({flowStep: "play"})} />
          break;
        case "play":
          step = <PlayStep
                  onStateChange={(step) => this.setState({flowStep: step})}
                  setMorse={(text) => this.setState({morseText: text})}
                />
          break;
        default:
    }
    return (
      <Paper zDepth={2} className="md-grid">
        <MorsePlayer
          speed={30}
          frequency={500}
          message={this.state.morseText}
          audioContext={new (window.AudioContext || window.webkitAudioContext)()}
        />
        <div className="">
          {step}
        </div>
      </Paper>
    )
  }
}

export default Worder;
