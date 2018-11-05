import React, { PureComponent, Component } from "react";
import {
  Button,
  DialogContainer,
  FontIcon,
  Slider,
  List,
  Checkbox,
  ListItemControl
} from "react-md";
import { inject, observer } from "mobx-react";
import { Helmet } from "react-helmet";
import { dictionary } from "./Words";

import { makeLogger } from "./analytics";

const event = makeLogger("Settings");

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
      event("clear storage");
      const { store } = this.props;
      store.transport.clear().then(() => {
        store.morse.setupActiveDictionary();
        store.appStore.addToast("Storage cleared");
        window.location.reload();
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
            iconEl={<FontIcon>delete</FontIcon>}
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

const TestButton = inject("store", "morsePlayer")(
  class TestButton extends Component {
    playCount = 0;
    playInterval;

    playLoop = () => {
      if (!this.props.store.morse.playing) {
        if (this.playCount === 0) {
          this.playCount++;
          this.playHello();
        } else if (this.playCount > 1) {
          clearInterval(this.playInterval);
          this.playInterval = undefined;
        } else {
          this.playCount++;
          setTimeout(() => {
            this.playHello();
          }, this.props.store.morse.delay);
        }
      }
    };

    playHello = () => {
      this.props.morsePlayer.playString("hello");
    };

    render() {
      return (
        <Button
          raised
          primary
          className="md-block-centered"
          iconEl={<FontIcon>play_arrow</FontIcon>}
          onClick={() => {
            event("test");
            if (this.playInterval === undefined) {
              this.playCount = 0;
              this.playInterval = setInterval(this.playLoop, 50);
            }
          }}
        >
          Test
        </Button>
      );
    }
  }
);

const DictionaryOptions = inject("store", "morsePlayer")(
  observer(({ store, morsePlayer }) => (
    <div>
      <h4>
        <b>Dictionary Options</b>
      </h4>
      Include
      <List className={"md-cell md-cell--10 md-paper md-paper--2"}>
        {dictionary.allTypes.map(type => (
          <div key={type}>
            <ListItemControl
              primaryAction={
                <Checkbox
                  id={"list-control-primary-" + type}
                  name="list-control-primary"
                  label={type}
                  disabled={
                    store.morse.includeCount() <= 1 && store.morse.types[type]
                  }
                  checked={store.morse.types[type]}
                  onChange={value => {
                    store.morse.setType(type, value);
                    store.morse.setupActiveDictionary();
                  }}
                />
              }
            />
          </div>
        ))}
      </List>
      <Slider
        id="activeDictionarySize"
        label="Number Of Entries"
        editable
        max={store.morse.maxDictionarySize}
        min={10}
        step={1}
        value={store.morse.activeDictionarySize}
        onChange={value => store.morse.setActiveDictionarySize(value)}
        leftIcon={<FontIcon>build</FontIcon>}
      />
    </div>
  ))
);

const Settings = inject("store", "morsePlayer")(
  observer(({ store, morsePlayer }) => (
    <div>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h1>Settings</h1>
      <div>
        <br />
        <h2>Morse tone</h2>
        <div>
          <Slider
            id="speed"
            label="Speed (WPM)"
            editable
            max={80}
            min={10}
            value={store.morse.speed}
            onChange={value => store.morse.setSpeed(value)}
            leftIcon={<FontIcon>fast_forward</FontIcon>}
          />
          <Slider
            id="frequency"
            label="Frequency (Hz)"
            editable
            max={1000}
            min={200}
            step={10}
            value={store.morse.frequency}
            onChange={value => store.morse.setFrequency(value)}
            leftIcon={<FontIcon>audiotrack</FontIcon>}
          />
          <Slider
            id="volume"
            label="Voume"
            editable
            max={100}
            min={0}
            value={store.morse.volume}
            onChange={value => store.morse.setVolume(value)}
            leftIcon={<FontIcon>build</FontIcon>}
          />
        </div>
        <br />
        <br />
        <div>
          <h2>Read Trainer</h2>
          <Slider
            id="delay"
            label="Delay Before Repeat (ms)"
            editable
            max={5000}
            min={10}
            step={10}
            value={store.morse.delay}
            onChange={value => store.morse.setDelay(value)}
            leftIcon={<FontIcon>build</FontIcon>}
          />
          <Slider
            id="max repeats"
            label="Max Repeats"
            editable
            max={20}
            min={1}
            step={1}
            value={store.morse.maxRepeats}
            onChange={value => store.morse.setMaxRepeats(value)}
            leftIcon={<FontIcon>build</FontIcon>}
          />
          <DictionaryOptions />
          <br />
          <TestButton />
        </div>
        <br />
        <br />
        <h2>Internals</h2>
        <div>
          <ClearStorage />
        </div>
      </div>
    </div>
  ))
);

export default Settings;
