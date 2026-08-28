import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import og from 'vite-plugin-open-graph';

// The compiler currently prunes external-store guards in the debounced search effect.
const shouldUseReactCompiler = (filename: string) =>
  !filename.replaceAll('\\', '/').endsWith('/Settings/Install/index.tsx');

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { sources: shouldUseReactCompiler }],
        ],
      },
    }),
    og({
      basic: {
        siteName: 'React Playground',
        title: 'React Playground',
        url: 'https://repl.lmmmmmm.dev',
        image: 'https://repl.lmmmmmm.dev/og.png',
        description: 'An interactive React playground',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'React Playground',
        imageAlt: 'React REPL',
        image: 'https://repl.lmmmmmm.dev/og.png',
        description: 'An interactive React playground',
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['esbuild-wasm'],
  },
  worker: {
    format: 'es',
  },
  define: {
    __BUILD_TIME__: JSON.stringify(
      new Date().toLocaleString(),
    ),
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vite/preload-helper') || id.includes('vite/modulepreload-polyfill')) {
            return 'app-runtime';
          }
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('monaco-editor/esm/vs/language/typescript/')) {
            return 'editor-language-typescript';
          }
          if (id.includes('monaco-editor/esm/vs/language/css/')) {
            return 'editor-language-css';
          }
          if (id.includes('monaco-editor/esm/vs/language/json/')) {
            return 'editor-language-json';
          }
          if (id.includes('monaco-editor/esm/vs/editor/editor.worker')) {
            return 'editor-worker-runtime';
          }
          if (id.includes('monaco-editor')) {
            return 'editor-monaco';
          }
          if (id.includes('/shiki/') || id.includes('@shikijs')) {
            return 'editor-highlight';
          }
          if (id.includes('prettier/standalone')) {
            return 'formatter-core';
          }
          if (id.includes('prettier/parser-postcss')) {
            return 'formatter-postcss';
          }
          if (id.includes('prettier/plugins/typescript')) {
            return 'formatter-typescript';
          }
          if (id.includes('prettier/plugins/babel')) {
            return 'formatter-babel';
          }
          if (id.includes('prettier/plugins/estree')) {
            return 'formatter-estree';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-radix';
          }
          if (/node_modules\/(?:react|react-dom|scheduler)\//.test(id)) {
            return 'react-vendor';
          }
          if (id.includes('react-resizable-panels')) {
            return 'ui-resizable';
          }
          return undefined;
        },
      },
    },
  },
});
