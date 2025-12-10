import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { inject, observer } from "mobx-react";

import { makeLogger } from "./analytics.js";

const event = makeLogger("TestButton");

const TestButton = inject(
  "store",
  "morsePlayer",
)(
  observer(({ store, morsePlayer, repeatCount }) => {
    const playCountRef = useRef(0);
    const playIntervalRef = useRef(null);

    const playHello = useCallback(() => {
      morsePlayer.playString("hello");
    }, [morsePlayer]);

    const playLoop = useCallback(() => {
      if (!store.morse.playing) {
        if (playCountRef.current === 0) {
          playCountRef.current++;
          morsePlayer.resetRandomFrequency();
          playHello();
        } else if (playCountRef.current > repeatCount - 1) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        } else {
          playCountRef.current++;
          setTimeout(() => {
            playHello();
          }, store.readTrainer.delay);
        }
      }
    }, [
      store.morse.playing,
      store.readTrainer.delay,
      morsePlayer,
      playHello,
      repeatCount,
    ]);

    const handleClick = useCallback(() => {
      event("test");
      if (playIntervalRef.current === null) {
        playCountRef.current = 0;
        playIntervalRef.current = setInterval(playLoop, 50);
      }
    }, [playLoop]);

    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={handleClick}
        sx={{ display: "block", margin: "0 auto" }}
      >
        Test
      </Button>
    );
  }),
);

TestButton.propTypes = {
  repeatCount: PropTypes.number.isRequired,
};

export default TestButton;
