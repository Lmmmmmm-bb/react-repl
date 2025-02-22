import type { VirtualFile } from '~/virtual-file';
import { getVirtualFileExt, isValidFilename } from '~/virtual-file';
import { transform } from './transform';

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
  })()`;
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

export const esmImportTransformPlugin = (files: Record<string, VirtualFile>) => {
  const declarationTransform = (path: any) => {
    const importValue: string = path.node.source.value;
    if (importValue.startsWith('./')) {
      const importFile = getVirtualFileByImportPath(importValue, files);
      if (!importFile) {
        return;
      }

      const ext = getVirtualFileExt(importFile.filename);
      if (ext === 'css') {
        path.node.source.value = transformCSSImport(importFile);
      } else if (ext === 'json') {
        path.node.source.value = transformJsonImport(importFile);
      } else {
        path.node.source.value = transformScriptImport(importFile, files);
      }
    }
  };

  return {
    visitor: {
      ImportDeclaration: declarationTransform,
      ExportNamedDeclaration: declarationTransform,
    },
  };
};
