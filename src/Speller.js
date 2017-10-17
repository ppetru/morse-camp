import React, { Component } from 'react';

import Button from 'react-md/lib/Buttons/Button';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import meSpeak from 'mespeak';

import MorsePlayer from './MorsePlayer';
import Texts from './Texts';

class Speller extends Component {
  state = {
    text: "hi",
  };

  constructor(props) {
    super(props);
    meSpeak.loadConfig(require('mespeak/src/mespeak_config.json'));
    meSpeak.loadVoice(require('mespeak/voices/en/en.json'));
  }

  sanitizeText(text) {
    let result = "";
    for (let c of text.toUpperCase()) {
      if (c === " " || MorsePlayer.alphabet.indexOf(c) !== -1) {
        result += c;
      }
    }
    return result;
  }

  speak = (text) => {
    let msg = text[0];
    let rest = text.slice(1);
    var callback = null;
    if (rest) {
      callback = result => {
        console.log(result);
        this.speak(rest);
      }
    }
    meSpeak.speak(msg, {}, callback);
  }

  startSpeaking = () => {
    let text = this.sanitizeText(this.state.text);
    this.speak(text);
  }

  pause() {
    window.speechSynthesis.pause();
  }

  resume() {
    window.speechSynthesis.resume();
  }

  handleTextChange = (value, event) => {
    this.setState({ text: value });
  }

  handleSelectChange = (value, index, event, details) => {
    this.setState({ text: Texts[value] });
  }

  render() {
    return (
      <div className="App">
        <SelectField
          id="canned"
          label="Canned text"
          menuItems={['', ...Object.keys(Texts)]}
          onChange={this.handleSelectChange}
        />
        <TextField
          id="text"
          label="Input text"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <Button
          raised
          primary
          onClick={this.startSpeaking}
        >
          Speak
        </Button>
        <Button
          raised
          primary
          onClick={this.pause}
        >
          Pause
        </Button>
        <Button
          raised
          primary
          onClick={this.resume}
        >
          Resume
        </Button>
      </div>
    )
  }
}

export default Speller;
