import { PiSparkleBold } from 'react-icons/pi';

import { useDemo } from './demo-context';

export const ClaimBanner = ({ onOpen }: { onOpen: () => void }) => {
  const { demo } = useDemo();
  if (!demo) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-foreground/10 bg-surface px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[24rem] lg:border lg:pb-3 lg:shadow-lg">
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-5">This is your store. Claim it.</p>
          <p className="truncate text-[11px] text-foreground/50">{demo.claim_hint}</p>
        </div>
        <button
          onClick={onOpen}
          className="btn-stack-sm flex h-9 shrink-0 items-center gap-1.5 bg-primary px-4 text-[13px] font-medium text-primary-foreground"
        >
          <PiSparkleBold className="h-3.5 w-3.5" />
          Claim
        </button>
      </div>
    </div>
  );
};
