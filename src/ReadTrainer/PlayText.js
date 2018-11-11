import React, { Component } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  FontIcon
} from "react-md";

import { HotKeys } from "react-hotkeys";

import { makeLogger } from "../analytics";

import "./ReadTrainer.css";

const keyMap = {
  show: "space",
  correct: "left",
  incorrect: "right",
  repeat: "r"
};

const event = makeLogger("ReadTrainer");

const PlayHiddenCard = inject("store")(
  observer(
    class PlayHiddenCard extends Component {
      constructor(props) {
        super(props);
        this.playCardRef = React.createRef();
      }
      componentDidMount() {
        this.playCardRef.current.focus();
      }

      render() {
        return (
          <HotKeys keyMap={keyMap}>
            <div>
              <HotKeys
                handlers={{
                  show: event => this.props.onShow(),
                  repeat: event => this.props.onRepeat()
                }}
              >
                <div tabIndex="-1" ref={this.playCardRef}>
                  <Card className="bottom-card">
                    <CardTitle
                      title="Listen"
                      subtitle={
                        this.props.store.morse.playing
                          ? "Playing..."
                          : "Waiting..."
                      }
                    />
                    <CardText>
                      <p>Decode the text and press 'Show' when ready</p>
                    </CardText>
                    <CardActions centered>
                      <Button
                        raised
                        primary
                        onClick={this.props.onShow}
                        iconEl={<FontIcon>visibility</FontIcon>}
                      >
                        Show
                      </Button>
                      {this.props.store.morse.automaticallyRepeat ? (
                        <div />
                      ) : (
                        <Button
                          raised
                          primary
                          iconEl={<FontIcon>loop</FontIcon>}
                          onClick={this.props.onRepeat}
                        >
                          Repeat
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </HotKeys>
            </div>
          </HotKeys>
        );
      }
    }
  )
);
PlayHiddenCard.propTypes = {
  onShow: PropTypes.func.isRequired,
  onRepeat: PropTypes.func.isRequired
};

const PlayVisibleCard = inject("store")(
  observer(
    class PlayVisibleCard extends Component {
      constructor(props) {
        super(props);
        this.playCardRef = React.createRef();
      }
      componentDidMount() {
        this.playCardRef.current.focus();
      }

      render() {
        return (
          <HotKeys keyMap={keyMap}>
            <div>
              <HotKeys
                handlers={{
                  correct: event => this.props.onCorrect(),
                  incorrect: event => this.props.onIncorrect()
                }}
              >
                <div tabIndex="-1" ref={this.playCardRef}>
                  <Card className="bottom-card">
                    <CardTitle
                      title="Listen"
                      subtitle={
                        this.props.store.morse.playing
                          ? "Playing..."
                          : "Waiting..."
                      }
                    />
                    <CardText>
                      <p>
                        The text was: <b>{this.props.text}</b>
                      </p>
                    </CardText>
                    <CardActions centered>
                      <Button
                        raised
                        primary
                        onClick={this.props.onCorrect}
                        iconEl={<FontIcon>thumb_up</FontIcon>}
                      >
                        Correct
                      </Button>
                      <Button
                        raised
                        primary
                        onClick={this.props.onIncorrect}
                        iconEl={<FontIcon>thumb_down</FontIcon>}
                      >
                        Incorrect
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              </HotKeys>
            </div>
          </HotKeys>
        );
      }
    }
  )
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
        } else {
          this.replayCount++;
        }
        morsePlayer.playString(text);
      };

      playLoop = () => {
        if (!this.props.store.morse.playing) {
          if (this.playCount === 0) {
            this.playText();
          } else if (!this.props.store.morse.automaticallyRepeat) {
            this.stop();
          } else if (
            this.playCount >= this.props.store.morse.maxRepeats ||
            this.replayCount >= this.props.store.morse.maxRepeats
          ) {
            this.stop();
          } else {
            this.timeout = setTimeout(
              this.playText,
              this.props.store.morse.delay
            );
          }
        }
      };

      start = () => {
        this.playCount = 0;
        this.replayCount = 0;
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
        if (success) {
          event("success", this.props.text.length, this.replayCount);
        } else {
          event("fail", this.props.text.length, this.replayCount);
        }
        this.props.onResult(success, this.playCount);
      };

      onShow = () => {
        event("show", this.props.text.length, this.playCount);
        this.setState({ hidden: false });
      };

      render() {
        if (this.state.hidden) {
          return (
            <PlayHiddenCard onShow={this.onShow} onRepeat={this.playText} />
          );
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

export default PlayText;
