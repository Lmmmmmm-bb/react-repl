import * as monaco from 'monaco-editor';
import { REPL_THEME_CHANGE_EVENT } from '~/stores/theme/config';

import { initCoreLib } from './core-lib';
import { initEnvWorker } from './env';
import { initEditorEvent } from './event';
import { initExtraLib } from './extra-lib';
import { initEmmet, initHighlight } from './highlight';
import { initLanguages } from './language';
import { initModels } from './model';

let isMonacoInitialized = false;
let isShikiReady = false;

const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const applyTheme = (theme = getTheme()) => {
  const monacoTheme = isShikiReady
    ? `vitesse-${theme}`
    : theme === 'dark' ? 'vs-dark' : 'vs';
  monaco.editor.setTheme(monacoTheme);
};

const scheduleEnhancements = () => {
  const loadEnhancements = () => {
    initHighlight()
      .then(() => {
        isShikiReady = true;
        applyTheme();
      })
      .catch(error => console.error('Failed to initialize editor highlighting:', error));
    initCoreLib()
      .catch(error => console.error('Failed to initialize editor type libraries:', error));
    initExtraLib()
      .catch(error => console.error('Failed to initialize package type libraries:', error));
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadEnhancements, { timeout: 1500 });
  } else {
    setTimeout(loadEnhancements);
  }
};

export const setupMonaco = () => {
  if (isMonacoInitialized) {
    return monaco;
  }

  initEnvWorker();
  initLanguages();
  initEmmet();
  initEditorEvent();
  initModels();
  applyTheme();
  window.addEventListener(REPL_THEME_CHANGE_EVENT, (event) => {
    applyTheme((event as CustomEvent<'light' | 'dark'>).detail);
  });
  scheduleEnhancements();

  isMonacoInitialized = true;

  return monaco;
};
