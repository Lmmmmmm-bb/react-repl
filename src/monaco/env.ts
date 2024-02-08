import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

export const initEnvWorker = () => {
  window.MonacoEnvironment = {
    getWorker(_: any, label: string) {
      if (['typescript', 'javascript'].includes(label)) {
        return new TsWorker();
      } else if (label === 'css') {
        return new CssWorker();
      } else if (label === 'json') {
        return new JsonWorker();
      } else if (label === 'html') {
        return new HtmlWorker();
      }
      return new EditorWorker();
    },
  };
};