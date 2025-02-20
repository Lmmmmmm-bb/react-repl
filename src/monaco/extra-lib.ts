import type { Package } from '~/stores/package';
import { fetchPackageFileRaw } from '~/apis/package-raw';
import { initialPackageStore, usePackageStore } from '~/stores/package';
import { defaultPackageStore } from '~/stores/package/init';
import { registerLib } from './utils';

export const registerExtraPackageToMonaco = async (lib: Package) => {
  const { extraPackageDisposal } = usePackageStore.getState();

  const dts = await fetchPackageFileRaw(lib);
  const isDeclareLib = lib.name.startsWith('@types/');
  const moduleName = isDeclareLib ? lib.name.split('/')[1] : lib.name;

  const libDisposal = registerLib(
    `declare module '${moduleName}' {
      ${dts}
    }`,
    `file:///node_modules/${lib.name}`,
  );
  extraPackageDisposal.set(lib.name, libDisposal);
};

export const initExtraLib = () => {
  registerLib(
    `declare module "*.json" {
      const value: any;
      export default value;
    }`,
    'file:///node_modules/client.d.ts',
  );

  initialPackageStore
    .extraPackages
    .forEach(item => registerExtraPackageToMonaco(item));
};

export const resetExtraLib = () => {
  defaultPackageStore
    .extraPackages
    .forEach(item => registerExtraPackageToMonaco(item));
};
