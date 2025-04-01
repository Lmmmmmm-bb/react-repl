import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

export const useElementSize = (elRef: RefObject<HTMLDivElement | null>) => {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!elRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const [el] = entries;
      const rect = el.contentRect;
      setElementSize({ width: rect.width, height: rect.height });
    });

    observer.observe(elRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [elRef]);

  return elementSize;
};
