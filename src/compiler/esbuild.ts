import * as esbuild from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';

let esbuildInitializationPromise: Promise<void> | null = null;

export const initializeEsbuild = async () => {
  if (!esbuildInitializationPromise) {
    esbuildInitializationPromise = esbuild.initialize({ wasmURL: wasmUrl });
  }
  return esbuildInitializationPromise;
};
