import type { IconType } from 'react-icons';

interface StatusProps {
  icon: IconType;
  title: string;
  description: string;
}

export const NotLinkedScreen = ({ icon: Icon, title, description }: StatusProps) => (
  <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <div className="flex h-11 w-11 items-center justify-center border border-foreground/10 bg-surface">
      <Icon className="h-5 w-5 text-foreground/45" />
    </div>
    <p className="mt-4 text-[15px] font-medium text-foreground">{title}</p>
    <p className="mt-1.5 max-w-md text-[13px] leading-6 text-foreground/55">{description}</p>
    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/40">
      Clymb
    </p>
  </div>
);

export const GoToStoreScreen = ({ message }: { message: string }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <p className="max-w-md text-[14px] leading-6 text-foreground/70">{message}</p>
    <a
      href="/"
      className="mt-5 text-[13px] font-medium underline decoration-foreground/20 decoration-1 underline-offset-[6px]"
    >
      Reload
    </a>
  </div>
);

export const RemovedScreen = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <div className="flex h-11 w-11 items-center justify-center border border-foreground/10 bg-surface">
      <PiCheck className="h-5 w-5 text-primary" />
    </div>
    <p className="mt-4 text-[15px] font-medium text-foreground">Demo deleted</p>
    <p className="mt-1.5 max-w-md text-[13px] leading-6 text-foreground/55">
      Everything was removed. Clymb kept nothing.
    </p>
  </div>
);

import { PiCheck } from 'react-icons/pi';
