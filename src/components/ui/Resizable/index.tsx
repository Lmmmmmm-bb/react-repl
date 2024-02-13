import { type ComponentProps, forwardRef } from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';

import { cn } from '~/utils/cn';

const ResizablePanelGroup = forwardRef<
    ImperativePanelGroupHandle,
    ComponentProps<typeof ResizablePrimitive.PanelGroup>
  >(({
    className,
    ...props
  }, ref) => (
    <ResizablePrimitive.PanelGroup
      ref={ref}
      className={cn(
        ['h-full', 'w-full'],
        ['flex', 'data-[panel-group-direction=vertical]:flex-col'],
        className,
      )}
      {...props}
    />
  ));

ResizablePanelGroup.displayName = 'ResizablePanelGroup';

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  className,
  ...props
}: ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      ['relative', 'flex', 'items-center', 'justify-center', 'w-2', 'transition-colors', 'rounded-lg'],
      ['before:absolute', 'before:top-1/2', 'before:left-1/2', 'before:bg-[#8888]'],
      ['active:before:opacity-0', 'hover:before:opacity-0', 'before:transition-opacity', 'before:duration-300'],
      ['after:absolute', 'after:top-1/2', 'after:left-1/2', 'after:bg-[#8888]'],
      ['active:after:opacity-0', 'hover:after:opacity-0', 'after:transition-opacity', 'after:duration-300'],
      [
        'data-[panel-group-direction=horizontal]:w-2',
        'data-[panel-group-direction=horizontal]:my-2',
        'data-[panel-group-direction=horizontal]:mx-0.5',
        'data-[panel-group-direction=horizontal]:before:w-[1px]',
        'data-[panel-group-direction=horizontal]:before:h-8',
        'data-[panel-group-direction=horizontal]:before:-translate-y-1/2',
        'data-[panel-group-direction=horizontal]:before:ml-[-2px]',
        'data-[panel-group-direction=horizontal]:after:w-[1px]',
        'data-[panel-group-direction=horizontal]:after:h-8',
        'data-[panel-group-direction=horizontal]:after:-translate-y-1/2',
        'data-[panel-group-direction=horizontal]:after:ml-[1px]',
      ],
      [
        'data-[panel-group-direction=vertical]:h-2',
        'data-[panel-group-direction=vertical]:mx-2',
        'data-[panel-group-direction=vertical]:my-0.5',
        'data-[panel-group-direction=vertical]:before:h-[1px]',
        'data-[panel-group-direction=vertical]:before:w-8',
        'data-[panel-group-direction=vertical]:before:-translate-x-1/2',
        'data-[panel-group-direction=vertical]:before:mt-[-2px]',
        'data-[panel-group-direction=vertical]:after:h-[1px]',
        'data-[panel-group-direction=vertical]:after:w-8',
        'data-[panel-group-direction=vertical]:after:-translate-x-1/2',
        'data-[panel-group-direction=vertical]:after:mt-[1px]',
      ],
      [
        'data-[resize-handle-active=pointer]:bg-light-400',
        'data-[resize-handle-active=pointer]:dark:bg-dark-400',
        'data-[resize-handle-active=keyboard]:bg-light-400',
        'data-[resize-handle-active=keyboard]:dark:bg-dark-400',
      ],
      className,
    )}
    {...props}
  >
  </ResizablePrimitive.PanelResizeHandle>
);

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
};
