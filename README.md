# react-quill-es6

This origin from [Quill](http://quilljs.com/) and [react-quill](https://github.com/zenoamaro/react-quill)

# Demo Installation
github clone:
```
git clone https://github.com/madeinfree/react-quill-es6
```

# Quick Start
```javascript
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
```

# License
MIT
