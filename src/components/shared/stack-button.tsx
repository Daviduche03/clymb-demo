import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const stackButtonVariants = cva('justify-center rounded-none text-[14px]', {
  variants: {
    variant: {
      solid: 'bg-primary text-primary-foreground hover:bg-primary',
      outline:
        'border-primary bg-background text-primary hover:bg-background hover:text-primary',
      neutral:
        'border-foreground/15 bg-background text-foreground hover:border-foreground/30 hover:bg-background hover:text-foreground',
    },
    size: {
      sm: 'h-9 px-4 text-[13px]',
      md: 'h-11 px-5',
      lg: 'h-12 px-7',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

const STACK_CLASS = {
  sm: 'btn-stack-sm',
  md: 'btn-stack',
  lg: 'btn-stack',
} as const;

type StackButtonProps = Omit<
  ComponentProps<typeof Button>,
  'size' | 'variant'
> &
  VariantProps<typeof stackButtonVariants> & {
    /** Drop the offset-shadow stack treatment. Use for inline list actions. */
    flat?: boolean;
  };

export const StackButton = ({
  className,
  variant,
  size,
  flat = false,
  ...props
}: StackButtonProps) => {
  const resolvedSize = size ?? 'md';
  return (
    <Button
      variant={
        variant === 'outline' || variant === 'neutral' ? 'outline' : 'default'
      }
      className={cn(
        stackButtonVariants({ variant, size: resolvedSize }),
        !flat && STACK_CLASS[resolvedSize],
        !flat &&
          (variant === 'neutral' || variant === 'outline') &&
          'btn-stack-ink',
        className
      )}
      {...props}
    />
  );
};
