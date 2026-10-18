import { cn } from '@/lib/utils';
import { useSidebar } from '@/providers/sidebar-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import { type ComponentType, useEffect, useRef } from 'react';
import {
  PiChatsCircle,
  PiDesktop,
  PiHouse,
  PiStorefront,
} from 'react-icons/pi';

type IconComponent = ComponentType<{ className?: string }>;

type SidebarNavItem = {
  title: string;
  relative: string;
  tab?: string;
  icon: IconComponent;
};

const DEMO_NAV: SidebarNavItem[] = [
  { title: 'Overview', relative: '', icon: PiHouse },
  { title: 'Store', relative: 'store', icon: PiStorefront },
  { title: 'Sites', relative: 'sites', icon: PiDesktop },
  { title: 'Agent', relative: 'agent', icon: PiChatsCircle },
];

const SIDEBAR_DURATION = 'duration-300';
const SIDEBAR_EASE = 'ease-in-out';

function SidebarItem({
  to,
  icon: Icon,
  isActive,
  showLabels,
  title,
}: {
  to: string;
  icon: IconComponent;
  isActive: boolean;
  showLabels: boolean;
  title: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={cn(
        'group relative grid h-9 w-full min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center font-normal text-[14px] transition-colors',
        isActive ? 'text-primary' : 'text-foreground hover:bg-foreground/[0.03]'
      )}
    >
      {isActive ? (
        <span aria-hidden className="absolute top-1.5 bottom-1.5 left-0 w-[2px] bg-primary" />
      ) : null}
      <span className="flex size-full items-center justify-center">
        <Icon className="h-[18px] w-[18px] shrink-0" />
      </span>
      <span
        className={cn(
          'min-w-0 truncate text-left transition-[max-width,opacity]',
          SIDEBAR_DURATION,
          SIDEBAR_EASE,
          showLabels
            ? 'max-w-[11.5rem] opacity-100'
            : 'pointer-events-none max-w-0 select-none opacity-0'
        )}
      >
        {title}
      </span>
    </button>
  );
}

export function Sidebar({ slug, className }: { slug: string; className?: string }) {
  const { pathname, search } = useLocation();
  const {
    isCollapsed,
    isHovering,
    setIsHovering,
    isNarrowLayout,
    isMobileNavOpen,
    setMobileNavOpen,
  } = useSidebar();

  const showLabels = isNarrowLayout || !isCollapsed || isHovering;

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (!isNarrowLayout) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current !== pathname) {
      setMobileNavOpen(false);
    }
    prevPathname.current = pathname;
  }, [pathname, isNarrowLayout, setMobileNavOpen]);

  useEffect(() => {
    if (!(isNarrowLayout && isMobileNavOpen)) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNarrowLayout, isMobileNavOpen, setMobileNavOpen]);

  useEffect(() => {
    if (isNarrowLayout && isMobileNavOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isNarrowLayout, isMobileNavOpen]);

  const base = `/${slug}`;
  const params = new URLSearchParams(search);
  const activeTab = params.get('tab');
  const pathnameWithoutSlash = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const isActive = (relative: string, tab?: string) => {
    if (`${base}${relative ? `/${relative}` : ''}` !== pathnameWithoutSlash) return false;
    if (relative === 'store') return (tab ?? null) === activeTab || (!tab && activeTab !== 'orders');
    return true;
  };

  const to = (relative: string, tab?: string) => {
    const next = new URLSearchParams(search);
    if (tab) next.set('tab', tab);
    else next.delete('tab');
    next.delete('o');
    const query = next.toString();
    return `${base}${relative ? `/${relative}` : ''}${query ? `?${query}` : ''}`;
  };

  const sidebarWidth = isCollapsed && !isHovering ? 'w-16' : 'w-60';

  return (
    <>
      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <nav
        id="dashboard-sidebar"
        aria-label="Dashboard"
        className={cn(
          'fixed left-0 z-40 overflow-hidden border-foreground/8 border-r bg-background pb-16',
          'top-0 h-screen lg:top-14 lg:h-[calc(100vh-3.5rem)]',
          'transition-[width,transform]',
          SIDEBAR_DURATION,
          SIDEBAR_EASE,
          sidebarWidth,
          'max-lg:w-60',
          'max-lg:-translate-x-full',
          isMobileNavOpen && 'max-lg:translate-x-0',
          className
        )}
        onMouseEnter={() => !isNarrowLayout && isCollapsed && setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        <div className={cn('space-y-0.5 overflow-y-auto px-2 py-5 max-lg:pt-16 lg:pt-4')}>
          {DEMO_NAV.map((item) => (
            <SidebarItem
              key={`${item.relative}-${item.tab ?? 'main'}`}
              to={to(item.relative, item.tab)}
              icon={item.icon}
              isActive={isActive(item.relative, item.tab)}
              showLabels={showLabels}
              title={item.title}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
