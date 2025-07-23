import * as esbuild from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';

let esbuildInitialized = false;

export const initializeEsbuild = async () => {
  if (!esbuildInitialized) {
    await esbuild.initialize({ wasmURL: wasmUrl });
    esbuildInitialized = true;
  }
};
