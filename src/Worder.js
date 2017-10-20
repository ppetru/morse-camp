import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';

import {
  Button,
  Paper
} from 'react-md';

import MorsePlayer from './MorsePlayer';

const StartStep = inject("store")(observer(({ store }) =>
  <div>
    <h1>Get ready to listen</h1>
    <Button
      raised
      primary
      onClick={store.play}
    >
      Start
    </Button>
  </div>
))

const PlayingButtons = inject("store")(observer(({ store }) =>
  <div>
    <Button
      raised
      primary
      onClick={store.show}
    >
      Show
    </Button>
    <Button
      raised
      primary
      onClick={store.start}
    >
      Stop
    </Button>
  </div>
))

const PlayingStatus = inject("store")(observer(({ store }) => (
  store.playing ? <h1>Playing...</h1>
                : <h1>Waiting...</h1>
)))

const ShowStep = inject("store")(observer(({ store, word }) => (
  <div>
    <h1>The word is: {word}</h1>
    <Button
      raised
      primary
      onClick={store.play}
    >
      Correct
    </Button>
    <Button
      raised
      primary
      onClick={store.play}
    >
      Incorrect
    </Button>
    <Button
      raised
      primary
      onClick={store.start}
    >
      Stop
    </Button>
  </div>
)))
ShowStep.propTypes = {
  word: PropTypes.string.isRequired,
}

const PlayStep = inject("store")(observer(class PlayStep extends Component {
  pickWord = () => {
    return "e";
  }

  componentDidMount() {
    this.word = null;
    this.timeout = null;
    this.autorun = autorun(() => {
      if (!this.props.store.playing) {
        if (this.word === null) {
          this.word = this.pickWord();
          this.props.store.playText(this.word);
        } else {
          this.timeout = setTimeout(() => this.props.store.playText(this.word), 1000);
        }
      }
    });
  }

  componentWillUnmount() {
    this.autorun();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    let content;
    if (this.props.store.step === "play") {
      content = <PlayingButtons />
    } else {
      content = <ShowStep word={this.word} />
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
}))

export default Worder;
