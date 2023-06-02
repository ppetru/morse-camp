import React from "react";
import { Helmet } from "react-helmet";

const WhatsNew = () => (
  <div>
    <Helmet>
      <title>What's new</title>
    </Helmet>
    <h1>What's new</h1>
    <div className="md-text-container">
      <h2>June 2, 2023</h2>
      <ul>
        <li>Analytics code update to deal with impending deprecation.</li>
      </ul>
      <h2>July 3, 2021</h2>
      <ul>
        <li>
          Bugfix: some configuration options were sometimes not being correctly
          restored.
        </li>
        <li>Update some dependencies to fix security vulnerabilities.</li>
      </ul>
      <h2>November 14, 2019</h2>
      <ul>
        <li>Add link to groups.io discussion forum.</li>
        <li>
          Upgrade to latest version of react-scripts and associated
          dependencies.
        </li>
      </ul>
      <h2>November 5, 2019</h2>
      <ul>
        <li>Update dependencies to several security vulnerabilities.</li>
      </ul>
      <h2>July 11, 2019</h2>
      <ul>
        <li>Update dependencies to fix lodash security vulnerability.</li>
      </ul>
      <h2>February 16, 2019</h2>
      <ul>
        <li>Manual control of word lengths.</li>
      </ul>
      <h2>December 16, 2018</h2>
      <ul>
        <li>Added popular callsigns to the dictionary.</li>
        <li>
          User-supplied dictionaries now compute word frequencies in the input
          text.
        </li>
      </ul>
      <h2>November 15, 2018</h2>
      <ul>
        <li>Read trainer: support user-supplied dictionaries.</li>
        <li>Bugfix for issue that could cause the read trainer to lock up.</li>
      </ul>
      <h2>November 13, 2018</h2>
      <ul>
        <li>Option for randomly variable audio frequency.</li>
        <li>Fix for bug introduced with yesterday's version.</li>
      </ul>
      <h2>November 12, 2018</h2>
      <ul>
        <li>Read trainer: support manual repeats.</li>
        <li>Better configuration for Farnsworth settings.</li>
        <li>Separated global settings from Read trainer settings.</li>
      </ul>
      <h2>November 11, 2018</h2>
      <ul>
        <li>Read trainer: keyboard shortcuts.</li>
        <li>Farnsworth timing support using the ARRL standard.</li>
      </ul>
      <h2>November 9, 2018</h2>
      <ul>
        <li>Read trainer: configurable dictionary.</li>
        <li>Read trainer: dictionary now has more entries.</li>
        <li>Multiple bug fixes.</li>
      </ul>
      <h2>October 17, 2018</h2>
      <ul>
        <li>Read trainer: configurable repeat delay and max count.</li>
        <li>Adjustable Morse tone volume.</li>
      </ul>
      <h2>May 10, 2018</h2>
      <ul>
        <li>Handle the Chrome autoplay policy change.</li>
      </ul>
      <h2>April 21, 2018</h2>
      <ul>
        <li>Open source release.</li>
      </ul>
      <h2>January 20, 2018</h2>
      <ul>
        <li>Play numbers in common formats (years, ages, RST reports)</li>
        <li>
          Bug fix: when manually changing min/max length, no longer
          automatically change it again right away
        </li>
      </ul>
      <h2>January 18, 2018</h2>
      <ul>
        <li>
          Good results on text of a given length now also count towards stats
          for lower lenghts
        </li>
        <li>Less aggressively repeat difficult words</li>
        <li>Generate text from random multi-word combinations</li>
        <li>Implemented this what's new page</li>
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
