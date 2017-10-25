import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';

import {
  Button,
} from 'react-md';

import './Worder.css';
import MorsePlayer from './MorsePlayer';
import WORDS from './words';

const StartStep = inject("store")(observer(({ store }) =>
  <div>
    <h1>Get ready to listen</h1>
    <div className="bottomRight">
      <Button
        raised
        primary
        onClick={store.playStep}
      >
        Start
      </Button>
    </div>
  </div>
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

const PlayingButtons = inject("store")(observer(({ store }) =>
  <div>
    <div className="bottomRight">
      <Button
        raised
        primary
        onClick={store.showStep}
      >
        Show
      </Button>
      <QuitButton />
    </div>
  </div>
))

const PlayingStatus = inject("store")(observer(({ store }) => (
  store.playing ? <h1>Playing...</h1>
                : <h1>Waiting...</h1>
)))

const ShowStep = inject("store")(observer(({ store, word, resultCallback }) => (
  <div>
    <h1>The word is: {word}</h1>
    <div className="bottomRight">
      <Button
        raised
        primary
        onClick={() => resultCallback(true)}
      >
        Correct
      </Button>
      <Button
        raised
        primary
        onClick={() => resultCallback(false)}
      >
        Incorrect
      </Button>
      <QuitButton />
    </div>
  </div>
)))
ShowStep.propTypes = {
  word: PropTypes.string.isRequired,
  resultCallback: PropTypes.func.isRequired,
}

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
    let content;
    if (this.props.store.step === "play") {
      content = <PlayingButtons />
    } else {
      content = <ShowStep word={this.word} resultCallback={this.onResult} />
    }
    return (
      <div>
        <PlayingStatus />
        {content}
      </div>
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
