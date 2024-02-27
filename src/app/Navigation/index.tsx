import type { FC } from 'react';

import ThemeSwitcher from './ThemeSwitcher';
import Share from './Share';
import Settings from './Settings';
import Reset from './Reset';
import Information from './Information';
import { cn } from '~/utils/cn';
import React from '~/icons/React';

const Navigation: FC = () => (
  <div className={cn(
    ['fixed', 'left-0', 'top-0', 'bottom-0'],
    ['w-full', 'h-12', 'lg:w-20', 'lg:h-full'],
    ['px-4', 'lg:px-2', 'py-2', 'lg:py-4'],
    ['flex', 'lg:flex-col', 'items-center', 'justify-between'],
  )}
  >
    <React title="React Playground" className="w-8 h-8 lg:w-12 lg:h-12 text-brand" />

    <div className="flex lg:flex-col gap-2">
      <Information />
      <ThemeSwitcher />
      <Reset />
      <Share />
      <Settings />
    </div>
  </div>
);

export default Navigation;
