import type { FC } from 'react';
import type { CorePackage } from '~/stores/package';
import Button from '~/components/ui/Button';
import Warning from '~/icons/Warning';
import { addCorePackage, usePackageStore } from '~/stores/package';
import { cn } from '~/utils/cn';

const VersionNotMatch: FC = () => {
  const { react, reactDOM } = usePackageStore((state) => {
    const corePackages = state.corePackages;
    const [react] = corePackages.filter(item => item.name === 'react');
    const [reactDOM] = corePackages.filter(item => item.name === 'react-dom');
    return { react, reactDOM };
  });

  const switchVersion = (lib: CorePackage, targetVersion: string) =>
    addCorePackage({ ...lib, version: targetVersion });

  return (
    <div
      className={cn(
        ['absolute', 'inset-0', 'z-10'],
        ['flex', 'flex-col', 'items-center', 'justify-center', 'gap-2'],
        ['backdrop-blur'],
      )}
    >
      <Warning className="size-6 text-orange-600" />

      <div className="flex flex-wrap gap-1 justify-center">
        <span className="font-mono text-nowrap">
          {`react(${react.version})`}
        </span>
        <span>is not match</span>
        <span className="font-mono text-nowrap">
          {`react-dom(${reactDOM.version})`}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => switchVersion(react, reactDOM.version)}
        >
          {`Switch react to ${reactDOM.version}`}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => switchVersion(reactDOM, react.version)}
        >
          {`Switch react-dom to ${react.version}`}
        </Button>
      </div>
    </div>
  );
};

export default VersionNotMatch;
