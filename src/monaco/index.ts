import { setupMonaco } from './setup';

export const monaco = setupMonaco();

export { monacoOptions } from './config';
export { registerCorePackageToMonaco } from './core-lib';
export { registerExtraPackageToMonaco } from './extra-lib';
export { disposeMonacoModel, getOrCreateMonacoModel } from './model';
export { resetMonaco } from './utils';
