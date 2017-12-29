import { action, extendObservable } from "mobx";

class AppStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      appCached: false,
      updateAvailable: false,

      notifyCached: action(() => {
        this.appCached = true;
      }),
      notifyUpdate: action(() => {
        this.updateAvailable = true;
      })
    });
  }
}

export default AppStore;
