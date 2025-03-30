import type { FC } from 'react';
import type { ConsoleSelectType } from '../types';
import { useEffect, useRef } from 'react';
import { cn } from '~/utils/cn';
import { useConsoleStore } from '../store';
import Message from './Message';

interface ConsoleProps {
  filterType: ConsoleSelectType;
}

const Console: FC<ConsoleProps> = ({ filterType }) => {
  const ref = useRef<HTMLDivElement>(null);
  const messages = useConsoleStore(state => state.messages);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={ref}
      className={cn(
        ['h-full', 'dark:bg-dark-800/60'],
        ['overflow-auto', 'scrollbar-hidden', 'scroll-smooth'],
      )}
    >
      {messages
        .filter(item => filterType === 'all' || item.type === filterType)
        .map(item => (
          <Message key={item.id} message={item} />
        ))}
    </div>
  );
};

export default Console;
