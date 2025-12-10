import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import FastForwardIcon from "@mui/icons-material/FastForward";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { inject, observer } from "mobx-react";
import { Helmet } from "react-helmet";

import { makeLogger } from "./analytics.js";
import TestButton from "./TestButton.jsx";

const event = makeLogger("Settings");

const SliderWithInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon,
}) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography>{label}</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        sx={{ flex: 1 }}
      />
      <TextField
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) onChange(val);
        }}
        type="number"
        size="small"
        inputProps={{ min, max, step }}
        sx={{ width: 80 }}
      />
    </Box>
  </Box>
);

const ClearStorage = inject("store")(
  observer(({ store }) => {
    const [visible, setVisible] = useState(false);

    const show = useCallback(() => {
      setVisible(true);
    }, []);

    const hide = useCallback(() => {
      setVisible(false);
    }, []);

    const handleDelete = useCallback(() => {
      event("clear storage");
      store.transport.clear().then(() => {
        store.readTrainer.setupActiveDictionary();
        store.appStore.addToast("Storage cleared");
        window.location.reload();
      });
      hide();
    }, [store, hide]);

    return (
      <div>
        <Button variant="contained" onClick={show} startIcon={<DeleteIcon />}>
          Clear storage
        </Button>
        <Dialog open={visible} onClose={hide}>
          <DialogContent>
            <DialogContentText>
              Reset all settings and progress data?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={hide} color="primary">
              No, nevermind
            </Button>
            <Button onClick={handleDelete}>Yes, delete everything</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }),
);

const FrequencyOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Tone Frequency (Hz)
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={store.morse.randomFrequency}
            onChange={(e) => store.morse.setRandomFrequency(e.target.checked)}
          />
        }
        label="Random"
      />

      {store.morse.randomFrequency ? (
        <div>
          <SliderWithInput
            label="Upper Bound"
            value={store.morse.upperBoundFrequency}
            onChange={(value) => {
              store.morse.setUpperBoundFrequency(value);
              const lowerBound = value - 400 < 100 ? 101 : value - 400;
              store.morse.setLowerBoundFrequency(lowerBound);
            }}
            min={200}
            max={1200}
            step={10}
            icon={<MusicNoteIcon />}
          />
          <SliderWithInput
            label="Lower Bound"
            value={store.morse.lowerBoundFrequency}
            onChange={(value) => store.morse.setLowerBoundFrequency(value)}
            min={100}
            max={store.morse.upperBoundFrequency}
            step={10}
            icon={<MusicNoteIcon />}
          />
        </div>
      ) : (
        <SliderWithInput
          label="Value"
          value={store.morse.frequency}
          onChange={(value) => store.morse.setFrequency(value)}
          min={200}
          max={1000}
          step={10}
          icon={<MusicNoteIcon />}
        />
      )}
    </div>
  )),
);

const Settings = inject(
  "store",
  "morsePlayer",
)(
  observer(({ store }) => (
    <div>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Morse player
        </Typography>
        <SliderWithInput
          label="Character Speed (WPM)"
          value={store.morse.characterSpeed}
          onChange={(value) => {
            store.morse.setCharacterSpeed(value);
            store.morse.setEffectiveSpeed(value);
          }}
          min={10}
          max={80}
          icon={<FastForwardIcon />}
        />
        <SliderWithInput
          label="Effective Speed (WPM)"
          value={store.morse.effectiveSpeed}
          onChange={(value) => store.morse.setEffectiveSpeed(value)}
          min={10}
          max={store.morse.characterSpeed}
          icon={<FastForwardIcon />}
        />
        <SliderWithInput
          label="Volume (%)"
          value={store.morse.volume}
          onChange={(value) => store.morse.setVolume(value)}
          min={0}
          max={100}
          icon={<VolumeUpIcon />}
        />
        <FrequencyOptions />
        <Box sx={{ mt: 2 }}>
          <TestButton repeatCount={1} />
        </Box>

        <Typography variant="h5" component="h2" sx={{ mt: 4 }} gutterBottom>
          Internals
        </Typography>
        <ClearStorage />
      </Box>
    </div>
  )),
);

export default Settings;
