import { getVirtualFileExt } from '~/virtual-file';

export const ensureReactImport = (code: string) => {
  const hasImportReact = /import\s+React/.test(code);
  if (!hasImportReact) {
    return `import React from 'react';\n${code}`;
  }
  return code;
};

// Transform CSS file to JavaScript module that injects styles
export const transformCSSImport = (filename: string, code: string) => {
  const styleInject = `
    (() => {
      const prevStyle = document.querySelector('style[data-file="${filename}"]');

      const newStyle = document.createElement('style');
      newStyle.setAttribute('data-file', '${filename}');
      newStyle.innerHTML = \`${code.replace(/`/g, '\\`')}\`;

      // remove prev style after new style insert
      document.head.appendChild(newStyle);
      prevStyle && prevStyle.remove();
    })()`;

  return {
    loader: 'js' as const,
    contents: styleInject,
  };
};

// Transform JSON file to JavaScript module with default export
export const transformJsonImport = (code: string) => ({
  loader: 'js' as const,
  contents: `export default ${code}`,
});

// Transform JavaScript/TypeScript file with React import injection
export const transformScriptImport = (filename: string, code: string) => {
  const ext = getVirtualFileExt(filename);
  const loader = ext === 'tsx' ? 'tsx' : ext === 'ts' ? 'ts' : 'jsx';

  return {
    contents: ensureReactImport(code),
    loader: loader as 'tsx' | 'ts' | 'jsx',
  };
};

// ESBuild plugin to handle virtual file imports
