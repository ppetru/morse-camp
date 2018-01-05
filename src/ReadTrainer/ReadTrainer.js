import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  Divider
} from "react-md";

import { wordFrequency } from "../Words";
import { computeWordWeights, generateText } from "../TextGenerator";
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
      const store = this.props.store.readTrainer;
      const candidates = computeWordWeights(
        wordFrequency,
        store.words,
        Date.now()
      );
      const text = generateText(candidates, store.minLength, store.maxLength);
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
      return (
        <PlayText
          text={text}
          onResult={this.onResult}
          onAbort={this.props.onAbort}
        />
      );
    }
  }
);
PlayLoop.propTypes = {
  onAbort: PropTypes.func.isRequired
};

const TextSettings = inject("store")(
  observer(({ store }) => (
    <div>
      <h3>Text length</h3>
      <div className="text-size-container">
        <div className="text-size-box">
          <span>Min:</span>
          <Button
            primary
            icon
            onClick={() =>
              store.readTrainer.setMinLength(store.readTrainer.minLength - 1)
            }
          >
            arrow_downward
          </Button>
          <span>{store.readTrainer.minLength}</span>
          <Button
            primary
            icon
            onClick={() =>
              store.readTrainer.setMinLength(store.readTrainer.minLength + 1)
            }
          >
            arrow_upward
          </Button>
        </div>
        <div className="text-size-box">
          <span>Max:</span>
          <Button
            primary
            icon
            onClick={() =>
              store.readTrainer.setMaxLength(store.readTrainer.maxLength - 1)
            }
          >
            arrow_downward
          </Button>
          <span>{store.readTrainer.maxLength}</span>
          <Button
            primary
            icon
            onClick={() =>
              store.readTrainer.setMaxLength(store.readTrainer.maxLength + 1)
            }
          >
            arrow_upward
          </Button>
        </div>
      </div>
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
          <div className="column-container">
            <div className="side-filler" />
            <div className="vcontainer trainer-column">
              <Card className="top-card">
                <CardTitle title="Read Trainer" />
                <CardActions centered>
                  <HelpScreen />
                  {button}
                </CardActions>
                <CardText>
                  <TextSettings />
                </CardText>
              </Card>
              <Divider />
              {active && <PlayLoop onAbort={this.stop} />}
              <div className="filler-card" />
            </div>
            <div className="side-filler" />
          </div>
        );
      }
    }
  )
);

export default ReadTrainer;
