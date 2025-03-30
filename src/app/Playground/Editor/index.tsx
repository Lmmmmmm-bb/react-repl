import type { FC } from 'react';
import { useEffect } from 'react';
import { useEditor } from '~/hooks/useEditor';
import { getOrCreateMonacoModel } from '~/monaco';
import { useVirtualFileStore } from '~/stores/virtual-file';

const Editor: FC = () => {
  const { activeFile } = useVirtualFileStore();

  const { editorRef, containerRef } = useEditor();

  useEffect(() => {
    if (!editorRef.current || !activeFile) {
      return;
    }

    const model = getOrCreateMonacoModel(activeFile);
    editorRef.current.setModel(model);
    editorRef.current.focus();
  }, [activeFile, editorRef]);

  return (
    <div
      className="relative size-full overflow-hidden"
      ref={containerRef}
    />
  );
};

export default Editor;
