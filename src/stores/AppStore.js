import { action, extendObservable, observable } from "mobx";

class AppStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      toasts: observable([]),
      autohide: true,

      addToast: action((text, action, autohide = true) => {
        this.toasts.push({ text, action });
        this.autohide = autohide;
      }),
      dismissToast: action(() => {
        this.toasts.shift();
      }),
      notifyCached: action(() => {
        this.addToast("App can now be used offline", "OK", false);
      }),
      notifyUpdate: action(() => {
        this.addToast(
          "New app version available",
          {
            children: "Reload",
            onClick: () => {
              window.location.reload(true);
            }
          },
          false
        );
      })
    });
  }
}

export default AppStore;
