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

import './Worder.css';
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
        onClick={store.playStep}
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
      store.requestStopPlaying();
      store.startStep()
    }}
  >
    Quit
  </Button>
))

const PlayStep = inject("store")(observer(class PlayStep extends Component {
  pickWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  autoPlay = () => {
    if (!this.props.store.playing) {
      if (this.word === null) {
        this.word = this.pickWord();
        this.props.store.playText(this.word);
      } else {
        this.timeout = setTimeout(() => this.props.store.playText(this.word), 1000);
      }
    }
  }

  componentDidMount() {
    this.word = null;
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
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.word = null;
    this.props.store.playStep();
    if (this.props.store.playing) {
      this.props.store.requestStopPlaying();
    } else {
      this.autoPlay();
    }
  }

  render() {
    const { store } = this.props;
    let actions, text;

    if (store.step === "play") {
      actions = (
        <CardActions centered>
          <Button
            raised
            primary
            onClick={store.showStep}
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
          subtitle={store.playing ? "Playing..." : "Waiting..."}
        />
        <CardText>
          {text}
        </CardText>
        {actions}
      </Card>
    )
  }
}))

const Worder = inject("store")(observer(({ store }) => {
  let step;
  switch (store.step) {
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

export default Worder;
