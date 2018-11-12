class MorsePlayer {
  morseCodes = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",

    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",

    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "/": "-..-.",

    "<AR>": ".-.-.",
    "<AS>": ".-...",
    "<BK>": "-...-.-",
    "<BT>": "-...-",
    "<CL>": "-.-..-..",
    "<KN>": "-.--.",
    "<SK>": "...-.-"
  };

  randomFrequency = -1;
  ditsPerWord = 50; // dits in 'PARIS'

  // ARRL Farnsworth formulas cf. http://www.arrl.org/files/file/Technology/x9004008.pdf
  get addedFarnsworthDelay() {
    return (
      (60 * this.store.characterSpeed - 37.2 * this.store.effectiveSpeed) /
      (this.store.characterSpeed * this.store.effectiveSpeed)
    );
  }

  get extraCharacterSpace() {
    return (3 * this.addedFarnsworthDelay) / 19;
  }

  get extraWordSpace() {
    return (7 * this.addedFarnsworthDelay) / 19;
  }

  get farnsworthEnabled() {
    return this.store.characterSpeed !== this.store.effectiveSpeed;
  }

  get ditLength() {
    return 60 / this.ditsPerWord / this.store.characterSpeed;
  }

  get characterSpace() {
    if (this.farnsworthEnabled) {
      return 3 * this.ditLength + this.extraCharacterSpace;
    } else {
      return 3 * this.ditLength;
    }
  }

  get wordSpace() {
    if (this.farnsworthEnabled) {
      return 7 * this.ditLength + this.extraWordSpace;
    } else {
      return 7 * this.ditLength;
    }
  }

  get timeConstant() {
    return 2 / this.store.frequency;
  }

  soundOn = time => {
    this.gain.gain.setTargetAtTime(
      this.store.volume / 100.0,
      time,
      this.timeConstant
    );
  };

  soundOff = time => {
    this.gain.gain.setTargetAtTime(0.0, time, this.timeConstant);
  };

  playChar = (t, c) => {
    for (var i = 0; i < c.length; i++) {
      switch (c[i]) {
        case ".":
          this.soundOn(t);
          t += this.ditLength;
          this.soundOff(t);
          break;
        case "-":
          this.soundOn(t);
          t += 3 * this.ditLength;
          this.soundOff(t);
          break;
        default:
      }
      t += this.ditLength;
    }
    // remove the space added after the last element -- there'll be a
    // (potentially longer) character or word space added afterwards
    t -= this.ditLength;
    return t;
  };

  resetRandomFrequency = () => {
    let frequency = -1;
    while (
      !(
        frequency >= this.store.lowerBoundFrequency &&
        frequency <= this.store.upperBoundFrequency
      )
    ) {
      frequency = Math.floor(Math.random() * this.store.upperBoundFrequency);
    }
    this.randomFrequency = frequency;
  };

  playString = s => {
    if (this.playing) {
      return;
    }
    // in case this is the first user gesture and the context is suspended
    // (https://goo.gl/7K7WLu)
    if (this.audioContext.state !== "running") {
      this.audioContext.resume();
    }
    s = s.toUpperCase();
    this.store.startedPlaying();
    this.makeOscillator();
    this.oscillator.start();
    this.playing = true;
    let t = this.audioContext.currentTime;
    t += 3 * this.ditLength;
    var i = 0;
    while (i < s.length) {
      let char;
      if (s[i] === "<") {
        char = s.slice(i, i + 4);
        i += 3;
      } else {
        char = s[i];
      }
      if (char === " ") {
        if (i > 0) {
          // If this isn't the first character in the string then we need to
          // first deduct the character space added after the last played
          // character.
          t -= this.characterSpace;
        }
        t += this.wordSpace;
      } else if (this.morseCodes[char] !== undefined) {
        t = this.playChar(t, this.morseCodes[char]);
        t += this.characterSpace;
      } else {
        console.log("Character '", char, "' unknown");
      }
      i++;
    }
    this.oscillator.stop(t);
  };

  makeOscillator = () => {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.gain);

    if (this.store.randomFrequency) {
      if (this.randomFrequency === -1) {
        this.resetRandomFrequency();
      }
      this.oscillator.frequency.value = this.randomFrequency;
    } else {
      this.oscillator.frequency.value = this.store.frequency;
    }

    this.oscillator.addEventListener("ended", event => {
      this.playing = false;
      this.store.stoppedPlaying();
    });
  };

  forceStop = () => {
    if (this.playing) {
      const t = this.audioContext.currentTime;
      this.gain.gain.cancelScheduledValues(t);
      this.soundOff(t + this.ditLength); // gracefully ramp down in case the tone was on
      // TODO: this is not necessary until/unless we do something more
      // interesting in the ended event listener. Meanwhile, it causes Safari
      // to throw an invalid state exception (because somehow mobx ends up
      // calling things twice and/or takes a while to propagate values.
      //this.oscillator.stop(t + 7 * this.ditLength); // leave some space between words
    }
  };

  constructor(store, audioContext) {
    this.store = store;
    this.audioContext = audioContext;

    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(this.audioContext.destination);

    this.playing = false;
    this.oscillator = null;
  }
}

export default MorsePlayer;
