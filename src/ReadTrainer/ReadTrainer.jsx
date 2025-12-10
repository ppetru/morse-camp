import React, { useState, useEffect, useCallback } from "react";
import { inject, observer } from "mobx-react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import TuneIcon from "@mui/icons-material/Tune";
import HelpIcon from "@mui/icons-material/Help";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Helmet } from "react-helmet-async";

import { dictionary } from "../Words.js";
import {
  trimDictionary,
  computeWordWeights,
  generateText,
} from "../TextGenerator.js";
import { makeLogger } from "../analytics.js";

import HelpScreen from "./HelpScreen.jsx";
import Configuration from "./Configuration.jsx";
import PlayText from "./PlayText.jsx";
import "./ReadTrainer.scss";

const event = makeLogger("ReadTrainer");

const PlayLoop = inject("store")(
  observer(({ store }) => {
    const [text, setText] = useState("");
    const readTrainerStore = store.readTrainer;

    const pickText = useCallback(
      (previousText = "") => {
        let dict;
        if (readTrainerStore.canUseUserDictionary) {
          dict = readTrainerStore.userDictionaryWithWordFreq;
        } else {
          // If there are performance issues on slower devices, we may want to consider caching
          // the trimmed dictionary. It is relatively expensive. It will need to be invalidated
          // whenever the user changes the active dictionary.
          dict = trimDictionary(
            dictionary.wordFrequency,
            readTrainerStore.activeDictionarySize,
          );
        }

        const candidates = computeWordWeights(
          dict,
          readTrainerStore.words,
          Date.now(),
        );

        let newText;
        let safecount = 10;
        while (newText === undefined && safecount-- > 0) {
          newText = generateText(
            candidates,
            readTrainerStore.minLength,
            readTrainerStore.maxLength,
          );

          // With small dictionaries we may need to bump up the max size to find
          // one or more words.
          if (newText === undefined) {
            readTrainerStore.setMaxLength(readTrainerStore.maxLength + 1);
          }
        }
        if (newText === undefined) {
          newText = "uhoh";
        }

        // When the same word is selected twice in a row (which can be caused
        // by a limited number of entries in the dictionary), adding a space
        // allows the word to be used immediately again.
        // (this is a workaround necessary due to the way setState() is (ab)used
        // -- it needs a new value for things to work)
        if (previousText === newText) {
          newText += " ";
        }
        setText(newText);
      },
      [readTrainerStore],
    );

    useEffect(() => {
      pickText();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onResult = useCallback(
      (success, count) => {
        readTrainerStore.textFeedback(text, success, count, Date.now());
        if (readTrainerStore.automaticallyIncreaseDifficulty) {
          readTrainerStore.adjustLengths();
        }
        pickText(text);
      },
      [readTrainerStore, text, pickText],
    );

    return <PlayText text={text} onResult={onResult} />;
  }),
);

const TextSettings = inject("store")(
  observer(({ store }) => (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, my: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>Min:</Typography>
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            store.readTrainer.setMinLength(store.readTrainer.minLength - 1);
            store.readTrainer.resetLengthCount(store.readTrainer.minLength);
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: "center" }}>
          {store.readTrainer.minLength}
        </Typography>
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            store.readTrainer.setMinLength(store.readTrainer.minLength + 1);
            store.readTrainer.resetLengthCount(store.readTrainer.minLength);
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>Max:</Typography>
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            store.readTrainer.setMaxLength(store.readTrainer.maxLength - 1);
            store.readTrainer.resetLengthCount(store.readTrainer.maxLength);
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: "center" }}>
          {store.readTrainer.maxLength}
        </Typography>
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            store.readTrainer.setMaxLength(store.readTrainer.maxLength + 1);
            store.readTrainer.resetLengthCount(store.readTrainer.maxLength);
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>
    </Box>
  )),
);

const ReadTrainerPlayer = inject(
  "store",
  "morsePlayer",
)(
  observer(({ store, morsePlayer }) => {
    const [active, setActive] = useState(false);

    const start = useCallback(() => {
      event("start", store.morse.speed);
      setActive(true);
    }, [store.morse.speed]);

    const stop = useCallback(() => {
      event("stop");
      morsePlayer.forceStop();
      setActive(false);
    }, [morsePlayer]);

    const button = active ? (
      <Button
        variant="contained"
        color="primary"
        onClick={stop}
        startIcon={<StopIcon />}
      >
        Stop
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={start}
        startIcon={<PlayArrowIcon />}
      >
        Start
      </Button>
    );

    return (
      <div className="vcontainer">
        <div className="top-card">
          <Typography variant="h5" component="h2" gutterBottom>
            Text length
          </Typography>
          <TextSettings />
          <Box sx={{ display: "flex", justifyContent: "center" }}>{button}</Box>
        </div>
        {active && <PlayLoop />}
      </div>
    );
  }),
);

const ReadTrainer = () => {
  const [navValue, setNavValue] = useState(0);

  const handleNavChange = (_, newValue) => {
    setNavValue(newValue);
    switch (newValue) {
      case 1:
        event("configuration");
        break;
      case 2:
        event("help");
        break;
      default:
        event("play_tab");
    }
  };

  let content;
  switch (navValue) {
    case 1:
      content = <Configuration key="config" />;
      break;
    case 2:
      content = <HelpScreen key="help" />;
      break;
    default:
      content = <ReadTrainerPlayer key="trainer" />;
  }

  return (
    <Box
      className="vcontainer"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Helmet>
        <title>Read Trainer</title>
      </Helmet>
      <Box
        component="main"
        className="vcontainer"
        sx={{ flex: 1, pb: 7, overflow: "auto" }}
      >
        {content}
      </Box>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation value={navValue} onChange={handleNavChange}>
          <BottomNavigationAction label="Train" icon={<PlayArrowIcon />} />
          <BottomNavigationAction label="Configuration" icon={<TuneIcon />} />
          <BottomNavigationAction label="Instructions" icon={<HelpIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default ReadTrainer;
