import { action, extendObservable } from 'mobx';

class Model {
  constructor() {
    extendObservable(this, {
      step: "start",
      morseText: "",
      start: action(() => {
        this.step = "start";
      }),
      play: action(() => {
        this.step = "play";
      }),
      show: action(() => {
        this.step = "show";
      }),
      playText: action(text => {
        this.morseText = text;
      }),
      clearText: action(() => {
        this.morseText = "";
      }),
    })
  }
}

export default Model;
