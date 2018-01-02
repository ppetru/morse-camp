import React, { PureComponent } from "react";
import { Button, DialogContainer, TextField } from "react-md";
import { inject, observer } from "mobx-react";

const ClearStorage = inject("store")(
  class ClearStorage extends PureComponent {
    state = {
      visible: false,
      pageX: null,
      pageY: null
    };

    show = e => {
      let { pageX, pageY } = e;
      if (e.changedTouches) {
        pageX = e.changedTouches[0].pageX;
        pageY = e.changedTouches[0].pageY;
      }

      this.setState({ visible: true, pageX, pageY });
    };

    hide = () => {
      this.setState({ visible: false });
    };

    delete = () => {
      const { store } = this.props;
      store.transport.clear().then(() => {
        store.appStore.addToast("Storage cleared");
      });
      this.hide();
    };

    render() {
      const { visible, pageX, pageY } = this.state;
      const actions = [
        {
          onClick: this.hide,
          primary: true,
          children: "No, nevermind"
        },
        {
          onClick: this.delete,
          primary: false,
          children: "Yes, delete everything"
        }
      ];

      return (
        <div>
          <Button
            raised
            onClick={this.show}
            aria-controls="clear-storage-dialog"
          >
            Clear storage
          </Button>
          <DialogContainer
            id="clear-storage-dialog"
            visible={visible}
            pageX={pageX}
            pageY={pageY}
            modal
            onHide={this.hide}
            aria-labelledby="clear-storage-title"
            actions={actions}
          >
            <p>Reset all settings and progress data?</p>
          </DialogContainer>
        </div>
      );
    }
  }
);

const Settings = inject("store", "morsePlayer")(
  observer(({ store, morsePlayer }) => (
    <div className="md-grid">
      <h1>Settings</h1>
      <div className="md-cell md-cell--12 md-text-container">
        <h2>Morse tone</h2>
        <div>
          <TextField
            id="speed"
            label="Speed (WPM)"
            type="number"
            max={80}
            min={20}
            step={1}
            value={store.morse.speed}
            onChange={(value, e) => store.morse.setSpeed(value)}
          />
          <TextField
            id="frequency"
            label="Frequency (Hz)"
            type="number"
            max={5000}
            min={200}
            step={10}
            value={store.morse.frequency}
            onChange={(value, e) => store.morse.setFrequency(value)}
          />
          <Button
            raised
            primary
            className="md-block-centered"
            onClick={() => morsePlayer.playString("hello")}
          >
            Test
          </Button>
        </div>
        <h2>Internals</h2>
        <div>
          <ClearStorage />
        </div>
      </div>
    </div>
  ))
);

export default Settings;
