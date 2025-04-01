import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import Container from '~/components/Container';
import FormatIcon from '~/icons/Format';
import { getOrCreateMonacoModel, monaco } from '~/monaco';
import { updateFileContent, useVirtualFileStore } from '~/stores/virtual-file';
import { formatCode } from '~/utils/prettier';

const { Action } = Container;

const Format: FC = () => {
  const activeFile = useVirtualFileStore(state => state.activeFile);

  const handleFormat = useCallback(async () => {
    const formattedCode = await formatCode(activeFile);

    updateFileContent(formattedCode);
    const model = getOrCreateMonacoModel(activeFile);
    model.setValue(formattedCode);
  }, [activeFile]);

  useEffect(() => {
    const disposable = monaco.editor.registerCommand(
      'format-code',
      () => handleFormat(),
    );

    return () => {
      disposable.dispose();
    };
  }, [handleFormat]);

  return (
    <Action
      title="[⌥⇧F] Format Code"
      data-umami-event="Format"
      onClick={handleFormat}
    >
      <FormatIcon className="size-5" />
    </Action>
  );
};

export default Format;
