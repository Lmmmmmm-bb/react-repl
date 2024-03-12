import { type FC, useState } from 'react';
import Side from './Side';
import Install from './Install';
import { SettingPanel } from './types';
import Packages from './Packages';
import { cn } from '~/utils/cn';
import Button from '~/components/ui/Button';
import SettingsIcon from '~/icons/Settings';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/Dialog';

const Settings: FC = () => {
  const [activePanel, setActivePanel] = useState(SettingPanel.Package);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Open playground settings" variant="ghost" size="icon">
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          ['w-full', 'max-w-[90vw]', 'lg:max-w-screen-lg'],
          ['h-full', 'max-h-[90vh]', 'lg:max-h-[70vh]'],
          ['p-0', 'overflow-hidden'],
        )}
      >
        <div className="flex flex-col lg:flex-row overflow-hidden">
          <Side activePanel={activePanel} onPanelChange={setActivePanel} />

          <div className="flex-[3] overflow-hidden">
            {activePanel === SettingPanel.Package && <Packages />}
            {activePanel === SettingPanel.Install && <Install />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
