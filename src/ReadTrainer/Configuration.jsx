import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import { inject, observer } from "mobx-react";
import { dictionary } from "../Words.js";
import TestButton from "../TestButton.jsx";

const SliderWithInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon,
}) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography>{label}</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        sx={{ flex: 1 }}
      />
      <TextField
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) onChange(val);
        }}
        type="number"
        size="small"
        inputProps={{ min, max, step }}
        sx={{ width: 80 }}
      />
    </Box>
  </Box>
);

const RepeatOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Repeats
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={store.readTrainer.automaticallyRepeat}
            onChange={(e) =>
              store.readTrainer.setAutomaticallyRepeat(e.target.checked)
            }
          />
        }
        label="Automatically Repeat"
      />

      {store.readTrainer.automaticallyRepeat && (
        <Box sx={{ mt: 2 }}>
          <SliderWithInput
            label="Delay Before Repeat (ms)"
            value={store.readTrainer.delay}
            onChange={(value) => store.readTrainer.setDelay(value)}
            min={10}
            max={5000}
            step={10}
            icon={<SettingsIcon />}
          />
          <SliderWithInput
            label="Max Repeats"
            value={store.readTrainer.maxRepeats}
            onChange={(value) => store.readTrainer.setMaxRepeats(value)}
            min={1}
            max={20}
            icon={<SettingsIcon />}
          />
          <TestButton repeatCount={2} />
        </Box>
      )}
      <Box sx={{ mb: 2 }} />
    </div>
  )),
);

const MiscellaneousOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Miscellaneous
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={store.readTrainer.automaticallyIncreaseDifficulty}
            onChange={(e) =>
              store.readTrainer.setAutomaticallyIncreaseDifficulty(
                e.target.checked,
              )
            }
          />
        }
        label="Automatically Increase Difficulty"
      />
      <Box sx={{ mb: 2 }} />
    </div>
  )),
);

const BuiltInDictionaryOptions = inject("store")(
  observer(({ store }) => (
    <>
      <Paper sx={{ mb: 2 }}>
        <List dense>
          {dictionary.allTypes.map((type) => (
            <ListItem key={type} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (
                    !(
                      store.readTrainer.includeCount() <= 1 &&
                      store.readTrainer.types[type]
                    )
                  ) {
                    store.readTrainer.setType(
                      type,
                      !store.readTrainer.types[type],
                    );
                    store.readTrainer.setActiveDictionarySize(
                      dictionary.wordType.size,
                    );
                  }
                }}
                disabled={
                  store.readTrainer.includeCount() <= 1 &&
                  store.readTrainer.types[type]
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={store.readTrainer.types[type]}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={type} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      <SliderWithInput
        label="Number Of Entries"
        value={store.readTrainer.activeDictionarySize}
        onChange={(value) => store.readTrainer.setActiveDictionarySize(value)}
        min={10}
        max={store.readTrainer.maxDictionarySize}
        icon={<SettingsIcon />}
      />
    </>
  )),
);

const UserDictionaryOptions = inject("store")(
  observer(({ store }) => {
    const readTrainerStore = store.readTrainer;
    const [dictionaryText, setDictionaryText] = useState(
      readTrainerStore.userDictionaryAsText,
    );

    const handleSave = useCallback(() => {
      readTrainerStore.setUserDictionaryFromText(dictionaryText);
      setDictionaryText(readTrainerStore.userDictionaryAsText);
    }, [readTrainerStore, dictionaryText]);

    return (
      <>
        <Typography variant="subtitle1">
          {[...readTrainerStore.userDictionary.keys()].length} user defined
          words
        </Typography>
        <TextField
          label="Dictionary (space, comma, or newline separated words)"
          multiline
          rows={5}
          maxRows={10}
          fullWidth
          value={dictionaryText}
          onChange={(e) => setDictionaryText(e.target.value)}
          sx={{ my: 2 }}
        />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Saving will normalize and deduplicate the dictionary.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          onClick={handleSave}
          sx={{ display: "block", margin: "0 auto" }}
        >
          Save
        </Button>
      </>
    );
  }),
);

const DictionaryOptions = inject("store")(
  observer(({ store }) => (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Dictionary
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Type</FormLabel>
        <RadioGroup
          row
          value={store.readTrainer.useUserDictionary.toString()}
          onChange={(e) =>
            store.readTrainer.setUseUserDictionary(e.target.value === "true")
          }
        >
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="Built in"
          />
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="User supplied"
          />
        </RadioGroup>
      </FormControl>
      {store.readTrainer.useUserDictionary ? (
        <UserDictionaryOptions />
      ) : (
        <BuiltInDictionaryOptions />
      )}
    </div>
  )),
);

const Configuration = () => (
  <Box className="vcontainer" sx={{ maxWidth: 600 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Configuration
    </Typography>
    <RepeatOptions />
    <MiscellaneousOptions />
    <DictionaryOptions />
    <div className="filler-card" />
  </Box>
);

export default Configuration;
