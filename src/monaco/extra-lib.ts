import type { Package } from '~/stores/package';
import { initialPackageStore, usePackageStore } from '~/stores/package';
import { defaultPackageStore } from '~/stores/package/init';
import { loadPackageTypes } from './package-types';
import { registerLib, registerLibs } from './utils';

const packageRegistrationRequests = new Map<string, symbol>();

export const registerExtraPackageToMonaco = async (lib: Package) => {
  const { extraPackageDisposal } = usePackageStore.getState();
  const requestId = Symbol(lib.name);
  packageRegistrationRequests.set(lib.name, requestId);
  const previousDisposal = extraPackageDisposal.get(lib.name);
  previousDisposal?.();
  extraPackageDisposal.delete(lib.name);

  const bundle = await loadPackageTypes(lib);
  const { extraPackages } = usePackageStore.getState();
  const installedPackage = extraPackages.find(item => item.name === lib.name);
  if (
    packageRegistrationRequests.get(lib.name) !== requestId
    || installedPackage?.version !== lib.version
  ) {
    return;
  }

  const disposeBundle = registerLibs(bundle.files);
  extraPackageDisposal.set(lib.name, disposeBundle);
};

export const initExtraLib = async () => {
  registerLib(
    `declare module "*.json" {
      const value: any;
      export default value;
    }`,
    'file:///node_modules/client.d.ts',
  );

  await Promise.all(
    initialPackageStore
      .extraPackages
      .map(item => registerExtraPackageToMonaco(item)),
  );
};

export const resetExtraLib = async () => {
  await Promise.all(
    defaultPackageStore
      .extraPackages
      .map(item => registerExtraPackageToMonaco(item)),
  );
};
