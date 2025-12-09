import { reaction } from "mobx";

class SettingsSaver {
  setupSettings(module, noDebounce) {
    this.loadSettings = this.transport.loadSettings(module).then((json) => {
      if (json) {
        this.setFromJson(json);
      }
    });

    var opts = {};
    if (!noDebounce) {
      opts.delay = 500;
    }

    this.saveHandler = reaction(
      () => this.asJson,
      (json) => this.transport.saveSettings(module, json),
      opts,
    );
  }
}

export default SettingsSaver;
