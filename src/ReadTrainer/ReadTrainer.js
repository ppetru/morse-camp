import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  TextField
} from "react-md";

import { wordsBySize } from "../Words";
import { generateText } from "../TextGenerator";
import { makeLogger } from "../analytics";

import HelpScreen from "./HelpScreen";
import PlayText from "./PlayText";
import "./ReadTrainer.css";

const event = makeLogger("ReadTrainer");

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

const ReadTrainer = inject("store", "morsePlayer")(
  observer(
    class ReadTrainer extends Component {
      state = {
        active: false
      };

      start = () => {
        event("start");
        this.setState({ active: true });
      };

      stop = () => {
        event("stop");
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
