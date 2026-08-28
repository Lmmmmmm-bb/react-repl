import type { CorePackage } from '~/stores/package';
import { fetchPackageVersionList } from '~/apis/package-version-list';
import { initialPackageStore, usePackageStore } from '~/stores/package';
import { defaultPackageStore } from '~/stores/package/init';
import { loadPackageTypes } from './package-types';
import { registerLibs } from './utils';

const beforeRegisterCorePackage = async (packages: CorePackage[]) => {
  const corePackagesWithVersion: CorePackage[] = await Promise.all(
    packages.map(async (lib) => {
      const versions = await fetchPackageVersionList(lib.name);
      const latestVersion = versions.tags.latest || versions.versions[0];
      return { ...lib, version: latestVersion };
    }),
  );

  return corePackagesWithVersion;
};

const disposalCorePackage = (lib: CorePackage) => {
  const { corePackageDisposal } = usePackageStore.getState();
  for (const disposalKey of corePackageDisposal.keys()) {
    if (disposalKey.includes(`${lib.name}/`)) {
      const disposal = corePackageDisposal.get(disposalKey);
      disposal && corePackageDisposal.delete(disposalKey) && disposal();
    }
  }
};

export const registerCorePackageToMonaco = async (lib: CorePackage) => {
  const bundle = await loadPackageTypes(lib);
  disposalCorePackage(lib);

  const { corePackageDisposal } = usePackageStore.getState();
  const disposeBundle = registerLibs(bundle.files);
  corePackageDisposal.set(`${lib.name}/__type_bundle__`, disposeBundle);
};

const EXCLUDE_PACKAGE_NAME = ['react', 'react-dom'];
export const initCoreLib = async () => {
  const corePackagesWithVersion = await beforeRegisterCorePackage(initialPackageStore.corePackages);

  await Promise.all(
    corePackagesWithVersion
      .filter(item => !EXCLUDE_PACKAGE_NAME.includes(item.name))
      .map(item => registerCorePackageToMonaco(item)),
  );
};

export const resetCoreLib = async () => {
  const corePackagesWithVersion = await beforeRegisterCorePackage(defaultPackageStore.corePackages);

  await Promise.all(
    corePackagesWithVersion
      .filter(item => !EXCLUDE_PACKAGE_NAME.includes(item.name))
      .map(item => registerCorePackageToMonaco(item)),
  );
};
