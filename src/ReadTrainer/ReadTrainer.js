import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  Divider,
  FontIcon
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
      const store = this.props.store.readTrainer;
      store.textFeedback(this.state.text, success, count, Date.now());
      store.adjustLengths();
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
            <Button
              raised
              primary
              onClick={this.stop}
              iconEl={<FontIcon>stop</FontIcon>}
            >
              Stop
            </Button>
          );
        } else {
          button = (
            <Button
              raised
              primary
              onClick={this.start}
              iconEl={<FontIcon>play_arrow</FontIcon>}
            >
              Start
            </Button>
          );
        }

        return (
          <div className="vcontainer">
            <h1>Read Trainer</h1>
            <Card className="top-card">
              <CardTitle title="Text length" />
              <CardText>
                <TextSettings />
              </CardText>
              <CardActions centered>
                <HelpScreen />
                {button}
              </CardActions>
            </Card>
            <Divider />
            {active && <PlayLoop onAbort={this.stop} />}
            <div className="filler-card" />
          </div>
        );
      }
    }
  )
);

export default ReadTrainer;
