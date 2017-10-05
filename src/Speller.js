import React, { Component } from 'react';

import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields';

import MorsePlayer from './MorsePlayer';

class Speller extends Component {
  state = {
    text: "hi",
  };

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
    let msg = new SpeechSynthesisUtterance(text[0]);
    let rest = text.slice(1);
    if (rest) {
      msg.onend = event => {
        this.speak(rest);
      }
    }
    window.speechSynthesis.speak(msg);
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

  handleChange = (value, event) => {
    this.setState({ text: value });
  }

  render() {
    return (
      <div className="App">
        <TextField
          id="text"
          label="Input text"
          value={this.state.text}
          onChange={this.handleChange}
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
