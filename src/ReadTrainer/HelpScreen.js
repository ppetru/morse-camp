import React, { PureComponent } from "react";
import { Button, DialogContainer, FontIcon } from "react-md";

import { makeLogger } from "../analytics";

import "./ReadTrainer.scss";

const event = makeLogger("ReadTrainer");

export default class HelpScreen extends PureComponent {
  state = {
    visible: false,
    pageX: null,
    pageY: null
  };

  show = e => {
    event("instructions");

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
      <div className="horizontal-box">
        <Button
          raised
          onClick={this.show}
          aria-controls="instructions-dialog"
          iconEl={<FontIcon>info</FontIcon>}
        >
          Instructions
        </Button>
        <DialogContainer
          id="instructions-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          onHide={this.hide}
          aria-labelledby="instructions-title"
        >
          <h1>Read Trainer</h1>
          <div className="md-text-container md-text-justify">
            <p>This trainer teaches you to "read" text by ear.</p>
            <p>
              You will hear a text of adjustable length formed from the most
              common 5000 English and CW QSO words.
            </p>
            <p>
              Listen to the text until you fully decode it, then press "Show".
              Grade yourself and listen to the text some more if you did not
              read it correctly.
            </p>
            <p>
              If you are on a computer, you can make use of keyboard shortcuts.
              Press the SPACE key in place of the SHOW button. If it is
              available, press R for REPEAT. Press the left arrow key for a
              CORRECT answer and the right arrow key for an INCORRECT answer.
            </p>
            <p>
              The difficulty adjusts automatically and problematic words repeat
              until learned.
            </p>
          </div>
          <Button
            raised
            onClick={this.hide}
            iconEl={<FontIcon>close</FontIcon>}
            className="md-block-centered"
          >
            Close
          </Button>
        </DialogContainer>
      </div>
    );
  }
}
