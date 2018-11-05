import React from "react";

const UnsupportedBrowser = ({ missingFeatures }) => (
  <div>
    <h1>Unsupported web browser</h1>
    <div className="md-text-container md-text-justify">
      Morse Camp relies on the following features not supported by your web
      browser:
      <ul>
        {missingFeatures.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      Please try upgrading or using a recent version of any of the following
      instead:
      <ul>
        <li>Google Chrome (or Chromium)</li>
        <li>Mozilla Firefox</li>
        <li>Microsoft Edge</li>
        <li>Apple Safari</li>
        <li>Opera</li>
      </ul>
      If your web browser supports the features above, we apologize for the
      error. Please <a href="https://blog.morse.camp/contact">contact us</a> to
      let us know and we'll try to fix it. Thank you.
    </div>
  </div>
);

export default UnsupportedBrowser;
