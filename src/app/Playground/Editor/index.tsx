import type { FC } from 'react';
import { useEffect } from 'react';
import { useEditor } from '~/hooks/useEditor';
import { getOrCreateMonacoModel } from '~/monaco';
import { revealPendingEditorNavigation } from '~/monaco/event';
import { useVirtualFileStore } from '~/stores/virtual-file';

const Editor: FC = () => {
  const activeFilename = useVirtualFileStore(state => state.activeFile.filename);

  const { editorRef, containerRef } = useEditor();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const activeFile = useVirtualFileStore.getState().files[activeFilename];
    const model = getOrCreateMonacoModel(activeFile);
    editorRef.current.setModel(model);
    revealPendingEditorNavigation(editorRef.current, activeFilename);
    editorRef.current.focus();
  }, [activeFilename, editorRef]);

  return (
    <div
      className="relative size-full overflow-hidden"
      ref={containerRef}
    />
  );
};

export default Editor;
