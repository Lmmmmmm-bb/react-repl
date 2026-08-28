import type { editor } from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { formatActiveFile } from '~/app/Playground/format-active-file';
import { monaco, monacoOptions } from '~/monaco';

export const useEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (!containerRef.current) {
      throw new Error('Cannot find editor container');
    }

    const monacoInstance = monaco.editor.create(containerRef.current, monacoOptions);
    performance.mark('repl:editor-ready');
    performance.measure('repl:editor', 'repl:bootstrap', 'repl:editor-ready');
    monacoInstance.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      () => formatActiveFile(),
    );

    editorRef.current = monacoInstance;

    return () => {
      editorRef.current && editorRef.current.dispose();
      editorRef.current = null;
    };
  }, []);

  return {
    editorRef,
    containerRef,
  };
};
