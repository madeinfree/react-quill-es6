import React, {
  Component, PropTypes
} from 'react';

import ReactDOMServer from 'react-dom/server';

const defaultColors = [
	'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
	'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
	'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
	'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
	'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
	'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
	'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
	'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
	'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
	'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
	'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
	'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
].map(function(color){ return { value: color } });

const defaultItems = [

	{ label:'Formats', type:'group', items: [
		{ label:'Font', type:'font', items: [
      { label:'Sans Serif',  value:'sans-serif', selected:true },
      { label:'Serif',       value:'serif' },
      { label:'Monospace',   value:'monospace' }
		]},
		{ type:'separator' },
		{ label:'Size', type:'size', items: [
      { label:'Small',  value:'10px' },
      { label:'Normal', value:'13px', selected:true },
      { label:'Large',  value:'18px' },
      { label:'Huge',   value:'32px' }
		]},
		{ type:'separator' },
		{ label:'Alignment', type:'align', items: [
      { label:'', value:'left', selected:true },
      { label:'', value:'center' },
      { label:'', value:'right' },
      { label:'', value:'justify' }
		]}
	]},

	{ label:'Text', type:'group', items: [
    { type:'bold', label:'Bold' },
    { type:'italic', label:'Italic' },
    { type:'strike', label:'Strike' },
    { type:'underline', label:'Underline' },
    { type:'separator' },
    { type:'color', label:'Color', items:defaultColors },
    { type:'background', label:'Background color', items:defaultColors },
    { type:'separator' },
    { type:'link', label:'Link' }
	]},

	{ label:'Blocks', type:'group', items: [
    { type:'bullet', label:'Bullet' },
    { type:'separator' },
    { type:'list', label:'List' }
	]},

	{ label:'Blocks', type:'group', items: [
    { type:'image', label:'Image' }
	]}

];

export default class QuillToolBar extends Component {
  constructor(props) {
    super(props);

    this.renderSeparator = (key) => {
      return (
        <span
          key={ key }
          className={ `ql-format-separator` }
        >
        </span>
      )
    },

    this.renderGroup = (item, key) => {
      return (
        <span
          key={ item.label || key }
          className={ `ql-format-group` }
        >
          { item.items.map(this.renderItem) }
        </span>
      )
  	}

    this.renderChoiceItem = (item, key) => {
      return (
        <option
          key={ item.label || item.value || key }
          value={ item.value }
        >
          { item.label }
        </option>
      )
  	}

    this.renderChoices = (item, key) => {
  		var attrs = {
        key: item.label || key,
        title: item.label,
        className: 'ql-'+item.type
  		};
  		var self = this;
  		var choiceItems = item.items.map(function(item, key) {
        if (item.selected) {
          attrs.defaultValue = item.value;
        }
        return self.renderChoiceItem(item, key);
  		})
      return (
        <select
          { ...attrs }
        >
          { choiceItems }
        </select>
      )
  	}

    this.renderAction = (item, key) => {
      return (
        <span
          key={ item.label || item.value || key }
          className={ `ql-format-button ql-${item.type}` }
          title={ item.label }
        >
          { item.children }
        </span>
      )
  	}

    this.renderItem = (item, key) => {
  		switch (item.type) {
        case 'separator':
          return this.renderSeparator(key);
        case 'group':
          return this.renderGroup(item, key);
        case 'font':
        case 'align':
        case 'size':
        case 'color':
        case 'background':
          return this.renderChoices(item, key);
        default:
          return this.renderAction(item, key);
  		}
  	}

    this.renderAction = (item, key) => {
      return React.DOM.span({
        key: item.label || item.value || key,
        className: 'ql-format-button ql-'+item.type,
        title: item.label },
        item.children
      );
    }
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    items: PropTypes.array
  }

  static defaultProps = {
    items: defaultItems
  }

  getClassName() {
    return 'quill-toobar ' + ( this.props.className || '' );
  }

  render() {
    const children = this.props.items.map(this.renderItem);
    const html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
    return (
      <div
        className={ this.getClassName() }
        style={ this.props.style || {} }
        dangerouslySetInnerHTML={ { __html:html } }
      >
      </div>
    );
  }
};
