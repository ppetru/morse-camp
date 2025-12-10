import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoopIcon from "@mui/icons-material/Loop";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { HotKeys } from "react-hotkeys";

import { makeLogger } from "../analytics.js";

import "./ReadTrainer.scss";

const keyMap = {
  show: "space",
  correct: "left",
  incorrect: "right",
  repeat: "r",
};

const event = makeLogger("ReadTrainer");

const PlayHiddenCard = inject("store")(
  observer(({ store, onShow, onRepeat }) => {
    const playCardRef = useRef(null);

    useEffect(() => {
      playCardRef.current?.focus();
    }, []);

    return (
      <HotKeys keyMap={keyMap}>
        <div>
          <HotKeys
            handlers={{
              show: () => onShow(),
              repeat: () => onRepeat(),
            }}
          >
            <div tabIndex="-1" ref={playCardRef}>
              <Card className="bottom-card">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Listen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {store.morse.playing ? "Playing..." : "Waiting..."}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    Decode the text and press 'Show' when ready
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onShow}
                    startIcon={<VisibilityIcon />}
                  >
                    Show
                  </Button>
                  {!store.readTrainer.automaticallyRepeat && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LoopIcon />}
                      onClick={onRepeat}
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
  }),
);

PlayHiddenCard.propTypes = {
  onShow: PropTypes.func.isRequired,
  onRepeat: PropTypes.func.isRequired,
};

const PlayVisibleCard = inject("store")(
  observer(({ store, text, onCorrect, onIncorrect }) => {
    const playCardRef = useRef(null);

    useEffect(() => {
      playCardRef.current?.focus();
    }, []);

    return (
      <HotKeys keyMap={keyMap}>
        <div>
          <HotKeys
            handlers={{
              correct: () => onCorrect(),
              incorrect: () => onIncorrect(),
            }}
          >
            <div tabIndex="-1" ref={playCardRef}>
              <Card className="bottom-card">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Listen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {store.morse.playing ? "Playing..." : "Waiting..."}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    The text was:{" "}
                    <Box component="span" sx={{ fontWeight: "bold" }}>
                      {text}
                    </Box>
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onCorrect}
                    startIcon={<ThumbUpIcon />}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onIncorrect}
                    startIcon={<ThumbDownIcon />}
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
  }),
);

PlayVisibleCard.propTypes = {
  text: PropTypes.string.isRequired,
  onCorrect: PropTypes.func.isRequired,
  onIncorrect: PropTypes.func.isRequired,
};

const PlayText = inject(
  "store",
  "morsePlayer",
)(
  observer(({ store, morsePlayer, text, onResult }) => {
    const [hidden, setHidden] = useState(true);
    const playCountRef = useRef(0);
    const replayCountRef = useRef(0);
    const autorunDisposerRef = useRef(null);
    const timeoutRef = useRef(null);

    const playText = useCallback(() => {
      if (hidden) {
        playCountRef.current++;
      } else {
        replayCountRef.current++;
      }
      morsePlayer.playString(text);
    }, [morsePlayer, text, hidden]);

    const stop = useCallback(() => {
      if (autorunDisposerRef.current) {
        autorunDisposerRef.current();
        autorunDisposerRef.current = null;
      }
      clearTimeout(timeoutRef.current);
      morsePlayer.forceStop();
    }, [morsePlayer]);

    const playLoop = useCallback(() => {
      if (!store.morse.playing) {
        if (playCountRef.current === 0) {
          morsePlayer.resetRandomFrequency();
          playText();
        } else if (!store.readTrainer.automaticallyRepeat) {
          stop();
        } else if (
          playCountRef.current >= store.readTrainer.maxRepeats ||
          replayCountRef.current >= store.readTrainer.maxRepeats
        ) {
          stop();
        } else {
          timeoutRef.current = setTimeout(playText, store.readTrainer.delay);
        }
      }
    }, [store.morse.playing, store.readTrainer, morsePlayer, playText, stop]);

    const start = useCallback(() => {
      playCountRef.current = 0;
      replayCountRef.current = 0;
      autorunDisposerRef.current = autorun(playLoop);
    }, [playLoop]);

    // Start playback on mount
    useEffect(() => {
      start();
      return () => {
        stop();
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle text changes
    useEffect(() => {
      stop();
      setHidden(true);
      // Use setTimeout to ensure state is updated before starting
      const restartTimeout = setTimeout(() => {
        start();
      }, 0);
      return () => clearTimeout(restartTimeout);
    }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleResult = useCallback(
      (success) => {
        stop();
        if (success) {
          event("success", text.length, replayCountRef.current);
        } else {
          event("fail", text.length, replayCountRef.current);
        }
        onResult(success, playCountRef.current);
      },
      [stop, text, onResult],
    );

    const handleShow = useCallback(() => {
      event("show", text.length, playCountRef.current);
      setHidden(false);
    }, [text]);

    if (hidden) {
      return <PlayHiddenCard onShow={handleShow} onRepeat={playText} />;
    } else {
      return (
        <PlayVisibleCard
          text={text}
          onCorrect={() => handleResult(true)}
          onIncorrect={() => handleResult(false)}
        />
      );
    }
  }),
);

PlayText.propTypes = {
  onResult: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default PlayText;
