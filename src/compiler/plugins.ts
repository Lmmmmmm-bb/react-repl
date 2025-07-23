import type * as esbuild from 'esbuild-wasm';
import type { VirtualFile } from '~/virtual-file';
import { getVirtualFileExt, isValidFilename } from '~/virtual-file';
import { transformCSSImport, transformJsonImport, transformScriptImport } from './transforms';

export const getVirtualFileByImportPath = (importValue: string, files: Record<string, VirtualFile>) => {
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

export const createVirtualFilePlugin = (files: Record<string, VirtualFile>) => {
  const plugin: esbuild.Plugin = {
    name: 'virtual-files',
    setup(build) {
      // Handle virtual file resolution
      build.onResolve({ filter: /^\.\/.*/ }, (args) => {
        const importValue = args.path.replace(/^\.\/+/, '');
        const virtualFile = getVirtualFileByImportPath(importValue, files);

        if (virtualFile) {
          return {
            namespace: 'virtual-file',
            path: virtualFile.filename,
          };
        }

        return undefined;
      });

      // Handle virtual file loading
      build.onLoad({ filter: /.*/, namespace: 'virtual-file' }, async (args) => {
        const virtualFile = files[args.path];
        if (!virtualFile) {
          return { errors: [{ text: `Virtual file not found: ${args.path}` }] };
        }

        const ext = getVirtualFileExt(virtualFile.filename);

        if (ext === 'css') {
          return transformCSSImport(virtualFile.filename, virtualFile.code);
        }

        if (ext === 'json') {
          return transformJsonImport(virtualFile.code);
        }

        // Handle TypeScript/JavaScript files
        return transformScriptImport(virtualFile.filename, virtualFile.code);
      });
    },
  };

  return plugin;
};
