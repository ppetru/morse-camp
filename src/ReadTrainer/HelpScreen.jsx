import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./ReadTrainer.scss";

const HelpScreen = () => (
  <div>
    <Typography variant="h4" component="h1" gutterBottom>
      Instructions
    </Typography>
    <Box sx={{ maxWidth: 600, textAlign: "justify" }}>
      <Typography paragraph>
        This trainer teaches you to "read" text by ear.
      </Typography>
      <Typography paragraph>
        You will hear a text of adjustable length formed from the words selected
        in the Configuration tab.
      </Typography>
      <Typography paragraph>
        Listen to the text until you fully decode it, then press "Show". Grade
        yourself and listen to the text some more if you did not read it
        correctly.
      </Typography>
      <Typography paragraph>
        If your device has a keyboard, you can use shortcuts. Press the SPACE
        key in place of the SHOW button. When it is available, press R for
        REPEAT. Press the left arrow key for a CORRECT answer and the right
        arrow key for an INCORRECT answer.
      </Typography>
      <Typography paragraph>
        The difficulty adjusts automatically and problematic words repeat until
        learned.
      </Typography>
    </Box>
  </div>
);

export default HelpScreen;
