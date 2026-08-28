import type { CorePackage } from '~/stores/package';
import { fetchPackageFiles } from '~/apis/package-metadata';
import { fetchPackageFileRaw } from '~/apis/package-raw';
import { fetchPackageVersionList } from '~/apis/package-version-list';
import { initialPackageStore, usePackageStore } from '~/stores/package';
import { defaultPackageStore } from '~/stores/package/init';
import { registerLib } from './utils';

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

const DECLARE_FILE_REGEX = /\.d\.ts$|\.json$/;
export const registerCorePackageToMonaco = async (lib: CorePackage) => {
  const packageFiles = await fetchPackageFiles(lib);
  const declarations = await Promise.all(
    packageFiles
      .filter(item => DECLARE_FILE_REGEX.test(item.name))
      .map(async item => ({
        path: item.name,
        raw: await fetchPackageFileRaw(lib, item.name),
      })),
  );

  disposalCorePackage(lib);

  const { corePackageDisposal } = usePackageStore.getState();
  declarations.forEach(({ path, raw }) => {
    const libPath = `${lib.name}${path}`;
    const libDisposal = registerLib(raw, `file:///node_modules/${libPath}`);
    corePackageDisposal.set(libPath, libDisposal);
  });
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
