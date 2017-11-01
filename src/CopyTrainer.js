import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';

import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
} from 'react-md';

import './CopyTrainer.css';
import WORDS from './words';


const PlayLoop = inject("store", "morsePlayer")(observer(class PlayLoop extends Component {
  state = {
    hidden: true,
  }

  pickWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  playWord = () => {
    if (this.state.hidden) {
      this.playCount++;
    }
    this.props.morsePlayer.playString(this.word);
  }

  resetWord = () => {
    this.word = null;
    this.playCount = 0;
    this.setState({ hidden: true });
  }

  autoPlay = () => {
    if (!this.props.store.morse.playing) {
      if (this.word === null) {
        this.word = this.pickWord();
        this.playWord();
      } else {
        this.timeout = setTimeout(this.playWord, 2000);
      }
    }
  }

  componentDidMount() {
    this.setState({ hidden: true });
    this.resetWord();
    this.timeout = null;
    this.autorun = autorun(this.autoPlay);
  }

  componentWillUnmount() {
    this.autorun();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onResult = success => {
    const { store, morsePlayer, onResult } = this.props;

    onResult(success, this.playCount);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.resetWord();
    if (store.morse.playing) {
      morsePlayer.forceStop();
    } else {
      this.autoPlay();
    }
  }

  render() {
    const { store } = this.props;
    const { hidden } = this.state;
    let actions, text;

    if (hidden) {
      actions = (
        <CardActions centered>
          <Button
            raised
            primary
            onClick={() => this.setState({ hidden: false })}
          >
            Show
          </Button>
        </CardActions>
      )
      text = <p>Decode the text and press 'Show' when ready</p>
    } else {
      actions = (
        <CardActions centered>
          <Button
            raised
            primary
            onClick={() => this.onResult(true)}
          >
            Correct
          </Button>
          <Button
            raised
            primary
            onClick={() => this.onResult(false)}
          >
            Incorrect
          </Button>
        </CardActions>
      )
      text = <p>The text was: <b>{this.word}</b></p>
    }
    return (
      <Card className="bottomRight">
        <CardTitle
          title="Listen"
          subtitle={store.morse.playing ? "Playing..." : "Waiting..."}
        />
        <CardText>
          {text}
        </CardText>
        {actions}
      </Card>
    )
  }
}))
PlayLoop.propTypes = {
  onResult: PropTypes.func.isRequired,
};

const CopyTrainer = inject("store", "morsePlayer")(observer(class CopyTrainer extends Component {
  state = {
    active: false,
    repeatCount: 0,
    correctCount: 0,
  }

  start = () => {
    this.setState({ active: true });
  }

  stop = () => {
    this.props.morsePlayer.forceStop();
    this.setState({ active: false });
  }

  onResult = (success, repeats) => {
    this.setState((prevState, props) => ({
      repeatCount: prevState.repeatCount + repeats,
      correctCount: prevState.correctCount + (success ? 1 : 0),
    }))
  }

  render () {
    const { store } = this.props;
    const { active, repeatCount, correctCount } = this.state;

    var button;
    if (active) {
      button = <Button raised primary onClick={this.stop}>
        Stop
      </Button>
    } else {
      button = <Button raised primary onClick={this.start}>
        Start
      </Button>
    }

    const ratio = (correctCount / repeatCount) * 100;

    return (
      <div>
        <Card>
          <CardTitle title="Copy Trainer" />
          <CardText>
            <p>Success ratio: {ratio.toFixed()}%</p>
          </CardText>
          <CardActions centered>
            {button}
          </CardActions>
        </Card>
        {active && <PlayLoop onResult={this.onResult} />}
      </div>
    )
  }
}))

export default CopyTrainer;
