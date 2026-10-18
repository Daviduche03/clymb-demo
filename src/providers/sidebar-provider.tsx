import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

const LG_DOWN_MQ = '(max-width: 1023px)';

type SidebarContextType = {
  isCollapsed: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
  toggleCollapsed: () => void;
  isNarrowLayout: boolean;
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isNarrowLayout, setIsNarrowLayout] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed((collapsed) => !collapsed);
  };

  useEffect(() => {
    const mql = window.matchMedia(LG_DOWN_MQ);
    const sync = () => {
      const narrow = mql.matches;
      setIsNarrowLayout(narrow);
      if (!narrow) {
        setMobileNavOpen(false);
      }
    };
    mql.addEventListener('change', sync);
    sync();
    return () => mql.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    const width = isCollapsed && !isHovering ? '4rem' : '15rem';
    document.documentElement.style.setProperty('--sidebar-width', width);
  }, [isCollapsed, isHovering]);

  const toggleMobileNav = () => {
    setMobileNavOpen((open) => !open);
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isHovering,
        setIsHovering,
        toggleCollapsed,
        isNarrowLayout,
        isMobileNavOpen,
        setMobileNavOpen,
        toggleMobileNav,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
