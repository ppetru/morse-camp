import React, { Component } from 'react';

import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields';

class Speller extends Component {
  state = {
    text: "The quick brown fox jumps over the lazy dog's back",
  };

  spellText(text) {
    let result = "";
    for (let c of text) {
      result += c;
      result += ",";
    }
    return result;
  }

  speak = () => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = this.spellText(this.state.text);
    window.speechSynthesis.speak(msg);
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
          onClick={this.speak}
        >
          Speak
        </Button>
      </div>
    )
  }
}

export default Speller;
