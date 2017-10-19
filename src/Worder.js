import React, { Component } from 'react';

import Button from 'react-md/lib/Buttons/Button';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';

import MorsePlayer from './MorsePlayer';

class Worder extends Component {
  render() {
    return (
      <div>
        <MorsePlayer
          speed={30}
          frequency={500}
          message="hi"
        />
      </div>
    )
  }
}

export default Worder;
