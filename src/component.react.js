import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import QuillToolbar from './toolbar.react';
import mixins from './mixins';

class ReactQuillES6 extends Component {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    readOnly: PropTypes.bool,
    modules: PropTypes.object,
    toolbar: PropTypes.oneOfType([ PropTypes.array, PropTypes.oneOf([false]) ]),
    formats: PropTypes.array,
    styles: PropTypes.oneOfType([ PropTypes.object, PropTypes.oneOf([false]) ]),
    theme: PropTypes.string,
    pollInterval: PropTypes.number,
    onKeyPress: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onChange: PropTypes.func,
    onChangeSelection: PropTypes.func
  }

  static defaultProps = {
      className: '',
      theme: 'snow',
      modules: {
        'link-tooltip': true,
        'image-tooltip': true
      }
  }

  constructor(props) {
    super(props);

    for(let fn in mixins) {
      this[fn] = this::mixins[fn];
    }

    this.dirtyProps = [
      'id',
      'className',
      'modules',
      'toolbar',
      'formats',
      'styles',
      'theme',
      'pollInterval'
    ]

    this.state = {
      value: this.isControlled() ? this.props.value : this.props.defaultValue
    }
  }

  componentWillReceiveProps(nextProps) {
    const editor = this.state.editor;
    if (editor) {
      if ('value' in nextProps) {
        if (nextProps.value !== this.getEditorContents()) {
          this.getEditorContents(editor, nextProps.value);
        }
      }
      if ('readOnly' in nextProps) {
        if (nextProps.readOnly !== this.props.readOnly) {
          this.setEditorReadOnly(editor, nextProps.readOnly);
        }
      }
    }
  }

  componentDidMount() {
    const editor = this.createEditor(this.getEditorElement(), this.getEditorConfig());
  }

  componentWillUnmount() {
    this.destroyEditor(this.state.editor);
  }

  shouldComponentUpdate(nextProps, nextState) {
    for(let key in this.dirtyProps) {
      let prop = this.dirtyProps[key];
      if(nextProps[key] !== this.props[key]) {
        return true;
      }
    }
    false;
  }

  componentWillUpdate() {
    this.componentWillUnmount();
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  setCustomFormats() {
    if (!this.props.formats) {
      return;
    }

    this.props.formats.forEach((format) => {
      let formater = format;
      editor.addFormat(format.name || format, format);
    })
  }

  isControlled() {
    return 'value' in this.props;
  }

  getEditorContents() {
    return this.state.value;
	}

  getEditorElement() {
    return ReactDOM.findDOMNode(this.refs.editor);
	}

  getEditorConfig() {
    let config = {
      readOnly: this.props.readOnly,
      theme: this.props.theme,
      formats: this.props.formats ? [] : undefined,
      styles: this.props.styles,
      modules: this.props.modules,
      pollInterval: this.props.pollInterval
    }

    if (this.props.toolbar !== false && !config.modules.toolbar) {
      config.modules = JSON.parse(JSON.stringify(config.modules));
      config.modules.toolbar = {
        container: ReactDOM.findDOMNode(this.refs.toolbar)
      }
    }

    return config;
  }

  renderContents() {
    if (React.Children.count(this.props.children)) {
      return React.Children.map(
        this.props.children,
        (c) => { return React.cloneElement(c, { ref: c.ref }) }
      )
    } else {
      return [
        this.props.toolbar !== false ? <QuillToolbar  key={`toolbar-${Math.random()}`} ref='toolbar' items={ this.props.toolbar } /> : null,
        <div
          key={`editor-${Math.random()}`}
          ref='editor'
          className='quill-contents'
          dangerouslySetInnerHTML={{ __html: this.getEditorContents() }}
        ></div>
      ]
    }
  }

  render() {
    return (
      <div
        id={ this.props.id }
        style={ this.props.style }
        className={ ['quill'].concat(this.props.className).join(' ') }
        onKeyPress={ this.props.onKeyPress }
        onKeyDown={ this.props.onKeyDown }
        onKeyUp={ this.props.onKeyUp }
        onChange={ this.preventDefault }
      >
        { this.renderContents() }
      </div>
    );
  }
};

export default ReactQuillES6;
