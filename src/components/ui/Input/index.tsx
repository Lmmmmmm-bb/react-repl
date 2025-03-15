import type { ComponentProps, FC } from 'react';

import { cn } from '~/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: FC<ComponentProps<'input'>>
  = ({ className, type, ...props }) => (
    <input
      type={type}
      spellCheck={false}
      autoComplete="off"
      className={cn(
        ['w-full', 'h-9', 'px-3', 'py-1', 'flex'],
        ['text-sm', 'bg-transparent', 'transition-colors'],
        ['rounded-md', 'border', 'border-input', 'shadow-xs'],
        ['file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium'],
        ['focus-visible:outline-hidden', 'focus-visible:ring-1', 'focus-visible:ring-ring'],
        ['placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'],
        className,
      )}
      {...props}
    />
  );

Input.displayName = 'Input';

export { Input };
