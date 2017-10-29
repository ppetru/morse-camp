import { action, extendObservable } from 'mobx';

class CopyTrainerStore {
  constructor(rootStore) {
    this.rootStore = rootStore

    extendObservable(this, {
      step: "start",

      startStep: action(() => {
        this.step = "start";
      }),
      playStep: action(() => {
        this.step = "play";
      }),
      showStep: action(() => {
        this.step = "show";
      }),

      get isPlaying() {
        return (this.step === "play");
      }
    })
  }
}

export default CopyTrainerStore;
