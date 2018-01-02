import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  DialogContainer,
  TextField
} from "react-md";

import { wordsBySize } from "./Words";
import { generateText } from "./TextGenerator";

import "./ReadTrainer.css";

const PlayHiddenCard = inject("store")(
  observer(({ store, onShow }) => (
    <Card className="bottomRight">
      <CardTitle
        title="Listen"
        subtitle={store.morse.playing ? "Playing..." : "Waiting..."}
      />
      <CardText>
        <p>Decode the text and press 'Show' when ready</p>
      </CardText>
      <CardActions centered>
        <Button raised primary onClick={onShow}>
          Show
        </Button>
      </CardActions>
    </Card>
  ))
);
PlayHiddenCard.propTypes = {
  onShow: PropTypes.func.isRequired
};

const PlayVisibleCard = inject("store")(
  observer(({ store, text, onCorrect, onIncorrect }) => (
    <Card className="bottomRight">
      <CardTitle
        title="Listen"
        subtitle={store.morse.playing ? "Playing..." : "Waiting..."}
      />
      <CardText>
        <p>
          The text was: <b>{text}</b>
        </p>
      </CardText>
      <CardActions centered>
        <Button raised primary onClick={onCorrect}>
          Correct
        </Button>
        <Button raised primary onClick={onIncorrect}>
          Incorrect
        </Button>
      </CardActions>
    </Card>
  ))
);
PlayVisibleCard.propTypes = {
  text: PropTypes.string.isRequired,
  onCorrect: PropTypes.func.isRequired,
  onIncorrect: PropTypes.func.isRequired
};

const PlayText = inject("store", "morsePlayer")(
  observer(
    class PlayText extends Component {
      state = {
        hidden: true
      };

      playText = () => {
        const { morsePlayer, text } = this.props;
        const { hidden } = this.state;

        if (hidden) {
          this.playCount++;
        }
        morsePlayer.playString(text);
      };

      playLoop = () => {
        if (!this.props.store.morse.playing) {
          if (this.playCount === 0) {
            this.playText();
          } else {
            this.timeout = setTimeout(this.playText, 2500);
          }
        }
      };

      start = () => {
        this.playCount = 0;
        this.autorun = autorun(this.playLoop);
      };

      stop = () => {
        this.autorun();
        clearTimeout(this.timeout);
        this.props.morsePlayer.forceStop();
      };

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
      };

      onShow = () => {
        this.setState({ hidden: false });
      };

      render() {
        if (this.state.hidden) {
          return <PlayHiddenCard onShow={this.onShow} />;
        } else {
          return (
            <PlayVisibleCard
              text={this.props.text}
              onCorrect={() => this.onResult(true)}
              onIncorrect={() => this.onResult(false)}
            />
          );
        }
      }
    }
  )
);
PlayText.propTypes = {
  onResult: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

const PlayLoop = inject("store")(
  class PlayLoop extends Component {
    state = {
      text: ""
    };

    pickText = () => {
      const text = generateText(
        this.props.store.readTrainer,
        wordsBySize,
        Date.now()
      );
      this.setState({ text });
    };

    componentDidMount() {
      this.pickText();
    }

    onResult = (success, count) => {
      this.props.store.readTrainer.textFeedback(
        this.state.text,
        success,
        count,
        Date.now()
      );
      this.pickText();
    };

    render() {
      const { text } = this.state;
      return <PlayText text={text} onResult={this.onResult} />;
    }
  }
);
PlayLoop.propTypes = {};

const TextSettings = inject("store")(
  observer(({ store }) => (
    <div>
      <TextField
        id="min"
        label="Min length"
        type="number"
        min="0"
        max="100"
        step="1"
        value={store.readTrainer.minLength}
        onChange={(value, e) => store.readTrainer.setMinLength(value)}
      />
      <TextField
        id="max"
        label="Max length"
        type="number"
        min="0"
        max="100"
        step="1"
        value={store.readTrainer.maxLength}
        onChange={(value, e) => store.readTrainer.setMaxLength(value)}
      />
    </div>
  ))
);

class HelpScreen extends PureComponent {
  state = {
    visible: false,
    pageX: null,
    pageY: null
  };

  show = e => {
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      pageX = e.changedTouches[0].pageX;
      pageY = e.changedTouches[0].pageY;
    }

    this.setState({ visible: true, pageX, pageY });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, pageX, pageY } = this.state;

    return (
      <div>
        <Button raised onClick={this.show} aria-controls="instructions-dialog">
          Instructions
        </Button>
        <DialogContainer
          id="instructions-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage
          onHide={this.hide}
          aria-labelledby="instructions-title"
        >
          <p>
            The Read Trainer plays text of adjustable length formed from the
            most common 5000 English and CW QSO words.
          </p>
          <p>
            Listen to the transmitted text until you fully decode it, then press
            "Show". Grade yourself and listen to the text some more if you did
            not read it correctly.
          </p>
          <p>
            The difficulty automatically adjusts and problematic words keep
            being repeated.
          </p>
          <Button raised onClick={this.hide}>
            Close
          </Button>
        </DialogContainer>
      </div>
    );
  }
}

const ReadTrainer = inject("store", "morsePlayer")(
  observer(
    class ReadTrainer extends Component {
      state = {
        active: false
      };

      start = () => {
        this.setState({ active: true });
      };

      stop = () => {
        this.props.morsePlayer.forceStop();
        this.setState({ active: false });
      };

      render() {
        const { active } = this.state;

        var button;
        if (active) {
          button = (
            <Button raised primary onClick={this.stop}>
              Stop
            </Button>
          );
        } else {
          button = (
            <Button raised primary onClick={this.start}>
              Start
            </Button>
          );
        }

        return (
          <div>
            <Card>
              <CardTitle title="Read Trainer" />
              <CardActions centered>
                <HelpScreen />
                {button}
              </CardActions>
              <CardText>
                <TextSettings />
              </CardText>
            </Card>
            {active && <PlayLoop />}
          </div>
        );
      }
    }
  )
);

export default ReadTrainer;
