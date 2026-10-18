import { cn } from '@/lib/utils';

const BARS = 12;
const VIEWBOX = 24;
const BAR_WIDTH = 2.2;
const BAR_HEIGHT = 6;
const BAR_Y = 1.5;

type SpinnerProps = {
  className?: string;
  size?: number;
};

function Spinner({ className, size = 20 }: SpinnerProps) {
  const center = VIEWBOX / 2;

  return (
    <svg
      role="status"
      aria-label="Loading"
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={cn('shrink-0', className)}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <rect
          key={i}
          x={center - BAR_WIDTH / 2}
          y={BAR_Y}
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          rx={BAR_WIDTH / 2}
          fill="currentColor"
          transform={`rotate(${i * (360 / BARS)} ${center} ${center})`}
          className="animate-spinner-bar"
          style={{
            animationDelay: `${(-i / BARS).toFixed(3)}s`,
          }}
        />
      ))}
    </svg>
  );
}

export { Spinner };
