import type { FC } from 'react';
import { lazy, Suspense, useState } from 'react';
import Button from '~/components/ui/Button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/Dialog';
import Loading from '~/icons/Loading';
import SettingsIcon from '~/icons/Settings';
import { cn } from '~/utils/cn';
import Side from './Side';
import { SettingPanel } from './types';

const Install = lazy(() => import('./Install'));
const Packages = lazy(() => import('./Packages'));

const Settings: FC = () => {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(SettingPanel.Package);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          title="Open playground settings"
          variant="ghost"
          size="icon"
          data-umami-event="Settings"
        >
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>

      {open && (
        <DialogContent
          aria-describedby={undefined}
          className={cn(
            ['w-full', 'max-w-[90vw]', 'lg:max-w-(--breakpoint-lg)'],
            ['h-full', 'max-h-[90vh]', 'lg:max-h-[70vh]'],
            ['p-0', 'overflow-hidden'],
          )}
        >
          <div className="flex flex-col lg:flex-row overflow-hidden">
            <Side activePanel={activePanel} onPanelChange={setActivePanel} />

            <div className="flex-3 overflow-hidden">
              <Suspense
                fallback={(
                  <div className="size-full grid place-content-center" role="status">
                    <Loading className="size-5 animate-spin opacity-60" />
                  </div>
                )}
              >
                {activePanel === SettingPanel.Package && <Packages />}
                {activePanel === SettingPanel.Install && <Install />}
              </Suspense>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Settings;
