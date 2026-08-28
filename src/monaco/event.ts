import type { editor, IPosition, IRange } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { setActiveFile, useVirtualFileStore } from '~/stores/virtual-file';

interface PendingEditorNavigation {
  filename: string;
  selection?: IPosition | IRange;
}

let pendingEditorNavigation: PendingEditorNavigation | null = null;

const revealSelection = (
  source: editor.ICodeEditor,
  selection?: IPosition | IRange,
) => {
  if (!selection) {
    source.focus();
    return;
  }

  if ('endLineNumber' in selection) {
    source.setSelection(selection);
    source.revealRangeInCenter(selection);
  } else {
    source.setPosition(selection);
    source.revealPositionInCenter(selection);
  }
  source.focus();
};

export const revealPendingEditorNavigation = (
  source: editor.ICodeEditor,
  filename: string,
) => {
  if (pendingEditorNavigation?.filename !== filename) {
    return;
  }

  revealSelection(source, pendingEditorNavigation.selection);
  pendingEditorNavigation = null;
};

export const initEditorEvent = () => {
  monaco.editor.registerEditorOpener({
    openCodeEditor: (source, resource, selectionOrPosition) => {
      if (resource.scheme !== 'file') {
        return false;
      }

      const { activeFile, files } = useVirtualFileStore.getState();
      const filename = resource.path.replace(/^\/+/, '');
      const file = files[filename];

      if (!file) {
        return false;
      }

      if (activeFile.filename === filename) {
        revealSelection(source, selectionOrPosition);
      } else {
        pendingEditorNavigation = {
          filename,
          selection: selectionOrPosition,
        };
        setActiveFile(file);
      }

      return true;
    },
  });
};
