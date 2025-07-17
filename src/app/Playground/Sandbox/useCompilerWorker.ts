import { useCallback, useEffect, useRef } from 'react';
import CompilerWorker from './compiler.worker?worker&inline';

export const useCompilerWorker = <T extends (event: MessageEvent) => void>(fn: T) => {
  const workerRef = useRef<Worker | null>(null);

  const sendWorkerMessage = useCallback((message: any) => {
    workerRef.current && workerRef.current.postMessage(message);
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      return;
    }

    workerRef.current = new CompilerWorker();
    workerRef.current.addEventListener('message', fn);

    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener('message', fn);
        workerRef.current = null;
      }
    };
  }, [fn]);

  return { workerRef, sendWorkerMessage };
};
