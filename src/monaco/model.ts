import * as monaco from 'monaco-editor';
import { initVirtualFileStore, updateFileContent } from '~/stores/virtual-file';
import { defaultVirtualFileStore } from '~/stores/virtual-file/init';
import { getVirtualFileLanguage } from '~/virtual-file';

const modelDisposals = new Map<string, monaco.IDisposable>();

const getModelUri = (filename: string) => monaco.Uri.from({
  scheme: 'file',
  path: `/${filename}`,
});

export const getOrCreateMonacoModel = (file: { filename: string; code: string }) => {
  const uri = getModelUri(file.filename);
  const currentModel = monaco.editor.getModel(uri);

  if (currentModel) {
    return currentModel;
  }

  const model = monaco.editor.createModel(
    file.code,
    getVirtualFileLanguage(file.filename),
    uri,
  );
  const disposal = model.onDidChangeContent(() => {
    updateFileContent(file.filename, model.getValue());
  });
  modelDisposals.set(file.filename, disposal);

  return model;
};

export const disposeMonacoModel = (filename: string) => {
  modelDisposals.get(filename)?.dispose();
  modelDisposals.delete(filename);
  monaco.editor.getModel(getModelUri(filename))?.dispose();
};

export const initModels = () => {
  Object.values(initVirtualFileStore.files)
    .forEach(item => getOrCreateMonacoModel(item));
};

export const resetModels = () => {
  [...modelDisposals.keys()].forEach(disposeMonacoModel);

  Object.values(defaultVirtualFileStore.files)
    .forEach(item => getOrCreateMonacoModel(item));
};
