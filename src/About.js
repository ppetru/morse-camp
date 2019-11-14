import React from "react";
import { Helmet } from "react-helmet";

import "./About.scss";

const About = () => (
  <div>
    <Helmet>
      <title>About</title>
    </Helmet>
    <h1>About</h1>
    <div className="md-text-container md-text-justify">
      <p>
        Morse Camp trains you to have fluent conversations in Morse code. You
        can use it offline without installing anything, and it works on mobile
        phones as well as on desktop computers.
      </p>
      <p>
        Prior knowledge of the Morse code is assumed. If you're starting from
        scratch, check out the excellent trainer at{" "}
        <a target="_blank" rel="noopener noreferrer" href="https://lcwo.net">
          LCWO.net
        </a>
        .
      </p>
      <p>
        Morse Camp is{" "}
        <a
          href="https://www.fsf.org/about/what-is-free-software"
          target="_blank"
          rel="noopener noreferrer"
        >
          Free Software
        </a>
        . You can check out the{" "}
        <a
          href="https://github.com/ppetru/morse-camp"
          target="_blank"
          rel="noopener noreferrer"
        >
          source code
        </a>{" "}
        and make changes yourself.
      </p>
      <h2>Mobile usage</h2>
      <p>
        To make it easier to come back, select the "Add to home screen" (or
        equivalent) option from your browser menu. The resulting home screen
        icon will then open the app in fullscreen mode and work without an
        internet connection.
      </p>
      <h2>Feedback</h2>
      <p>
        Your feedback and suggestions would be much appreciated at{" "}
        <a
          href="https://github.com/ppetru/morse-camp/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        , the discussion group at{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://groups.io/g/morse-camp"
        >
          morse-camp@groups.io
        </a>
        , or by email at <a href="mailto:op@morse.camp">op@morse.camp</a>.
      </p>
      <h2>Code contributors</h2>
      <ul>
        <li>Kurt Zoglmann, AD0WE</li>
        <li>Petru Paler, HB9GKP</li>
      </ul>
    </div>
  </div>
);

export default About;
