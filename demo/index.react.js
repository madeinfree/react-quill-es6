import React, { Component } from 'react';
import { render } from 'react-dom';

import { QuillComponent } from '../src/index';
import './style/snow.css';

class Demo extends Component {

  render() {
    return (
      <div>
        <QuillComponent />
      </div>
    );
  }
}

render(<Demo />, document.getElementById('viewport'));
