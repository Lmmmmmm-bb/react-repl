import type { FC } from 'react';
import type { ConsoleSelectType } from './types';
import Container from '~/components/Container';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/Select';
import Filter from '~/icons/Filter';
import { cn } from '~/utils/cn';
import { CONSOLE_LEVEL } from './config';

const { Action } = Container;

interface ConsoleLevelFilterProps {
  value: ConsoleSelectType;
  onChange: (value: ConsoleSelectType) => void;
}

const ConsoleLevelFilter: FC<ConsoleLevelFilterProps> = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <Action asChild className={cn('capitalize', 'gap-1', value !== 'all' && 'opacity-80')}>
      <SelectTrigger title="Filter console level">
        <Filter className="size-5" />
        {value !== 'all' && value}
      </SelectTrigger>
    </Action>

    <SelectContent>
      {CONSOLE_LEVEL.map(item => (
        <SelectItem
          className="capitalize"
          key={item}
          value={item}
        >
          {item}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default ConsoleLevelFilter;
