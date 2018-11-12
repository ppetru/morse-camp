import React, { Component, PureComponent } from "react";
import { inject, observer } from "mobx-react";
import { BottomNavigation, Button, FontIcon } from "react-md";
import { Helmet } from "react-helmet";

import { dictionary } from "../Words";
import {
  trimDictionary,
  computeWordWeights,
  generateText
} from "../TextGenerator";
import { makeLogger } from "../analytics";

import HelpScreen from "./HelpScreen";
import Configuration from "./Configuration";
import PlayText from "./PlayText";
import "./ReadTrainer.scss";

const event = makeLogger("ReadTrainer");

const PlayLoop = inject("store")(
  class PlayLoop extends Component {
    state = {
      text: ""
    };

    pickText = (previousText = "") => {
      const store = this.props.store.readTrainer;

      // If there are performance issues on slower devices, we may want to consider caching
      // the trimmed dictionary. It is relatively expensive. It will need to be invalidated
      // whenever the user changes the active dictionary.
      const trimmedDictionary = trimDictionary(
        dictionary.wordFrequency,
        this.props.store.morse.activeDictionarySize
      );

      const candidates = computeWordWeights(
        trimmedDictionary,
        store.words,
        Date.now()
      );

      var text;
      while (text === undefined || text === null) {
        text = generateText(candidates, store.minLength, store.maxLength);

        // With small dictionaries we may need to bump up the max size to find
        // one or more words.
        if (text === undefined || text === null) {
          store.setMaxLength(store.maxLength + 1);
        }
      }

      // When the same word is selected twice in a row (which can be caused
      // by a limited number of entries in the dictionary), adding a space
      // allows the word to be used immediately again.
      // (this is a workaround necessary due to the way setState() is (ab)used -- it needs a new value for things to work)
      if (previousText === text) {
        text += " ";
      }
      this.setState({ text });
    };

    componentDidMount() {
      this.pickText();
    }

    onResult = (success, count) => {
      const store = this.props.store.readTrainer;
      store.textFeedback(this.state.text, success, count, Date.now());
      store.adjustLengths();
      this.pickText(this.state.text);
    };

    render() {
      const { text } = this.state;
      return <PlayText text={text} onResult={this.onResult} />;
    }
  }
);

const TextSettings = inject("store")(
  observer(({ store }) => (
    <div className="horizontal-container">
      <div className="horizontal-box">
        <span>Min:</span>
        <Button
          primary
          icon
          onClick={() => {
            store.readTrainer.setMinLength(store.readTrainer.minLength - 1);
            store.readTrainer.resetLengthCount(store.readTrainer.minLength);
          }}
        >
          arrow_downward
        </Button>
        <span>{store.readTrainer.minLength}</span>
        <Button
          primary
          icon
          onClick={() => {
            store.readTrainer.setMinLength(store.readTrainer.minLength + 1);
            store.readTrainer.resetLengthCount(store.readTrainer.minLength);
          }}
        >
          arrow_upward
        </Button>
      </div>
      <div className="horizontal-box">
        <span>Max:</span>
        <Button
          primary
          icon
          onClick={() => {
            store.readTrainer.setMaxLength(store.readTrainer.maxLength - 1);
            store.readTrainer.resetLengthCount(store.readTrainer.maxLength);
          }}
        >
          arrow_downward
        </Button>
        <span>{store.readTrainer.maxLength}</span>
        <Button
          primary
          icon
          onClick={() => {
            store.readTrainer.setMaxLength(store.readTrainer.maxLength + 1);
            store.readTrainer.resetLengthCount(store.readTrainer.maxLength);
          }}
        >
          arrow_upward
        </Button>
      </div>
    </div>
  ))
);

const ReadTrainerPlayer = inject("store", "morsePlayer")(
  observer(
    class ReadTrainerPlayer extends Component {
      state = {
        active: false
      };

      start = () => {
        event("start", this.props.store.morse.speed);
        this.setState({ active: true });
      };

      stop = () => {
        event("stop");
        this.props.morsePlayer.forceStop();
        this.setState({ active: false });
      };

      render() {
        const { active } = this.state;

        var button;
        if (active) {
          button = (
            <Button
              raised
              primary
              onClick={this.stop}
              iconEl={<FontIcon>stop</FontIcon>}
            >
              Stop
            </Button>
          );
        } else {
          button = (
            <Button
              raised
              primary
              onClick={this.start}
              iconEl={<FontIcon>play_arrow</FontIcon>}
            >
              Start
            </Button>
          );
        }

        return (
          <div className="vcontainer">
            <div className="top-card">
              <h2>Text length</h2>
              <TextSettings />
              <div className="horizontal-container center-justify">
                {button}
              </div>
            </div>
            {active && <PlayLoop />}
          </div>
        );
      }
    }
  )
);

const links = [
  {
    label: "Train",
    icon: <FontIcon>play_arrow</FontIcon>
  },
  {
    label: "Configuration",
    icon: <FontIcon>tune</FontIcon>
  },
  {
    label: "Instructions",
    icon: <FontIcon>help</FontIcon>
  }
];

class ReadTrainer extends PureComponent {
  state = { children: <ReadTrainerPlayer /> };

  handleNavChange = activeIndex => {
    let children;
    switch (activeIndex) {
      case 1:
        children = <Configuration key="config" />;
        event("configuration");
        break;
      case 2:
        children = <HelpScreen key="help" />;
        event("help");
        break;
      default:
        children = <ReadTrainerPlayer key="trainer" />;
        event("play_tab");
    }

    this.setState({ children });
  };

  render() {
    const { children } = this.state;

    return (
      <div className="vcontainer">
        <Helmet>
          <title>Read Trainer</title>
        </Helmet>
        <main className="vcontainer md-bottom-navigation-offset">
          {children}
        </main>
        <BottomNavigation
          links={links}
          dynamic={false}
          onNavChange={this.handleNavChange}
        />
      </div>
    );
  }
}

export default ReadTrainer;
