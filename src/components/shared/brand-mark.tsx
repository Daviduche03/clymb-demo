import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PiBuildings } from 'react-icons/pi';

type BrandMarkSize = 'sm' | 'md' | 'lg' | 'xl';

type BrandMarkProps = {
  className?: string;
  faviconUrl?: string | null;
  logoUrl?: string | null;
  size?: BrandMarkSize;
};

const SIZE_CLASSES: Record<BrandMarkSize, string> = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-20 w-20',
};

const ICON_SIZE_CLASSES: Record<BrandMarkSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

export const BrandMark = ({
  className,
  faviconUrl,
  logoUrl,
  size = 'sm',
}: BrandMarkProps) => {
  const source = logoUrl || faviconUrl || null;
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (!source || failedSource === source) {
    return (
      <span
        aria-hidden
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden border border-foreground/10 bg-surface text-foreground/55',
          SIZE_CLASSES[size],
          className
        )}
      >
        <PiBuildings className={ICON_SIZE_CLASSES[size]} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden',
        SIZE_CLASSES[size],
        className
      )}
    >
      <img
        alt=""
        aria-hidden
        className="h-full w-full object-cover"
        onError={() => setFailedSource(source)}
        src={source}
      />
    </span>
  );
};
