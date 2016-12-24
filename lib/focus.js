'use babel';

import { CompositeDisposable, Range } from 'atom'

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
    }));
  },

  deactivate()
  {
    this.subscriptions.dispose()
  },

  destroy()
  {
    this.destroyDecorations([this.decoration, this.nodecoration])
    this.setCachedDecoration(null, null)
  },

  destroyDecorations(decorations)
  {
    decorations.forEach( decoration => {
      if(decoration !== null) {
        decoration.destroy()
      }
    })
  },

  toggle()
  {
    if((editor = this.getEditor()) && this.decoration === null) {
      this.createDecorationFromCurrentSelection()
    } else {
      this.destroy()
    }
  },

  createDecorationFromCurrentSelection()
  {
    decoration = this.createDecoration(this.getEditor().getSelectedBufferRange(), 'focus')
    nodecoration = this.createDecoration(this.getFullEditorRange(), 'nofocus')
    this.setCachedDecoration(decoration, nodecoration)
  },

  createDecoration(range, name)
  {
    marker = this.getEditor().markBufferRange(range, {invalidate: 'never'})
    return this.getEditor().decorateMarker(marker, {type: 'line', class: name})
  },

  setCachedDecoration(decoration, nodecoration)
  {
    this.decoration = decoration
    this.nodecoration = nodecoration
  },

  getFullEditorRange()
  {
    return new Range([0,0], [this.getEditor().getLineCount()-1,0])
  },

  getEditor()
  {
    return atom.workspace.getActiveTextEditor()
  }
};
