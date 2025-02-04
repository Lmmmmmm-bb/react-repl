import type { CSSProperties, FC } from 'react';
import type { ConsolePayload } from './types';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { useDebounce } from '~/hooks/useDebounce';
import { useElementSize } from '~/hooks/useElementSize';
import { useToggle } from '~/hooks/useToggle';
import { usePackageStore } from '~/stores/package';
import { isLegacyReactDOM } from '~/stores/package/utils';
import { useThemeStore } from '~/stores/theme';
import { useVirtualFileStore } from '~/stores/virtual-file';
import { cn } from '~/utils/cn';
import { appendMessage, clearMessage } from '../store';
import { sandboxAttr } from './config';
import Mounting from './Mounting';
import { useCompilerWorker } from './useCompilerWorker';
import { useSandbox } from './useSandbox';
import VersionNotMatch from './VersionNotMatch';

interface SandboxProps {
  sandboxWidth: number;
  sandboxHeight: number;
}

const Sandbox: FC<SandboxProps> = ({ sandboxWidth, sandboxHeight }) => {
  const theme = useThemeStore(state => state.theme);
  const files = useVirtualFileStore(state => state.files);
  const { isVersionMatch, corePackages, extraPackages } = usePackageStore(
    useShallow((state) => {
      const [react] = state.corePackages.filter(item => item.name === 'react');
      const [reactDOM] = state.corePackages.filter(item => item.name === 'react-dom');
      const isVersionMatch = react.version === reactDOM.version;
      return {
        isVersionMatch,
        corePackages: state.corePackages,
        extraPackages: state.extraPackages,
      };
    }),
  );

  const [isSandboxMounting, toggleIsSandboxMounting] = useToggle();

  const sandboxContainerRef = useRef<HTMLDivElement>(null);
  const { sandboxRef, refreshSandbox, sendSandboxMessage } = useSandbox();

  // eslint-disable-next-line react-compiler/react-compiler
  const { width, height } = useElementSize(sandboxContainerRef);
  const isDefaultDevice = !sandboxWidth && !sandboxHeight;
  const sandboxStyle = useMemo<CSSProperties>(
    () => {
      if (isDefaultDevice) {
        return {};
      }

      const scaleValue = isDefaultDevice
        ? 1
        : Math.min(width / sandboxWidth, height / sandboxHeight);
      return {
        width: sandboxWidth,
        height: sandboxHeight,
        transform: `scale(${scaleValue})`,
        transformOrigin: 'center center',
      };
    },
    [height, isDefaultDevice, sandboxHeight, sandboxWidth, width],
  );

  const { sendWorkerMessage } = useCompilerWorker((event: MessageEvent) => {
    const payload = event.data;
    payload.type === 'COMPILER_DONE' && sendSandboxMessage(payload);
    if (payload.type === 'COMPILER_ERROR') {
      toggleIsSandboxMounting.off();
      appendMessage({ type: 'error', data: [payload.data] });
    }
  });

  const compiler = useDebounce(
    useCallback(
      () => {
        clearMessage();
        sendWorkerMessage({ files, isLegacy: isLegacyReactDOM() });
      },
      [files, sendWorkerMessage],
    ),
    150,
  );

  useEffect(() => {
    clearMessage();
    if (isVersionMatch) {
      toggleIsSandboxMounting.on();
      refreshSandbox();
    }
  }, [
    isVersionMatch,
    extraPackages,
    corePackages,
    toggleIsSandboxMounting,
    refreshSandbox,
  ]);

  useEffect(() => {
    // will run twice in dev mode
    isVersionMatch && compiler();
  }, [compiler, isVersionMatch]);

  useEffect(() => {
    sendSandboxMessage({ type: 'THEME_CHANGE', data: theme });
  }, [theme, sendSandboxMessage]);

  useEffect(() => {
    const handleMessageEvent = (event: MessageEvent) => {
      const payload = event.data;
      payload.type === 'REACT_MOUNT' && toggleIsSandboxMounting.off();
      if (payload.type === 'CONSOLE') {
        const consolePayload: ConsolePayload = payload.data;
        const message = {
          type: consolePayload.level,
          data: consolePayload.data,
        };
        appendMessage(message, consolePayload.duplicate);
      }
    };
    window.addEventListener('message', handleMessageEvent);

    return () => {
      window.removeEventListener('message', handleMessageEvent);
    };
  }, [toggleIsSandboxMounting]);

  return (
    <div
      ref={sandboxContainerRef}
      className={cn(
        ['relative', 'w-full', 'grow', 'overflow-hidden'],
        !isDefaultDevice && ['p-8', 'grid', 'place-content-center'],
      )}
    >
      {isSandboxMounting && isVersionMatch && <Mounting />}
      {!isVersionMatch && <VersionNotMatch />}

      <iframe
        style={sandboxStyle}
        ref={sandboxRef}
        // eslint-disable-next-line react-dom/no-missing-iframe-sandbox
        sandbox={sandboxAttr}
        className={cn(
          ['size-full'],
          !isDefaultDevice
          && isVersionMatch
          && ['border', 'rounded-md', 'overflow-hidden'],
        )}
        onLoad={compiler}
      />
    </div>
  );
};

export default Sandbox;
