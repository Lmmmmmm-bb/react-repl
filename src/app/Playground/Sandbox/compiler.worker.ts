/// <reference lib="WebWorker" />

import { transform } from '~/compiler';
import { MAIN_FILE, MAIN_LEGACY_FILE } from '~/stores/virtual-file';

globalThis.addEventListener('message', async (event: MessageEvent) => {
  try {
    const payload = event.data;
    const entryFile = payload.files[payload.isLegacy ? MAIN_LEGACY_FILE : MAIN_FILE];
    const transformedCode = await transform(
      entryFile,
      payload.files,
      payload.packages || [],
    );
    globalThis.postMessage({
      type: 'COMPILER_DONE',
      data: transformedCode,
    });
  } catch (error) {
    if (error instanceof Error) {
      // remove message prefix filenames only keep the last
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const message = error.message.replace(/^.*\/(.*: .*)/, '$1');
      globalThis.postMessage({ type: 'COMPILER_ERROR', data: message });
    }
  }
});
