import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80',
        primary:
          'bg-blue-500 dark:bg-blue-800 text-white hover:bg-blue-500/80 dark:hover:bg-blue-800/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80',
        outline: 'text-foreground',
        warning:
          'bg-orange-500 dark:bg-orange-800 text-white hover:bg-orange-500/80 dark:hover:bg-orange-800/80',
        info:
          'bg-cyan-500 dark:bg-cyan-800 text-white hover:bg-cyan-500/80 dark:hover:bg-cyan-800/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
