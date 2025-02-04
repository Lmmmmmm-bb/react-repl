import type { FC } from 'react';
import Tabs from '~/components/Tabs';
import { getOrCreateMonacoModel } from '~/monaco';
import {
  deleteFile,
  ENTRY_FILE,
  setActiveFile,
  useVirtualFileStore,
} from '~/stores/virtual-file';
import { cn } from '~/utils/cn';
import { getVirtualFileExt } from '~/virtual-file';
import NewFile from './NewFile';
import { virtualFileExtIconStrategy } from './strategy';

const FileTabs: FC = () => {
  const { files, activeFile } = useVirtualFileStore();

  const handleDeleteFile = (filename: string) => {
    // eslint-disable-next-line no-alert
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      deleteFile(filename);
      const model = getOrCreateMonacoModel(files[filename]);
      model && model.dispose();
    };
  };

  return (
    <Tabs className="shrink-0">
      {Object.values(files)
        .filter(item => !item.hidden)
        .map((item) => {
          const isActiveFile = item.filename === activeFile.filename;

          return (
            <Tabs.Item
              key={item.filename}
              title={item.filename}
              active={isActiveFile}
              closable={item.filename !== ENTRY_FILE}
              className={cn(isActiveFile && 'text-brand')}
              onClick={(e) => {
                e.currentTarget.scrollIntoView();
                setActiveFile(item);
              }}
              onCloseClick={() => handleDeleteFile(item.filename)}
            >
              {virtualFileExtIconStrategy[getVirtualFileExt(item.filename)]}
              {item.filename}
            </Tabs.Item>
          );
        })}

      <NewFile />
    </Tabs>
  );
};

export default FileTabs;
