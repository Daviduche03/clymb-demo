import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  size?: 'md' | 'sm';
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center px-6 text-center',
      size === 'md' ? 'py-14' : 'py-8',
      className
    )}
  >
    {Icon ? (
      <div className="flex h-11 w-11 items-center justify-center border border-foreground/10 bg-surface">
        <Icon className="h-5 w-5 text-foreground/45" />
      </div>
    ) : null}
    <p
      className={cn(
        'font-medium text-foreground',
        size === 'md' ? 'text-[15px]' : 'text-[14px]',
        Icon && 'mt-4'
      )}
    >
      {title}
    </p>
    {description ? (
      <p className="mt-1.5 max-w-md text-[13px] text-foreground/55 leading-6">
        {description}
      </p>
    ) : null}
    {action ? (
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {action}
      </div>
    ) : null}
  </div>
);
