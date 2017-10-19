import React, { Component } from 'react';
import PropTypes from 'prop-types';


class MorsePlayer extends Component {

  morseCodes = {
      // third column: greek
      // fourth column: cyrillic
      'A':'·−',   'a':'·−',   'Α':'·−',   'А':'·−',
      'B':'−···', 'b':'−···', 'Β':'−···', 'Б':'−···',
      'C':'−·−·', 'c':'−·−·', 'Θ':'−·−·', 'Ц':'−·−·',
      'D':'−··',  'd':'−··',  'Δ':'−··',  'Д':'−··',
      'E':'·',    'e':'·',    'Ε':'·',    'Е':'·',
      'F':'··−·', 'f':'··−·', 'Φ':'··−·',
      'G':'−−·',  'g':'−−·',  'Γ':'−−·',  'Г':'−−·',
      'H':'····', 'h':'····', 'Η':'····', 'Х':'····',
      'I':'··',   'i':'··',               'И':'··',
      'J':'·−−−', 'j':'·−−−',             'Й':'·−−−',
      'K':'−·−',  'k':'−·−',              'К':'−·−', // invitation to transmit
      'L':'·−··', 'l':'·−··',
      'M':'−−',   'm':'−−',
      'N':'−·',   'n':'−·',
      'O':'−−−',  'o':'−−−',
      'P':'·−−·', 'p':'·−−·',
      'Q':'−−·−', 'q':'−−·−', 'Ψ':'−−·−', 'Щ':'−−·−',
      'R':'·−·',  'r':'·−·',  'Ρ':'·−·',
      'S':'···',  's':'···',  'Σ':'···',
      'T':'−',    't':'−',    'Τ':'−',
      'U':'··−',  'u':'··−',
      'V':'···−', 'v':'···−', 'Ж':'···−',
      'W':'·−−',  'w':'·−−',  'Ω':'·−−',  'В':'·−−',
      'X':'−··−', 'x':'−··−',             'Ь':'−··−', 'Ъ':'−··−',
      'Y':'−·−−', 'y':'−·−−', 'Υ':'−·−−', 'Ы':'−·−−',
      'Z':'−−··', 'z':'−−··', 'Ζ':'−−··', 'З':'−−··',

      '0':'−−−−−',
      '1':'·−−−−',
      '2':'··−−−',
      '3':'···−−',
      '4':'····−',
      '5':'·····',
      '6':'−····',
      '7':'−−···',
      '8':'−−−··',
      '9':'−−−−·',

      'À':'·−−·−', 'à':'·−−·−', 'Å':'·−−·−', 'å':'·−−·−',
      'Ä':'·−·−',  'ä':'·−·−',  'æ':'·−·−',  'ą':'·−·−',  'Я':'·−·−',
      'È':'·−··−', 'è':'·−··−', 'ł':'·−··−',
      'É':'··−··', 'é':'··−··', 'đ':'··−··', 'ę':'··−··', 'Э':'··−··',
      'Ö':'−−−·',  'ö':'−−−·',  'ø':'−−−·',  'ó':'−−−·',  'Ч':'−−−·',
      'Ü':'··−−',  'ü':'··−−',  'Ю':'··−−',
      'ç':'−·−··',  'ĉ':'−·−··',  'ć':'−·−··',
      'ĝ':'−−·−·',
      'ŝ':'···−·',

      'ẞ':'···−−··', 'ß':'···−−··',
      'CH':'−−−−', 'ch':'−−−−', 'Š':'−−−−', 'š':'−−−−', 'Χ':'−−−−', 'Ш':'−−−−', 'ĥ':'−−−−',
      'Ñ':'−−·−−', 'ñ':'−−·−−', 'ń':'−−·−−',
      // CH will never be used as there is no equivalent Unicode ligature.

      '.':'·−·−·−',
      ',':'−−··−−',
      ':':'−−−···',
      ';':'−·−·−·',
      '?':'··−−··',
      '!':'−·−·−−',
      '-':'−····−',
      '_':'··−−·−',
      '(':'−·−−·',
      ')':'−·−−·−',
      '\'':'·−−−−·',
      '"':'·−··−·',
      '=':'−···−',
      '+':'·−·−·', // AR
      '/':'−··−·',
      '@':'·−−·−·',
      '$':'···−··−·',
      '&':'·−···', // AS

      '<AA>':'·−·−', // Space down one line (new line)
      '<AR>':'·−·−·', // Stop copying (end of message)
      '<AS>':'·−···', // Wait
      '<BK>':'−···−·−', // BreaK
      '<BT>':'−···−', // Space down two lines (new paragraph)
      '<CL>':'−·−··−··', // CLosing down
      '<CT>':'−·−·−', '<KA>':'−·−·−', // Attention, Commencing Transmission
      '<KN>':'−·−−·', // Invitation to a specific named station to transmit
      '<SK>':'···−·−', '<VA>':'···−·−', // End of contact
      '<SN>':'···−·', '<VE>':'···−·', // Understood
      '<SOS>':'···−−−···', // Serious distress message
      '<HH>':'········', // Error

      ' ':' ',
      '>':'    ', // "visible" pause before message
      '\t':'  ',
      '\n':'   ',
  }

  speed = (wpm) => {
		// 1200ms per dit is 1WPM
		this.ditLength = 1200/wpm;
	}

  play = (message) => {
		// Use already saved message if no new message is given
		message = message || this.message;

		// nothing to do?
		if (message === '') {
			return;
		}

		// already playing?
		if (this.playing) return;
		this.playing = true;

		// Fetch next character from message string:
		var character = message[0];
		this.message = message.slice(1);
		// TODO respect <KA> <SOS>

		// Lookup morse code for next character
		if (!this.morseCodes[character]) {
			console.log("Character '"+character+"' unknown.");
			character = " ";
		}
		character = this.morseCodes[character];


		var lengthSum=0;
		var now = this.props.audioContext.currentTime;
		// set ramp time to 2 periods
		var rampTime = 1/this.oscillatorNode.frequency.value*2;
		for(let i=0;i<character.length;i++) {
			// iterate dits and dahs
			if (character[i]==='·') {
				this.gainNode.gain.linearRampToValueAtTime(
					0, now + (lengthSum+1)*this.ditLength/1000);
				this.gainNode.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+1)*this.ditLength/1000 +
					rampTime);

				this.gainNode.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+2)*this.ditLength/1000);
				this.gainNode.gain.linearRampToValueAtTime(
					0, now + (lengthSum+2)*this.ditLength/1000 +
					rampTime);

				lengthSum+=2;
			} else if (character[i]==='−') {
				this.gainNode.gain.linearRampToValueAtTime(
					0, now + (lengthSum+1)*this.ditLength/1000);
				this.gainNode.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+1)*this.ditLength/1000 +
					rampTime);

				this.gainNode.gain.linearRampToValueAtTime(
					this.volume, now + (lengthSum+4)*this.ditLength/1000);
				this.gainNode.gain.linearRampToValueAtTime(
					0, now + (lengthSum+4)*this.ditLength/1000 +
					rampTime);

				lengthSum+=4;
			} else if (character[i]===' ') {
				lengthSum+=3; // plus 2 for last character and 2 for this added below = 7
			}
		}
    window.setTimeout(() => {
			this.playing = false;
			this.play();
		}, (lengthSum+2)*this.ditLength);
		// two additional dits pause sum up to three dits between characters

	} // play

  componentDidMount() {

    this.speed(this.props.speed);

    // Volume 1 = 100%, more leads to harmonics due to overmodulation
    this.volume = 1;

    // already playing a message?
    this.playing = false;

    // Message to play next
    this.message = '';

    this.gainNode = this.props.audioContext.createGain();
    this.gainNode.connect(this.props.audioContext.destination);
    this.gainNode.gain.value = 0;

    this.oscillatorNode = this.props.audioContext.createOscillator();
    this.oscillatorNode.frequency.value = this.props.frequency;
    this.oscillatorNode.connect(this.gainNode);
    this.oscillatorNode.start(0);

    this.play(this.props.message);
  }

  componentWillUmount() {
		this.message = '';
  }

  componentWillReceiveProps(nextProps) {
    this.speed(nextProps.speed);
		this.oscillatorNode.frequency.value = nextProps.frequency;
    if (nextProps.message !== this.props.message) {
      this.play(nextProps.message);
    }
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

MorsePlayer.propTypes = {
  speed: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  audioContext: PropTypes.object.isRequired,
}

export default MorsePlayer;
