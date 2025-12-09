import React from "react";

import "./ReadTrainer.scss";

const HelpScreen = () => (
  <div>
    <h1>Instructions</h1>
    <div className="md-text-container md-text-justify">
      <p>This trainer teaches you to "read" text by ear.</p>
      <p>
        You will hear a text of adjustable length formed from the words selected
        in the Configuration tab.
      </p>
      <p>
        Listen to the text until you fully decode it, then press "Show". Grade
        yourself and listen to the text some more if you did not read it
        correctly.
      </p>
      <p>
        If your device has a keyboard, you can use shortcuts. Press the SPACE
        key in place of the SHOW button. When it is available, press R for
        REPEAT. Press the left arrow key for a CORRECT answer and the right
        arrow key for an INCORRECT answer.
      </p>
      <p>
        The difficulty adjusts automatically and problematic words repeat until
        learned.
      </p>
    </div>
  </div>
);

export default HelpScreen;
