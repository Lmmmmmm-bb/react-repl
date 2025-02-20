import type { VirtualFileStore } from './types';
import type { VirtualFile } from '~/virtual-file';
import AppCSSRaw from '~/templates/App.css?raw';

import AppRaw from '~/templates/App?raw';
import MainLegacyRaw from '~/templates/main-legacy?raw';
import MainRaw from '~/templates/main?raw';
import WelcomeCSSRaw from '~/templates/Welcome.css?raw';
import WelcomeRaw from '~/templates/Welcome?raw';
import { decompress } from '~/utils/compress';
import {
  ENTRY_FILE,
  ENTRY_STYLE,
  MAIN_FILE,
  MAIN_LEGACY_FILE,
  WELCOME_FILE,
  WELCOME_STYLE,
} from './config';

const defaultVirtualFiles: Record<string, VirtualFile> = {
  [MAIN_FILE]: {
    hidden: true,
    filename: MAIN_FILE,
    code: MainRaw,
  },
  [MAIN_LEGACY_FILE]: {
    hidden: true,
    filename: MAIN_LEGACY_FILE,
    code: MainLegacyRaw,
  },
  [ENTRY_FILE]: {
    filename: ENTRY_FILE,
    code: AppRaw,
  },
  [ENTRY_STYLE]: {
    filename: ENTRY_STYLE,
    code: AppCSSRaw,
  },
  [WELCOME_FILE]: {
    filename: WELCOME_FILE,
    code: WelcomeRaw,
  },
  [WELCOME_STYLE]: {
    filename: WELCOME_STYLE,
    code: WelcomeCSSRaw,
  },
};

export const defaultVirtualFileStore: VirtualFileStore = {
  files: defaultVirtualFiles,
  activeFile: defaultVirtualFiles[ENTRY_FILE],
};

export const restoreVirtualFileStore = (): VirtualFileStore => {
  const hash = location.hash.slice(1);

  if (!hash.length) {
    return { ...defaultVirtualFileStore };
  }

  try {
    const restoreFiles = JSON.parse(decompress(hash));

    return {
      files: restoreFiles.files,
      activeFile: restoreFiles.files[ENTRY_FILE],
    };
  } catch {
    return { ...defaultVirtualFileStore };
  }
};
