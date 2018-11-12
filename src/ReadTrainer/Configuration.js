import React from "react";
import {
  FontIcon,
  Slider,
  List,
  Checkbox,
  ListItemControl,
  Switch
} from "react-md";
import { inject, observer } from "mobx-react";
import { dictionary } from "../Words";
import TestButton from "../TestButton";

const RepeatOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <h2>Repeats</h2>
      <Switch
        id="repeat-switch"
        name="repeat"
        label="Automatically Repeat"
        onChange={checked => store.readTrainer.setAutomaticallyRepeat(checked)}
        checked={store.readTrainer.automaticallyRepeat}
      />

      {store.readTrainer.automaticallyRepeat ? (
        <div>
          <Slider
            id="delay"
            label="Delay Before Repeat (ms)"
            editable
            max={5000}
            min={10}
            step={10}
            value={store.readTrainer.delay}
            onChange={value => store.readTrainer.setDelay(value)}
            leftIcon={<FontIcon>build</FontIcon>}
          />
          <Slider
            id="max repeats"
            label="Max Repeats"
            editable
            max={20}
            min={1}
            step={1}
            value={store.readTrainer.maxRepeats}
            onChange={value => store.readTrainer.setMaxRepeats(value)}
            leftIcon={<FontIcon>build</FontIcon>}
          />
          <TestButton repeatCount={2} />
        </div>
      ) : (
        <div>
          <br />
        </div>
      )}
    </div>
  ))
);

const DictionaryOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <h2>Dictionary</h2>
      <List className={"md-cell md-cell--10 md-paper md-paper--2"}>
        {dictionary.allTypes.map(type => (
          <ListItemControl
            key={type}
            primaryAction={
              <Checkbox
                id={"list-control-primary-" + type}
                name="list-control-primary"
                label={type}
                disabled={
                  store.readTrainer.includeCount() <= 1 &&
                  store.readTrainer.types[type]
                }
                checked={store.readTrainer.types[type]}
                onChange={value => {
                  store.readTrainer.setType(type, value);
                  store.readTrainer.setActiveDictionarySize(
                    dictionary.wordType.size
                  );
                }}
              />
            }
          />
        ))}
      </List>
      <Slider
        id="activeDictionarySize"
        label="Number Of Entries"
        editable
        max={store.readTrainer.maxDictionarySize}
        min={10}
        step={1}
        value={store.readTrainer.activeDictionarySize}
        onChange={value => store.readTrainer.setActiveDictionarySize(value)}
        leftIcon={<FontIcon>build</FontIcon>}
      />
    </div>
  ))
);

// TODO: this should probably use md-bottom-navigation-offset instead
const Configuration = () => (
  <div className="vcontainer">
    <h1>Configuration</h1>
    <RepeatOptions />
    <DictionaryOptions />
    <div className="filler-card" />
  </div>
);

export default Configuration;
