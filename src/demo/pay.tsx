import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PiCheckBold, PiLockSimple, PiWarningBold } from 'react-icons/pi';

import {
  DemoNotFound,
  fetchPublicDemo,
  formatMoney,
  type DemoBrandPublic,
  type DemoOrder,
} from '@/lib/api';
import { StackButton } from '@/components/shared/stack-button';
import { NotLinkedScreen } from './status-screens';

const loadingScreen = (
  <div className="flex min-h-dvh items-center justify-center px-6 text-center">
    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/40">
      Loading payment…
    </p>
  </div>
);

export default function PayPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('k') ?? '';
  const orderId = searchParams.get('o') ?? '';

  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [demo, setDemo] = useState<DemoBrandPublic | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!slug || !token) {
      setStatus('missing');
      return;
    }
    fetchPublicDemo(slug, token, 'pay', false)
      .then((data) => {
        if (!alive) return;
        setDemo(data);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (!alive) return;
        setStatus(error instanceof DemoNotFound ? 'missing' : 'error');
      });
    return () => {
      alive = false;
    };
  }, [slug, token]);

  const order: DemoOrder | undefined = useMemo(() => {
    if (!demo) return undefined;
    return (
      demo.orders.find((entry) => entry.id === orderId) ??
      demo.orders.find((entry) => entry.status === 'quoted') ??
      demo.orders[0]
    );
  }, [demo, orderId]);

  if (status === 'loading') return loadingScreen;

  if (status === 'missing' || (status === 'ready' && !demo)) {
    return (
      <NotLinkedScreen
        icon={PiWarningBold}
        title="This payment link isn't here"
        description="The link may have expired, or the token is off. Ask the seller for a fresh one."
      />
    );
  }

  if (status === 'error' || !demo) {
    return (
      <NotLinkedScreen
        icon={PiWarningBold}
        title="This payment link isn't loading"
        description="Check the link or try again in a moment."
      />
    );
  }

  const amount = order ? formatMoney(order.amount, demo.currency) : null;
  const color = demo.brand_colors[0] ?? '#111111';

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex items-center justify-center gap-2.5 border-b border-border px-6 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-sm" style={{ backgroundColor: color }}>
          <PiLockSimple className="h-3.5 w-3.5 text-white" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/45">
          Secure checkout
        </span>
      </header>

      <section className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center px-6 py-12">
        <div className="flex items-center gap-3">
          {demo.logo_url ? (
            <img
              src={demo.logo_url}
              alt={demo.brand_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {demo.brand_name.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-[16px] font-semibold tracking-[-0.02em]">
              {demo.brand_name}
            </p>
            <p className="truncate text-[13px] text-foreground/50">@{demo.handle}</p>
          </div>
        </div>

        <div className="mt-8 border border-border bg-surface">
          <div className="flex items-center gap-4 border-b border-border p-5">
            {order?.productImage ? (
              <img
                src={order.productImage}
                alt={order.productName}
                className="h-16 w-16 shrink-0 object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-foreground/5 text-[13px] text-foreground/30">
                No image
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium">
                {order?.productName ?? 'Your order'}
              </p>
              {order && (
                <p className="mt-0.5 text-[13px] text-foreground/50">{order.buyerName}</p>
              )}
            </div>
            {amount && (
              <p className="ml-auto shrink-0 font-display text-[18px] font-semibold tracking-[-0.02em]">
                {amount}
              </p>
            )}
          </div>

          {paid ? (
            <div className="flex flex-col items-center px-5 py-9 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <PiCheckBold className="h-5 w-5 text-primary" />
              </span>
              <p className="mt-4 text-[15px] font-medium">Payment received</p>
              <p className="mt-1.5 text-[13px] leading-6 text-foreground/55">
                {demo.brand_name} has been notified. This is a simulated payment, so no money moved.
              </p>
            </div>
          ) : (
            <div className="p-5">
              <StackButton size="lg" className="w-full" onClick={() => setPaid(true)}>
                {amount ? `Pay ${amount}` : 'Pay now'}
              </StackButton>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-foreground/45">
                <PiLockSimple className="h-3.5 w-3.5" />
                Simulated payment for the Clymb demo — no card needed.
              </p>
            </div>
          )}
        </div>

        <a
          href="/"
          className="mt-6 self-center text-[13px] text-foreground/50 underline decoration-foreground/20 decoration-1 underline-offset-[6px] transition-colors hover:text-foreground"
        >
          Built with Clymb
        </a>
      </section>
    </main>
  );
}
