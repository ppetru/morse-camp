import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";

import "./About.scss";

const About = () => (
  <Box>
    <Helmet>
      <title>About</title>
    </Helmet>
    <Typography variant="h4" component="h1" gutterBottom>
      About
    </Typography>
    <Box sx={{ maxWidth: 600, textAlign: "justify" }}>
      <Typography paragraph>
        Morse Camp trains you to have fluent conversations in Morse code. You
        can use it offline without installing anything, and it works on mobile
        phones as well as on desktop computers.
      </Typography>
      <Typography paragraph>
        Prior knowledge of the Morse code is assumed. If you're starting from
        scratch, check out the excellent trainer at{" "}
        <Link href="https://lcwo.net" target="_blank" rel="noopener noreferrer">
          LCWO.net
        </Link>
        .
      </Typography>
      <Typography paragraph>
        Morse Camp is{" "}
        <Link
          href="https://www.fsf.org/about/what-is-free-software"
          target="_blank"
          rel="noopener noreferrer"
        >
          Free Software
        </Link>
        . You can check out the{" "}
        <Link
          href="https://github.com/ppetru/morse-camp"
          target="_blank"
          rel="noopener noreferrer"
        >
          source code
        </Link>{" "}
        and make changes yourself.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
        Mobile usage
      </Typography>
      <Typography paragraph>
        To make it easier to come back, select the "Add to home screen" (or
        equivalent) option from your browser menu. The resulting home screen
        icon will then open the app in fullscreen mode and work without an
        internet connection.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
        Feedback
      </Typography>
      <Typography paragraph>
        Your feedback and suggestions would be much appreciated at{" "}
        <Link
          href="https://github.com/ppetru/morse-camp/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Link>
        , the discussion group at{" "}
        <Link
          href="https://groups.io/g/morse-camp"
          target="_blank"
          rel="noopener noreferrer"
        >
          morse-camp@groups.io
        </Link>
        , or by email at <Link href="mailto:op@morse.camp">op@morse.camp</Link>.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
        Code contributors
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>Kurt Zoglmann, AD0WE</li>
        <li>Petru Paler, CT7AZH (ex HB9GKP)</li>
      </Box>
    </Box>
  </Box>
);

export default About;
