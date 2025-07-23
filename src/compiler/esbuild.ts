import * as esbuild from 'esbuild-wasm';

let esbuildInitializationPromise: Promise<void> | null = null;

export const initializeEsbuild = async () => {
  if (!esbuildInitializationPromise) {
    esbuildInitializationPromise = esbuild.initialize({
      wasmURL: 'https://esm.sh/esbuild-wasm@0.25.8/esbuild.wasm',
    });
  }
  return esbuildInitializationPromise;
};
