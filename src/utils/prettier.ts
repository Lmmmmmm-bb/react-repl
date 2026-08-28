import type { RequiredOptions } from 'prettier';
import type { VirtualFile } from '~/virtual-file';
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
  const ext = getVirtualFileExt(file.filename);
  const { default: prettier } = await import('prettier/standalone');
  let prettierPlugins;

  if (ext === 'css') {
    const { default: parserCSS } = await import('prettier/parser-postcss');
    prettierPlugins = [parserCSS];
  } else {
    const [estree, parser] = await Promise.all([
      import('prettier/plugins/estree'),
      ext === 'json'
        ? import('prettier/plugins/babel')
        : import('prettier/plugins/typescript'),
    ]);
    prettierPlugins = [estree.default, parser.default];
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
