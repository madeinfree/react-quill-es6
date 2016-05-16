import Quill from 'quill';

const mixins = {

  hookEditor: (editor) => {
    const unprivilegedEditor = mixins.makeUnprivilegedEditor(editor);

    editor.on('text-change', (delta, source) => {
      if (mixins.onEditorChange) {
        mixins.onEditorChange(
          editor.getHTML(), delta, source,
          unprivilegedEditor
        );
      }
    })

    editor.on('selection-change', (range, source) => {
      if (mixins.onEditorChangeSelection) {
        mixins.onEditorChangeSelection(
          range, source,
          unprivilegedEditor
        );
      }
    })
  },

  destroyEditor: (editor) => {
    editor.destroy();
  },

  setEditorReadOnly: (editor, value) => {
    value ? editor.editor.disable() : editor.editor.enable();
  },

  setEditorContents: (editor, value) => {
    const selection = editor.getSelection();
    editor.setHTML(value || '');
    if (selection) mixins.setEditorSelection(editor, selection);
  },

  setEditorSelection: (editor, range) => {
    if (range) {
      const length = editor.getLength();
      range.start = Math.max(0, Math.min(range.start, length-1));
      range.end = Math.max(range.start, Math.min(range.end, length-1));
    }
    editor.setSelection(range);
  },

  makeUnprivilegedEditor: (editor) => {
    const e = editor;
    return {
      getLength: () => { e.getLength.apply(e, arguments); },
      getText: () => { e.getText.apply(e, arguments); },
      getHTML: () => { e.getHTML.apply(e, arguments); },
      getContents: () => { e.getContents.apply(e, arguments); },
      getSelection: () => { e.getSelection.apply(e, arguments); },
      getBounds: () => { e.getBounds.apply(e, arguments); },
		};
  },

  createEditor: (elem, config) => {
    const editor = new Quill(elem, config);
    mixins.hookEditor(editor);
    return editor
  }
}

export default mixins;
