import type { ComponentProps, FC } from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '~/utils/cn';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent: FC<ComponentProps<typeof PopoverPrimitive.Content>>
 = ({ className, align = 'center', sideOffset = 4, ...props }) => (
   <PopoverPrimitive.Portal>
     <PopoverPrimitive.Content
       align={align}
       sideOffset={sideOffset}
       className={cn(
         ['w-72', 'p-4', 'z-50'],
         ['bg-popover', 'text-popover-foreground'],
         ['rounded-md', 'border', 'shadow-md', 'outline-hidden'],
         [
           'data-[state=open]:animate-in',
           'data-[state=open]:fade-in-0',
           'data-[state=open]:zoom-in-95',
         ],
         [
           'data-[state=closed]:animate-out',
           'data-[state=closed]:fade-out-0',
           'data-[state=closed]:zoom-out-95',
         ],
         [
           'data-[side=bottom]:slide-in-from-top-2',
           'data-[side=left]:slide-in-from-right-2',
           'data-[side=right]:slide-in-from-left-2',
           'data-[side=top]:slide-in-from-bottom-2',
         ],
         className,
       )}
       {...props}
     />
   </PopoverPrimitive.Portal>
 );
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
