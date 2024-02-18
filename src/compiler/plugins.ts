import { transform } from './transform';
import { getVirtualFileExt, isValidFilename } from '~/virtual-file';
import type { VirtualFile } from '~/virtual-file';

const getVirtualFileByImportPath = (importValue: string, files: Record<string, VirtualFile>) => {
  const importFilename = importValue.replace(/^\.\/+/, '');
  if (isValidFilename(importFilename)) {
    return files[importFilename];
  }
  const [file] = Object.values(files).filter((item) => {
    const rawFilename = item.filename.replace(/\.[^/.]+$/, '');
    return rawFilename === importFilename;
  });
  return file;
};

const transformCSSImport = (file: VirtualFile) => {
  const styleInject = `
  (() => {
    const prevStyle = document.querySelector('style[data-file="${file.filename}"]');

    const newStyle = document.createElement('style');
    newStyle.setAttribute('data-file', '${file.filename}');
    newStyle.innerHTML = \`${file.code}\`;

    // remove prev style after new style insert
    document.head.appendChild(newStyle);
    prevStyle && prevStyle.remove();
  })()
  `;
  return URL.createObjectURL(
    new Blob([styleInject], { type: 'application/javascript' }),
  );
};

const transformJsonImport = (file: VirtualFile) => {
  const jsonInject = `export default ${file.code}`;
  return URL.createObjectURL(
    new Blob([jsonInject], { type: 'application/javascript' }),
  );
};

const transformScriptImport = (file: VirtualFile, files: Record<string, VirtualFile>) =>
  URL.createObjectURL(
    new Blob(
      [transform(file, files)],
      { type: 'application/javascript' },
    ),
  );

export const esmImportTransformPlugin = (files: Record<string, VirtualFile>) => ({
  visitor: {
    ImportDeclaration(babel: any) {
      const importValue: string = babel.node.source.value;
      if (importValue.startsWith('./')) {
        const importFile = getVirtualFileByImportPath(importValue, files);
        if (!importFile) {
          return;
        }

        const ext = getVirtualFileExt(importFile.filename);
        if (ext === 'css') {
          babel.node.source.value = transformCSSImport(importFile);
        } else if (ext === 'json') {
          babel.node.source.value = transformJsonImport(importFile);
        } else {
          babel.node.source.value = transformScriptImport(importFile, files);
        }
      }
    },
  },
});
