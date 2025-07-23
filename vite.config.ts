import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import og from 'vite-plugin-open-graph';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler', {}],
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
        manualChunks: {
          shiki: ['shiki', '@shikijs/monaco'],
          editorWorker: ['monaco-editor/esm/vs/editor/editor.worker.js'],
          monaco: ['monaco-editor'],
          resizablePanel: ['react-resizable-panels'],
          prettier: ['prettier'],
          prettierPostcss: ['prettier/parser-postcss'],
          prettierTS: ['prettier/plugins/typescript'],
          prettierBabel: ['prettier/plugins/babel'],
          prettierEstree: ['prettier/plugins/estree'],
        },
      },
    },
  },
});
