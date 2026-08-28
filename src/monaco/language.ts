import * as monaco from 'monaco-editor';

const BUNDLER_MODULE_RESOLUTION = 100 as monaco.languages.typescript.ModuleResolutionKind;

export const initLanguages = () => {
  monaco.languages.register({ id: 'css', extensions: ['.css'] });
  monaco.languages.register({ id: 'json', extensions: ['.json'] });
  monaco.languages.register({ id: 'javascript', extensions: ['.js', '.jsx'] });
  monaco.languages.register({ id: 'typescript', extensions: ['.ts', '.tsx'] });

  const compilerOptions: monaco.languages.typescript.CompilerOptions = {
    noEmit: true,
    allowJs: true,
    esModuleInterop: true,
    resolveJsonModule: true,
    allowNonTsExtensions: true,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    target: monaco.languages.typescript.ScriptTarget.Latest,
    moduleResolution: BUNDLER_MODULE_RESOLUTION,
  };
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
};
