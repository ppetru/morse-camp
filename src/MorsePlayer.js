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

      ' ':' ',
      '\t':'  ',
      '\n':'   ',
  }

  speed = (wpm) => {
		// 1200ms per dit is 1WPM
		this.ditLength = 1200/wpm;
	}

  foo = (message) => {
    let character = 'a';
		var lengthSum=0;
		var now = this.props.audioContext.currentTime;
		// set ramp time to 2 periods
		var rampTime = 1/this.oscillator.frequency.value*2;
		for(let i=0;i<character.length;i++) {
			// iterate dits and dahs
			if (character[i]==='.') {
				this.gain.gain.linearRampToValueAtTime(
					0, now + (lengthSum+1)*this.ditLength/1000);
				this.gain.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+1)*this.ditLength/1000 +
					rampTime);

				this.gain.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+2)*this.ditLength/1000);
				this.gain.gain.linearRampToValueAtTime(
					0, now + (lengthSum+2)*this.ditLength/1000 +
					rampTime);

				lengthSum+=2;
			} else if (character[i]==='-') {
				this.gain.gain.linearRampToValueAtTime(
					0, now + (lengthSum+1)*this.ditLength/1000);
				this.gain.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+1)*this.ditLength/1000 +
					rampTime);

				this.gain.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+4)*this.ditLength/1000);
				this.gain.gain.linearRampToValueAtTime(
					0, now + (lengthSum+4)*this.ditLength/1000 +
					rampTime);

				lengthSum+=4;
			} else if (character[i]===' ') {
				lengthSum+=3; // plus 2 for last character and 2 for this added below = 7
			}
		}
    window.setTimeout(() => {
			this.play();
		}, (lengthSum+2)*this.ditLength);
		// two additional dits pause sum up to three dits between characters

	} // play

  soundOn = time => {
    this.gain.gain.setValueAtTime(1.0, time);
  }

  soundOff = time => {
    this.gain.gain.setValueAtTime(0.0, time);
  }

  playChar = (t, c) => {
    for (var i = 0; i < c.length; i++) {
      switch(c[i]) {
      case '.':
          this.soundOn(t);
          t += this.ditLength/1000;
          this.soundOff(t);
          break;
      case '-':
          this.soundOn(t);
          t += 3 * this.ditLength/1000;
          this.soundOff(t);
          break;
      default:
      }
      t += this.ditLength/1000;
    }
    return t;
  }

  playString = s => {
    s = s.toUpperCase();
    var t = this.props.audioContext.currentTime;
    for (var i = 0; i < s.length; i++) {
      // TODO: handle prosigns
      if (s[i] === ' ') {
        t += 3 * this.ditLength/1000;
      } else if (this.morseCodes[s[i]] !== undefined) {
        t = this.playChar(t, this.morseCodes[s[i]]);
        t += 2 * this.ditLength/1000;
      } else {
        console.log("Character '", s[i], "' unknown");
      };
    };
  }

  componentDidMount() {
    this.speed(this.props.speed);

    // Volume 1 = 100%, more leads to harmonics due to overmodulation
    this.volume = 1;

    this.oscillator = this.props.audioContext.createOscillator();
    this.gain = this.props.audioContext.createGain();

    this.gain.gain.setValueAtTime(0.0, this.props.audioContext.currentTime);
    this.oscillator.frequency.value = this.props.frequency;

    this.oscillator.connect(this.gain);
    this.oscillator.start();

    this.gain.connect(this.props.audioContext.destination);

    this.autorun = autorun(() => {
      if (this.props.store.morseText !== "") {
        console.log("playing", this.props.store.morseText);
        this.playString(this.props.store.morseText);
        this.props.store.clearText();
      }
    });
  }

  componentWillUmount() {
    this.autorun();
  }

  componentWillReceiveProps(nextProps) {
    this.speed(nextProps.speed);
		this.oscillator.frequency.value = nextProps.frequency;
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
