import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';


const MorsePlayer = inject("store", "audioContext")(observer(class MorsePlayer extends Component {

  morseCodes = {
      'A':'.-',
      'B':'-...',
      'C':'-.-.',
      'D':'-..',
      'E':'.',
      'F':'..-.',
      'G':'--.',
      'H':'....',
      'I':'..',
      'J':'.---',
      'K':'-.-',
      'L':'.-..',
      'M':'--',
      'N':'-.',
      'O':'---',
      'P':'.--.',
      'Q':'--.-',
      'R':'.-.',
      'S':'...',
      'T':'-',
      'U':'..-',
      'V':'...-',
      'W':'.--',
      'X':'-..-',
      'Y':'-.--',
      'Z':'--..',

      '0':'-----',
      '1':'.----',
      '2':'..---',
      '3':'...--',
      '4':'....-',
      '5':'.....',
      '6':'-....',
      '7':'--...',
      '8':'---..',
      '9':'----.',

      '.':'.-.-.-',
      ',':'--..--',
      '?':'..--..',

      '<AR>':'.-.-.', // Stop copying (end of message)
      '<AS>':'.-...', // Wait
      '<BK>':'-...-.-', // BreaK
      '<BT>':'-...-', // Space down two lines (new paragraph)
      '<CL>':'-.-..-..', // CLosing down
      '<CT>':'-.-.-', '<KA>':'-.-.-', // Attention, Commencing Transmission
      '<KN>':'-.--.', // Invitation to a specific named station to transmit
      '<SK>':'...-.-', '<VA>':'...-.-', // End of contact
      '<HH>':'........', // Error
  }

  get ditLength() {
    // 1.2s per dit is 1WPM
    return 1.2/this.props.speed;
  }

  soundOn = time => {
    this.gain.gain.setTargetAtTime(1.0, time, 1/this.props.frequency);
  }

  soundOff = time => {
    this.gain.gain.setTargetAtTime(0.0, time, 1/this.props.frequency);
  }

  playChar = (t, c) => {
    for (var i = 0; i < c.length; i++) {
      switch(c[i]) {
      case '.':
          this.soundOn(t);
          t += this.ditLength;
          this.soundOff(t);
          break;
      case '-':
          this.soundOn(t);
          t += 3 * this.ditLength;
          this.soundOff(t);
          break;
      default:
      }
      t += this.ditLength;
    }
    return t;
  }

  playString = s => {
    s = s.toUpperCase();
    this.props.store.startPlaying();
    const oscillator = this.makeOscillator();
    oscillator.start();
    let t = this.props.audioContext.currentTime;
    for (var i = 0; i < s.length; i++) {
      // TODO: handle prosigns
      if (s[i] === ' ') {
        t += 4 * this.ditLength; // +3 after the last char = 7 for inter-word
      } else if (this.morseCodes[s[i]] !== undefined) {
        t = this.playChar(t, this.morseCodes[s[i]]);
        t += 2 * this.ditLength; // +1 after the last symbol = 3 for inter-char
      } else {
        console.log("Character '", s[i], "' unknown");
      };
    };
    oscillator.stop(t);
  }

  makeOscillator = () => {
    const oscillator = this.props.audioContext.createOscillator();
    oscillator.connect(this.gain);
    oscillator.frequency.value = this.props.frequency;
    oscillator.addEventListener("ended", event => this.props.store.stopPlaying());
    return oscillator;
  }

  componentDidMount() {
    this.gain = this.props.audioContext.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(this.props.audioContext.destination);

    this.autorun = autorun(() => {
      if (this.props.store.morseText !== "") {
        this.playString(this.props.store.morseText);
        this.props.store.clearText();
      }
    });
  }

  componentWillUmount() {
    this.autorun();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}))

MorsePlayer.propTypes = {
  speed: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
}

export default MorsePlayer;
