import type { VirtualFile } from '~/virtual-file';
import * as monaco from 'monaco-editor';
import { getVirtualFileLanguage } from '~/virtual-file';
import { resetCoreLib } from './core-lib';
import { resetExtraLib } from './extra-lib';
import { resetModels } from './model';

export const registerLib = (content: string, path: string) => {
  const tsDisposal = monaco.languages.typescript.typescriptDefaults.addExtraLib(content, path);
  const jsDisposal = monaco.languages.typescript.javascriptDefaults.addExtraLib(content, path);

  return () => {
    tsDisposal.dispose();
    jsDisposal.dispose();
  };
};

export const getOrCreateMonacoModel = (file: VirtualFile) => {
  const uri = monaco.Uri.parse(`file:///${file.filename}`);
  const model = monaco.editor.getModel(uri); ;

  if (model) {
    return model;
  }

  return monaco.editor.createModel(
    file.code,
    getVirtualFileLanguage(file.filename),
    uri,
  );
};

export const resetMonaco = () => {
  resetModels();
  resetCoreLib();
  resetExtraLib();
};
