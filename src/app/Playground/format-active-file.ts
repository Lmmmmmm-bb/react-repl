import { useVirtualFileStore } from '~/stores/virtual-file';

export const formatActiveFile = async () => {
  const activeFile = useVirtualFileStore.getState().activeFile;
  const [{ getOrCreateMonacoModel }, { formatCode }] = await Promise.all([
    import('~/monaco'),
    import('~/utils/prettier'),
  ]);
  const formattedCode = await formatCode(activeFile);

  const currentFile = useVirtualFileStore.getState().activeFile;
  if (
    currentFile.filename !== activeFile.filename
    || currentFile.code !== activeFile.code
  ) {
    return;
  }

  getOrCreateMonacoModel(activeFile).setValue(formattedCode);
};
