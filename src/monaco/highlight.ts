import { emmetCSS, emmetJSX } from 'emmet-monaco-es';
import * as monaco from 'monaco-editor';

let highlightInitializationPromise: Promise<void> | null = null;

export const initEmmet = () => {
  emmetCSS(monaco, ['css']);
  emmetJSX(monaco, ['javascript', 'typescript']);
};

export const initHighlight = () => {
  if (!highlightInitializationPromise) {
    highlightInitializationPromise = (async () => {
      const [
        { shikiToMonaco },
        { createHighlighterCore },
        { createOnigurumaEngine },
        { default: LangCss },
        { default: LangJson },
        { default: LangJsx },
        { default: LangTsx },
        { default: VitesseDark },
        { default: VitesseLight },
      ] = await Promise.all([
        import('@shikijs/monaco'),
        import('shiki/core'),
        import('shiki/engine/oniguruma'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/jsx.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/themes/vitesse-dark.mjs'),
        import('shiki/themes/vitesse-light.mjs'),
      ]);
      const highlighter = await createHighlighterCore({
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
        themes: [VitesseLight, VitesseDark],
        langs: [LangTsx, LangJsx, LangJson, LangCss],
      });

      shikiToMonaco(highlighter, monaco);
    })();
  }

  return highlightInitializationPromise;
};
