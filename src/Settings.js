import React, { Component } from "react";
import { Button, TextField } from "react-md";
import { inject, observer } from "mobx-react";

const Settings = inject("store", "morsePlayer")(
  observer(({ store, morsePlayer }) => (
    <div className="md-grid">
      <h2 className="md-cell md-cell--12 md-text-container">Settings</h2>
      <div className="md-cell md-cell--12 md-text-container">
        <TextField
          id="speed"
          label="Speed (WPM)"
          type="number"
          max={80}
          min={20}
          step={1}
          value={store.morse.speed}
          onChange={(value, e) => store.morse.setSpeed(value)}
        />
        <TextField
          id="frequency"
          label="Frequency (Hz)"
          type="number"
          max={5000}
          min={200}
          step={10}
          value={store.morse.frequency}
          onChange={(value, e) => store.morse.setFrequency(value)}
        />
        <Button
          raised
          primary
          className="md-block-centered"
          onClick={() => morsePlayer.playString("hi")}
        >
          Test
        </Button>
      </div>
    </div>
  ))
);

export default Settings;
