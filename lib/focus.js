'use babel';

import { CompositeDisposable, Range } from 'atom';

export default {
  subscriptions: null,
  decoration: null,
  nodecoration: null,

  activate(state)
  {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'focus:toggle': () => this.toggle(),
      'focus:destroy': () => this.destroy(),
    }));
  },

  deactivate()
  {
    this.subscriptions.dispose()
  },

  destroy()
  {
    if(this.decoration !== null) {
      this.decoration.destroy()
      this.decoration = null
    }

    if(this.nodecoration !== null) {
      this.nodecoration.destroy()
      this.nodecoration = null
    }
  },

  toggle()
  {
    if((editor = atom.workspace.getActiveTextEditor()) && this.decoration === null) {
        this.createDecorationFromCurrentSelection(editor, 'line')
    }
  },

  createDecorationFromCurrentSelection(editor, type)
  {
      range = editor.getSelectedBufferRange()
      lines = editor.getLineCount()
      marker = editor.markBufferRange(range, {invalidate: 'never'})
      backgroundMarker = editor.markBufferRange(new Range([0,0], [lines-1,0]), {invalidate: 'never'})
      decoration = editor.decorateMarker(backgroundMarker, {type: type, class: type+'-nofocus'})
      nodecoration = editor.decorateMarker(marker, {type: type, class: type+'-focus'})
      this.setCachedDecoration(decoration, nodecoration)
  },

  setCachedDecoration(decoration, nodecoration)
  {
      this.decoration = decoration
      this.nodecoration = nodecoration
  },
};
