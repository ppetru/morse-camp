import React, { PureComponent } from "react";
import { Button, DialogContainer, FontIcon } from "react-md";

import { makeLogger } from "../analytics";

import "./ReadTrainer.css";

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
      <div>
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
          fullPage
          onHide={this.hide}
          aria-labelledby="instructions-title"
        >
          <div className="md-grid centered">
            <h1>Read Trainer</h1>
            <div className="md-cell md-cell--12 md-text-container">
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
                The difficulty adjusts automatically and problematic words
                repeat until learned.
              </p>
            </div>
            <Button
              className="md-cell"
              raised
              onClick={this.hide}
              iconEl={<FontIcon>close</FontIcon>}
            >
              Close
            </Button>
          </div>
        </DialogContainer>
      </div>
    );
  }
}
