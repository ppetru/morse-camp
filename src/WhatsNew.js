import React from "react";
import { Helmet } from "react-helmet";

const WhatsNew = () => (
  <div>
    <Helmet>
      <title>What's new</title>
    </Helmet>
    <h1>What's new</h1>
    <div className="md-text-container md-text-justify">
      <h2>January XX, 2018</h2>
      <ul>
        <li>Implemented what's new page</li>
      </ul>
      <h2>January 7, 2018</h2>
      <ul>
        <li>Fix bug when running on Safari browsers</li>
        <li>Lower minimum configurable speed to 10 WPM</li>
        <li>Improve compatibility with older browsers</li>
        <li>
          Show an error page when the browser doesn't support all needed
          features
        </li>
        <li>Improve page metadata</li>
      </ul>
      <h2>January 6, 2018</h2>
      <ul>
        <li>Public launch</li>
      </ul>
    </div>
  </div>
);

export default WhatsNew;
