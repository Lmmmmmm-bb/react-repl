import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from 'esbuild-wasm/esbuild.wasm?url';

let esbuildInitializationPromise: Promise<void> | null = null;

export const initializeEsbuild = async () => {
  if (!esbuildInitializationPromise) {
    esbuildInitializationPromise = esbuild.initialize({
      wasmURL: esbuildWasmUrl,
    });
  }
  return esbuildInitializationPromise;
};
