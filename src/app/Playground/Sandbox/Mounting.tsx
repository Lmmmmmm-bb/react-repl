import type { FC } from 'react';
import Loading from '~/icons/Loading';
import { cn } from '~/utils/cn';

const Mounting: FC = () => (
  <div
    className={cn(
      ['absolute', 'inset-0'],
      ['flex', 'flex-col', 'items-center', 'justify-center', 'gap-2'],
      ['backdrop-blur-sm'],
    )}
  >
    <Loading className="size-6 animate-spin" />
    <p>Mounting Playground</p>
  </div>
);

export default Mounting;
