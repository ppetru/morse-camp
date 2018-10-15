import React, { PureComponent, Component } from "react";
import { Button, DialogContainer, FontIcon, Slider } from "react-md";
import { inject, observer } from "mobx-react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

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

const Settings = inject("store", "morsePlayer")(
  observer(
    class Settings extends Component {
        playCount = 0;
        playInterval;

        playLoop = () => {
            if(!this.props.store.morse.playing) {
                if(this.playCount === 0) {
                    this.playHello();
                } else if(this.playCount >= 2) {
                    clearInterval(this.playInterval);
                    this.playInterval = undefined;
                } else {
                    setTimeout(() => {
                        this.playHello();
                    }, this.props.store.morse.delay);
                }
            }
        };

        playHello = () => {
            this.playCount++;
            this.props.morsePlayer.playString("hello");
        };

        render() {
            return (
                <div>
                    <Helmet>
                        <title>Settings</title>
                    </Helmet>
                    <h1>Settings</h1>
                    <div>
                        <h2>Morse tone</h2>
                        <div>
                            <Slider
                                id="speed"
                                label="Speed (WPM)"
                                editable
                                max={80}
                                min={10}
                                value={this.props.store.morse.speed}
                                onChange={value => this.props.store.morse.setSpeed(value)}
                                leftIcon={<FontIcon>fast_forward</FontIcon>}
                            />
                            <Slider
                                id="frequency"
                                label="Frequency (Hz)"
                                editable
                                max={1000}
                                min={200}
                                step={10}
                                value={this.props.store.morse.frequency}
                                onChange={value => this.props.store.morse.setFrequency(value)}
                                leftIcon={<FontIcon>audiotrack</FontIcon>}
                            />
                            <Slider
                                id="delay"
                                label="Delay Before Repeat (ms)"
                                editable
                                max={5000}
                                min={10}
                                step={10}
                                value={this.props.store.morse.delay}
                                onChange={value => this.props.store.morse.setDelay(value)}
                                leftIcon={<FontIcon>build</FontIcon>}
                            />
                            <Slider
                                id="max repeats"
                                label="Max Repeats"
                                editable
                                max={20}
                                min={1}
                                step={1}
                                value={this.props.store.morse.maxRepeats}
                                onChange={value => this.props.store.morse.setMaxRepeats(value)}
                                leftIcon={<FontIcon>build</FontIcon>}
                            />
                            <Button
                                raised
                                primary
                                className="md-block-centered"
                                iconEl={<FontIcon>play_arrow</FontIcon>}
                                onClick={() => {
                                    event("test");
                                    if(this.playInterval === undefined) {
                                      this.playCount = 0;
                                      this.playInterval = setInterval(this.playLoop, 50);
                                    }
                                }}
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
            );
        }
    })
      //({ store, morsePlayer, playCount }) => ())
);
Settings.propTypes = {
    playCount: PropTypes.number
}

export default Settings;
