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

    "<AR>": ".-.-.",
    "<AS>": ".-...",
    "<BK>": "-...-.-",
    "<BT>": "-...-",
    "<CL>": "-.-..-..",
    "<KN>": "-.--.",
    "<SK>": "...-.-"
  };

  get ditLength() {
    // 1.2s per dit is 1WPM
    return 1.2 / this.store.speed;
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
    return t;
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
        t += 4 * this.ditLength; // +3 after the last char = 7 for inter-word
      } else if (this.morseCodes[char] !== undefined) {
        t = this.playChar(t, this.morseCodes[char]);
        t += 2 * this.ditLength; // +1 after the last symbol = 3 for inter-char
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
    this.oscillator.frequency.value = this.store.frequency;
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
