import { usePackageStore } from '.';
import {
  packagePathStrategy,
  packageQueryStrategy,
  packageRenameStrategy,
} from './strategy';

export const isLegacyReactDOM = () => {
  const { corePackages } = usePackageStore.getState();
  const [reactDOM] = corePackages.filter(item => item.name === 'react-dom');

  return reactDOM.version.startsWith('17');
};

export const getImportMap = () => {
  const isLegacy = isLegacyReactDOM();
  const { corePackages, extraPackages } = usePackageStore.getState();
  const packages = [...corePackages, ...extraPackages].filter(item => !item.optional);

  const imports: Record<string, string> = {};
  for (const currentPackage of packages) {
    const packageName = isLegacy
      ? currentPackage.name
      : (packageRenameStrategy[currentPackage.name] || currentPackage.name);

    const packagePath = packagePathStrategy[packageName] || '';
    const packageQuery = packageQueryStrategy[packageName] || '';
    const packageWithVersion = `${currentPackage.name}@${currentPackage.version}`;
    const packageUrl = `https://esm.sh/${packageWithVersion}`;
    imports[packageName] = `${packageUrl}${packagePath}${packageQuery}`;

    if (packageName !== currentPackage.name) {
      imports[currentPackage.name] = packageUrl;
    }
  }

  return { imports };
};
