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
import MorsePlayer from './MorsePlayer';
import WORDS from './words';

const StartStep = inject("store")(observer(({ store }) =>
  <Card className="bottomRight">
    <CardTitle
      title="Get ready to listen"
    />
    <CardActions centered>
      <Button
        raised
        primary
        onClick={store.copyTrainer.playStep}
      >
        Start
      </Button>
    </CardActions>
  </Card>
))

const QuitButton = inject("store")(observer(({ store }) =>
  <Button
    raised
    primary
    onClick={() => {
      store.morse.requestStopPlaying();
      store.copyTrainer.startStep()
    }}
  >
    Quit
  </Button>
))

const PlayStep = inject("store")(observer(class PlayStep extends Component {
  pickWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  playWord = () => {
    const { store } = this.props;
    if (store.copyTrainer.isPlaying) {
      this.playCount++;
    }
    store.morse.playText(this.word);
  }

  resetWord = () => {
    this.word = null;
    this.playCount = 0;
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
    this.resetWord();
    this.correctCount = 0;
    this.repeatCount = 0;
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
    const { store } = this.props;

    this.repeatCount += this.playCount;
    if (success) {
      this.correctCount++;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.resetWord();
    store.copyTrainer.playStep();
    if (store.morse.playing) {
      store.morse.requestStopPlaying();
    } else {
      this.autoPlay();
    }
  }

  render() {
    const { store } = this.props;
    let actions, text;

    if (store.copyTrainer.step === "play") {
      actions = (
        <CardActions centered>
          <Button
            raised
            primary
            onClick={store.copyTrainer.showStep}
          >
            Show
          </Button>
          <QuitButton />
        </CardActions>
      )
      text = <p>Decode the text press 'Show' when ready</p>
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
          <QuitButton />
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
          <ul>
            <li>Correct: {this.correctCount}</li>
            <li>Repeats: {this.repeatCount}</li>
            <li>Ratio: {this.correctCount / this.repeatCount}</li>
          </ul>
        </CardText>
        {actions}
      </Card>
    )
  }
}))

const CopyTrainer = inject("store")(observer(({ store }) => {
  let step;
  switch (store.copyTrainer.step) {
      case "start":
        step = <StartStep />
        break;
      case "play":
      case "show":
        step = <PlayStep />
        break;
      default:
  }
  return (
    <div className="md-grid">
      <MorsePlayer
        speed={30}
        frequency={500}
      />
      <div>
        {step}
      </div>
    </div>
  )
}))

export default CopyTrainer;
