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
        onChange={checked => store.morse.setAutomaticallyRepeat(checked)}
        checked={store.morse.automaticallyRepeat}
      />

      {store.morse.automaticallyRepeat ? (
        <div>
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
                  store.morse.setActiveDictionarySize(dictionary.wordType.size);
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
