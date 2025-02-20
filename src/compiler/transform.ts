import type { VirtualFile } from '~/virtual-file';
import { transform as babelTransform } from '@babel/standalone';
import { esmImportTransformPlugin } from './plugins';

const ensureReactImport = (code: string) => {
  const hasImportReact = /import\s+React/.test(code);

  if (!hasImportReact) {
    return `import React from 'react';\n${code}`;
  }
  return code;
};

export const transform = (file: VirtualFile, files: Record<string, VirtualFile>) => {
  const transformed = babelTransform(ensureReactImport(file.code), {
    presets: ['react', 'typescript'],
    filename: file.filename,
    plugins: [esmImportTransformPlugin(files)],
  });

  return transformed.code || '';
};
