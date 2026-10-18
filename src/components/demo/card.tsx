import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type CardTone = 'plain' | 'warm';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  padding?: 'sm' | 'md' | 'none';
}

const TONE_CLASS: Record<CardTone, string> = {
  plain: 'bg-background',
  warm: 'bg-surface dark:bg-foreground/[0.03]',
};

const PADDING_CLASS = {
  none: '',
  sm: 'p-5',
  md: 'p-6',
} as const;

export const Card = ({
  tone = 'plain',
  padding = 'md',
  className,
  ...props
}: CardProps) => (
  <div
    className={cn(
      'rounded-none border border-foreground/8',
      TONE_CLASS[tone],
      PADDING_CLASS[padding],
      className
    )}
    {...props}
  />
);
