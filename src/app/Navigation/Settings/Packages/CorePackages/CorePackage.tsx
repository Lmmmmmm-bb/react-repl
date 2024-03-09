import { type FC, useState } from 'react';
import { fetchPackageVersionList } from '~/apis/package-version-list';
import Button from '~/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '~/components/ui/Select';
import { useToggle } from '~/hooks/useToggle';
import Loading from '~/icons/Loading';
import { registerCorePackageToMonaco } from '~/monaco';
import { type CorePackage as CorePackageType, addCorePackage } from '~/stores/package';

interface CorePackageProps {
  lib: CorePackageType;
}

const CorePackage: FC<CorePackageProps> = ({ lib }) => {
  const [loading, toggleLoading] = useToggle();
  const [versionList, setVersionList] = useState<string[]>([]);

  const handleOpenChange = (open: boolean) => {
    if (!open || versionList.length) {
      return;
    }

    fetchPackageVersionList(lib.name)
      .then((response) => {
        const versions = response
          .versions
          .filter(version => /^(17|18)\.(\d+)\.(\d+)$/.test(version));
        setVersionList(versions);
      });
  };

  const handleVersionChange = async (version: string) => {
    const corePackage: CorePackageType = { ...lib, version };

    const isDeclarePackage = lib.name.startsWith('@types/');
    if (isDeclarePackage) {
      toggleLoading.on();
      registerCorePackageToMonaco(corePackage)
        .then(() => addCorePackage(corePackage))
        .finally(() => toggleLoading.off());
    } else {
      addCorePackage(corePackage);
    }
  };

  return (
    <Select
      key={lib.name}
      value={lib.version === 'latest' ? versionList[0] : lib.version}
      onOpenChange={handleOpenChange}
      onValueChange={handleVersionChange}
    >
      <SelectTrigger
        asChild
        className="w-fit cursor-pointer font-mono"
        title={`${lib.name} version is ${lib.version}`}
      >
        <Button variant="outline">
          {loading && <Loading className="size-4 mr-1 animate-spin" />}
          {lib.name}
        </Button>
      </SelectTrigger>

      <SelectContent>
        {versionList.length
          ? versionList.map((item, index) => {
            const isLatest = index === 0;

            return (
              <>
                <SelectItem
                  className="font-mono"
                  key={item}
                  value={item}
                >
                  {isLatest ? `${item} (latest)` : item}
                </SelectItem>
                {isLatest && <SelectSeparator />}
              </>
            );
          })
          : <SelectItem disabled value="empty">No version</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export default CorePackage;
