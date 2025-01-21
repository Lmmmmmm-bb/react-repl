import { shikiToMonaco } from '@shikijs/monaco';
import { emmetCSS, emmetJSX } from 'emmet-monaco-es';
import * as monaco from 'monaco-editor';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import LangCss from 'shiki/langs/css.mjs';
import LangJson from 'shiki/langs/json.mjs';
import LangJsx from 'shiki/langs/jsx.mjs';
import LangTsx from 'shiki/langs/tsx.mjs';
import VitesseDark from 'shiki/themes/vitesse-dark.mjs';
import VitesseLight from 'shiki/themes/vitesse-light.mjs';

const highlighter = await createHighlighterCore({
  engine: createOnigurumaEngine(() => import('shiki/wasm')),
  themes: [VitesseLight, VitesseDark],
  langs: [LangTsx, LangJsx, LangJson, LangCss],
});

export const initHighlight = () => {
  emmetCSS(monaco, ['css']);
  emmetJSX(monaco, ['javascript', 'typescript']);

  shikiToMonaco(highlighter, monaco);
};
