import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, FontIcon } from "react-md";
import { inject } from "mobx-react";

import { makeLogger } from "./analytics";

const event = makeLogger("TestButton");

const TestButton = inject("store", "morsePlayer")(
  class TestButton extends PureComponent {
    // TODO: should these be React state instead?
    playCount = 0;
    playInterval;
    reuseVariableFrequency = false;

    playLoop = () => {
      if (!this.props.store.morse.playing) {
        if (this.playCount === 0) {
          this.playCount++;
          this.reuseVariableFrequency = false;
          this.playHello();
          this.reuseVariableFrequency = true;
        } else if (this.playCount > this.props.repeatCount - 1) {
          clearInterval(this.playInterval);
          this.playInterval = undefined;
        } else {
          this.playCount++;
          setTimeout(() => {
            this.playHello();
          }, this.props.store.readTrainer.delay);
        }
      }
    };

    playHello = () => {
      this.props.morsePlayer.playString("hello", this.reuseVariableFrequency);
    };

    render() {
      return (
        <Button
          raised
          primary
          className="md-block-centered"
          iconEl={<FontIcon>play_arrow</FontIcon>}
          onClick={() => {
            event("test");
            if (this.playInterval === undefined) {
              this.playCount = 0;
              this.playInterval = setInterval(this.playLoop, 50);
            }
          }}
        >
          Test
        </Button>
      );
    }
  }
);
TestButton.propTypes = {
  repeatCount: PropTypes.number.isRequired
};

export default TestButton;
