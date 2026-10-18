import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import {
  DemoNotFound,
  fetchPublicDemo,
  type DemoBrandPublic,
  type DemoOrder,
  type DemoProduct,
} from '@/lib/api';

type DemoState = {
  status: 'loading' | 'ready' | 'missing' | 'error';
  demo: DemoBrandPublic | null;
  token: string;
  error: string | null;
  navigating: boolean;
  trackClaimClick: () => void;
  productOrderCount: (productId: string) => number;
};

const DemoContext = createContext<DemoState | null>(null);

export { DemoContext };

let viewCounted = false;

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('k') ?? '';
  const location = useLocation();
  const [status, setStatus] = useState<DemoState['status']>('loading');
  const [demo, setDemo] = useState<DemoBrandPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  const page = location.pathname.replace(/^\/s\/[^/]+/, '').replace(/^\//, '') || 'overview';

  useEffect(() => {
    let alive = true;
    if (!slug) return;
    setNavigating(true);
    fetchPublicDemo(slug, token, page, !viewCounted)
      .then((data) => {
        if (!alive) return;
        viewCounted = true;
        setDemo(data);
        setStatus('ready');
        setNavigating(false);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        if (err instanceof DemoNotFound) {
          setStatus('missing');
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setStatus('error');
        }
        setNavigating(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, token, page]);

  const trackClaimClick = useCallback(() => {
    if (!slug) return;
    void fetch('/api/v1/demos/pub/' + slug + '/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'claim_click' }),
    }).catch(() => undefined);
  }, [slug, token]);

  const productOrderCount = useCallback(
    (productId: string) =>
      demo?.orders.filter((order: DemoOrder) => order.productId === productId).length ?? 0,
    [demo]
  );

  const value = useMemo<DemoState>(
    () => ({ status, demo, token, error, navigating, trackClaimClick, productOrderCount }),
    [status, demo, token, error, navigating, trackClaimClick, productOrderCount]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
};
