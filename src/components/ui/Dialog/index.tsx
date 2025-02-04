import type { ComponentProps, FC } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '~/utils/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay: FC<ComponentProps<typeof DialogPrimitive.Overlay>>
= ({ className, ...props }) => (
  <DialogPrimitive.Overlay
    className={cn(
      ['fixed', 'inset-0', 'z-50'],
      ['bg-black/0', 'backdrop-blur-xs'],
      ['data-[state=open]:animate-in', 'data-[state=open]:fade-in-0'],
      ['data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0'],
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent: FC<ComponentProps<typeof DialogPrimitive.Content>>
 = ({ className, children, ...props }) => (
   <DialogPortal>
     <DialogOverlay />
     <DialogPrimitive.Content
       className={cn(
         ['fixed', 'left-[50%]', 'top-[50%]', 'z-50'],
         ['p-6', 'grid', 'w-full', 'max-w-lg', 'gap-4'],
         ['border', 'bg-background', 'shadow-lg', 'sm:rounded-lg'],
         ['translate-x-[-50%]', 'translate-y-[-50%]', 'duration-200'],
         [
           'data-[state=open]:animate-in',
           'data-[state=open]:fade-in-0',
           'data-[state=open]:zoom-in-95',
           'data-[state=open]:slide-in-from-left-1/2',
           'data-[state=open]:slide-in-from-top-[48%]',
         ],
         [
           'data-[state=closed]:animate-out',
           'data-[state=closed]:fade-out-0',
           'data-[state=closed]:zoom-out-95',
           'data-[state=closed]:slide-out-to-left-1/2',
           'data-[state=closed]:slide-out-to-top-[48%]',
         ],
         className,
       )}
       {...props}
     >
       {children}
       {/* <DialogPrimitive.Close
        className={cn(
          ['absolute', 'right-4', 'top-4'],
          ['rounded-sm', 'opacity-70', 'ring-offset-background', 'transition-opacity'],
          [
            'hover:opacity-100',
            'focus:outline-hidden',
            'focus:ring-2',
            'focus:ring-ring',
            'focus:ring-offset-2',
          ],
          ['disabled:pointer-events-none'],
          ['data-[state=open]:bg-accent', 'data-[state=open]:text-muted-foreground'],
        )}
      >
        <Close className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close> */}
     </DialogPrimitive.Content>
   </DialogPortal>
 );
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>>
 = ({ className, ...props }) => (
   <DialogPrimitive.Title
     className={cn(
       'text-lg font-semibold leading-none tracking-tight',
       className,
     )}
     {...props}
   />
 );
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription: FC<ComponentProps<typeof DialogPrimitive.Description>>
 = ({ className, ...props }) => (
   <DialogPrimitive.Description
     className={cn('text-sm text-muted-foreground', className)}
     {...props}
   />
 );
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
