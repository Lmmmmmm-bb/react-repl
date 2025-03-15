import type { FC } from 'react';
import { usePackageStore } from '~/stores/package';
import { cn } from '~/utils/cn';
import CorePackage from './CorePackage';

const CorePackages: FC = () => {
  const corePackages = usePackageStore(state => state.corePackages);

  return (
    <div
      className={cn(
        ['px-4', 'flex', 'shrink-0', 'gap-2'],
        ['overflow-auto', 'scrollbar-hidden'],
      )}
    >
      {corePackages.map(lib => (
        <CorePackage key={lib.name} lib={lib} />
      ))}
    </div>
  );
};

export default CorePackages;
