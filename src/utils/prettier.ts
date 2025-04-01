import type { Plugin, RequiredOptions } from 'prettier';
import type { VirtualFile } from '~/virtual-file';
import prettier from 'prettier/standalone';
import { getVirtualFileExt } from '~/virtual-file';

const prettierConfig: Partial<RequiredOptions> = {
  tabWidth: 2,
  endOfLine: 'lf',
  trailingComma: 'all',
  arrowParens: 'always',
  semi: true,
  useTabs: false,
  singleQuote: true,
  bracketSpacing: true,
  jsxSingleQuote: false,
  bracketSameLine: false,
};

export const formatCode = async (file: VirtualFile) => {
  let prettierPlugins: Plugin[] = [];
  const ext = getVirtualFileExt(file.filename);

  if (ext === 'css') {
    const parserCSS = await import('prettier/parser-postcss');
    prettierPlugins = [parserCSS];
  } else {
    prettierPlugins = await Promise.all([
      import('prettier/plugins/estree'),
      ext === 'json'
        ? import('prettier/plugins/babel')
        : import('prettier/plugins/typescript'),
    ]) as Plugin[];
  }

  const parser = ext === 'css'
    ? 'css'
    : ext === 'json' ? 'json' : 'typescript';
  const formattedCode = await prettier.format(file.code, {
    parser,
    plugins: prettierPlugins,
    ...prettierConfig,
  });

  return formattedCode;
};
