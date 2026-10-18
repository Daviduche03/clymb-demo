import { BrandMark } from '@/components/shared/brand-mark';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/providers/sidebar-provider';
import { PiList } from 'react-icons/pi';

export const DashboardHeader = ({
  brandName,
  logoUrl,
}: {
  brandName: string;
  logoUrl: string | null;
}) => {
  const { isMobileNavOpen, toggleMobileNav } = useSidebar();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-14 border-foreground/8 border-b bg-background">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-none lg:hidden"
            aria-expanded={isMobileNavOpen}
            aria-controls="dashboard-sidebar"
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={toggleMobileNav}
          >
            <PiList className="size-6 text-foreground" />
          </Button>

          <span className="flex shrink-0 items-center gap-2">
            <img src="/logo-icon.png" alt="Clymb Logo" className="h-6 w-auto" />
            <span className="hidden font-medium text-foreground text-lg tracking-tight sm:inline">
              Clymb
            </span>
          </span>

          <div className="hidden h-4 w-px shrink-0 bg-foreground/8 sm:block" />

          <span className="flex min-w-0 items-center gap-2 px-2 py-2 text-foreground text-sm sm:px-3">
            <BrandMark logoUrl={logoUrl} />
            <span className="min-w-0 truncate font-medium">{brandName}</span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="shrink-0 border border-foreground/15 bg-surface px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-foreground/60">
            Simulated
          </span>
        </div>
      </div>
    </header>
  );
};
