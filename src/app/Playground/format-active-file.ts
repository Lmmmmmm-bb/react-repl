import { updateFileContent, useVirtualFileStore } from '~/stores/virtual-file';

export const formatActiveFile = async () => {
  const activeFile = useVirtualFileStore.getState().activeFile;
  const [{ getOrCreateMonacoModel }, { formatCode }] = await Promise.all([
    import('~/monaco'),
    import('~/utils/prettier'),
  ]);
  const formattedCode = await formatCode(activeFile);

  if (useVirtualFileStore.getState().activeFile.filename !== activeFile.filename) {
    return;
  }

  updateFileContent(formattedCode);
  getOrCreateMonacoModel(activeFile).setValue(formattedCode);
};
