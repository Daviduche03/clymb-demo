import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface SectionKickerProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  trailing?: ReactNode;
}

export const SectionKicker = ({
  children,
  count,
  trailing,
  className,
  ...props
}: SectionKickerProps) => (
  <div
    className={cn(
      'flex items-baseline justify-between gap-3 font-normal text-[11px] text-foreground/70 uppercase tracking-[0.06em]',
      className
    )}
    {...props}
  >
    <span className="font-sans">
      {children}
      {typeof count === 'number' ? (
        <span className="ml-1.5 font-normal text-foreground/40">· {count}</span>
      ) : null}
    </span>
    {trailing ? (
      <span className="font-normal font-sans text-[11px] text-foreground/50">
        {trailing}
      </span>
    ) : null}
  </div>
);
