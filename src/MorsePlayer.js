import React, { Component } from 'react';

class MorsePlayer extends Component {
  static get codeTable() {
    return {
      "A": ".-",
      "B": "-...",
      "C": "-.-.",
      "D": "-..",
      "E": ".",
      "F": "..-.",
      "G": "--.",
      "H": "....",
      "I": "..",
      "J": ".---",
      "K": "-.-",
      "L": ".-..",
      "M": "--",
      "N": "-.",
      "O": "---",
      "P": ".--.",
      "Q": "--.-",
      "R": ".-.",
      "S": "...",
      "T": "-",
      "U": "..-",
      "V": "...-",
      "W": ".--",
      "X": "-..-",
      "Y": "-.--",
      "Z": "--..",

      "1": ".----",
      "2": "..---",
      "3": "...--",
      "4": "....-",
      "5": ".....",
      "6": "-....",
      "7": "--...",
      "8": "---..",
      "9": "----.",
      "0": "-----",

      ".": ".-.-.-",
      ",": "--..--",
      "=": "-...-",
      "?": "..--..",
    }
  }

  static get alphabet() {
    return Object.keys(MorsePlayer.codeTable);
  }

  constructor(props) {
    super(props);

    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.oscillator = this.context.createOscillator()
    this.gain = this.context.createGain()

    this.gain.gain.setValueAtTime(0.0, this.context.currentTime);
    this.oscillator.frequency.value = 500;

    this.oscillator.connect(this.gain);
    this.oscillator.start(0);
    this.gain.connect(this.context.destination);

    let rate = 25;
    this.dot = 1.2 / rate;

    this.addEventListener('play', e => this.handlePlay(e));
  }

  playChar(t, c) {
    for (var i = 0; i < c.length; i++) {
      switch(c[i]) {
      case '.':
        this.gain.gain.setValueAtTime(1.0, t);
        t += this.dot;
        this.gain.gain.setValueAtTime(0.0, t);
        break;
      case '-':
        this.gain.gain.setValueAtTime(1.0, t);
        t += 3 * this.dot;
        this.gain.gain.setValueAtTime(0.0, t);
        break;
      default:
      }
      t += this.dot;
    }
    return t;
  };

  playString(s) {
    s = s.toUpperCase();
    var t = this.context.currentTime;
    for (var i = 0; i < s.length; i++) {
      if (s[i] === ' ') {
        t += 3 * this.dot;
      } else if (MorsePlayer.codeTable[s[i]] !== undefined) {
        t = this.playChar(t, MorsePlayer.codeTable[s[i]]);
        t += 2 * this.dot;
      };
    };
    this.gain.gain.setValueAtTime(0.0, t);
  };

  handlePlay(e) {
    if (e.detail.input !== undefined) {
      this.playString(e.detail.input);
    } else {
      console.log('received play event with undefined input', e);
    }
  };

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default MorsePlayer;
