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


const PlayHiddenCard = inject("store")(observer(({ store, onShow }) =>
  <Card className="bottomRight">
    <CardTitle
      title="Listen"
      subtitle={store.morse.playing ? "Playing..." : "Waiting..."}
    />
    <CardText>
      <p>Decode the text and press 'Show' when ready</p>
    </CardText>
    <CardActions centered>
      <Button
        raised
        primary
        onClick={onShow}
      >
        Show
      </Button>
    </CardActions>
  </Card>
))
PlayHiddenCard.propTypes = {
  onShow: PropTypes.func.isRequired,
}


const PlayVisibleCard = inject("store")(observer(({ store, text, onCorrect, onIncorrect }) =>
  <Card className="bottomRight">
    <CardTitle
      title="Listen"
      subtitle={store.morse.playing ? "Playing..." : "Waiting..."}
    />
    <CardText>
      <p>The text was: <b>{text}</b></p>
    </CardText>
    <CardActions centered>
      <Button
        raised
        primary
        onClick={onCorrect}
      >
        Correct
      </Button>
      <Button
        raised
        primary
        onClick={onIncorrect}
      >
        Incorrect
      </Button>
    </CardActions>
  </Card>
))
PlayVisibleCard.propTypes = {
  text: PropTypes.string.isRequired,
  onCorrect: PropTypes.func.isRequired,
  onIncorrect: PropTypes.func.isRequired,
}


const PlayText = inject("store", "morsePlayer")(observer(class PlayText extends Component {
  state = {
    hidden: true,
  }

  playText = () => {
    const { morsePlayer, text } = this.props;
    const { hidden } = this.state;

    if (hidden) {
      this.playCount++;
    }
    morsePlayer.playString(text);
  }

  playLoop = () => {
    if (!this.props.store.morse.playing) {
      if (this.playCount === 0) {
        this.playText();
      } else {
        this.timeout = setTimeout(this.playText, 2000);
      }
    }
  }

  start = () => {
    this.playCount = 0;
    this.autorun = autorun(this.playLoop);
  }

  stop = () => {
    this.autorun();
    clearTimeout(this.timeout);
    this.props.morsePlayer.forceStop();
  }

  componentWillMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.stop();
      this.setState({ hidden: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.text !== this.props.text) {
      this.start();
    }
  }

  onResult = success => {
    this.stop();
    this.props.onResult(success, this.playCount);
  }

  render() {
    if (this.state.hidden) {
      return <PlayHiddenCard onShow={() => this.setState({ hidden: false })} />
    } else {
      return <PlayVisibleCard
        text={this.props.text}
        onCorrect={() => this.onResult(true)}
        onIncorrect={() => this.onResult(false)}
      />
    }

  }
}))
PlayText.propTypes = {
  onResult: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}


const PlayLoop = inject("store")(class PlayLoop extends Component {
  state = {
    text: "",
    pattern: "",
  };

  pickText = () => {
    const { text, pattern } =  this.props.store.copyTrainer.generateText(this.state.pattern);
    this.setState({ text, pattern });
  }

  componentDidMount() {
    this.pickText();
  }

  onResult = (success, count) => {
    this.props.onResult(success, count);
    this.props.store.copyTrainer.patternFeedback(this.state.pattern, success, count);
    this.pickText();
  }

  render() {
    const { text } = this.state;
    return (
      <PlayText text={text} onResult={this.onResult} />
    )
  }
})
PlayLoop.propTypes = {
  wordLength: PropTypes.number.isRequired,
  onResult: PropTypes.func.isRequired,
};


const CopyTrainer = inject("store", "morsePlayer")(observer(class CopyTrainer extends Component {
  state = {
    active: false,
    ratio: 0,
    level: 1,
  }

  componentWillMount() {
    this.results = [];
  }

  start = () => {
    this.setState({ active: true });
  }

  stop = () => {
    this.props.morsePlayer.forceStop();
    this.setState({ active: false });
  }

  onResult = (success, repeats) => {
    if (this.results.push([success, repeats]) > 20) {
      this.results.shift();
    }
    const total = this.results.reduce((sum, value) =>
      [sum[0]+value[0], sum[1]+value[1]], [0, 0]);
    var ratio = (total[0] / total[1]) * 100;

    var { level } = this.state;
    if (this.results.length > 5) {
      if (ratio > 80) {
        level++;
        this.results = [];
        ratio = 0;
      } else if (ratio < 20 && level > 1) {
        level--;
        this.results = [];
        ratio = 0;
      }
    }
    this.setState({ ratio, level });
  }

  render () {
    const { active, ratio, level } = this.state;

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

    return (
      <div>
        <Card>
          <CardTitle title="Copy Trainer" subtitle={"Level " + level} />
          <CardText>
            <p>Success ratio: {ratio.toFixed()}%</p>
          </CardText>
          <CardActions centered>
            {button}
          </CardActions>
        </Card>
        {active && <PlayLoop wordLength={level} onResult={this.onResult} />}
      </div>
    )
  }
}))

export default CopyTrainer;
