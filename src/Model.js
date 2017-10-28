import { action, extendObservable } from 'mobx';

class Model {
  constructor() {
    extendObservable(this, {
      step: "start",
      morseText: "",
      playing: false,
      stopRequest: false,

      startStep: action(() => {
        this.step = "start";
      }),
      playStep: action(() => {
        this.step = "play";
      }),
      showStep: action(() => {
        this.step = "show";
      }),
      playText: action(text => {
        this.morseText = text;
      }),
      clearText: action(() => {
        this.morseText = "";
      }),
      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
        this.stopRequest = false;
      }),
      requestStopPlaying: action(() => {
        this.stopRequest = true;
      }),

      get isPlaying() {
        return (this.step === "play");
      }
    })
  }
}

export default Model;
