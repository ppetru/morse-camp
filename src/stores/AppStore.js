import { makeAutoObservable } from "mobx";

class AppStore {
  toasts = [];
  autohide = true;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
    });
  }

  addToast = (text, action, autohide = true) => {
    this.toasts.push({ text, action });
    this.autohide = autohide;
  };

  dismissToast = () => {
    this.toasts.shift();
  };

  notifyCached = () => {
    this.addToast("App can now be used offline", "OK", false);
  };

  notifyUpdate = () => {
    this.addToast(
      "New app version available",
      {
        children: "Reload",
        onClick: () => {
          window.location.reload(true);
        },
      },
      false,
    );
  };
}

export default AppStore;
