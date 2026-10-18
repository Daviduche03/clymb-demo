import { useCallback, useEffect, useState } from 'react';
import { PiCheck, PiEnvelopeSimple, PiGlobe, PiX } from 'react-icons/pi';
import { toast } from 'sonner';

import { initializeClaim, trackClaimClick, verifyClaim } from '@/lib/api';
import type { DemoBrandPublic, DemoClaimPlan } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

const claimBannerCta = 'Claim';

type UseClaimOptions = {
  demo: DemoBrandPublic | null;
  slug: string | undefined;
  token: string;
  onClaimed?: () => void;
};

export const useClaimController = ({ demo, slug, token, onClaimed }: UseClaimOptions) => {
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    const returning = params.has('claim') && reference;
    if (!returning || !slug || claimed) return;
    verifyClaim(slug, token, reference)
      .then(() => setClaimed(true))
      .catch(() => {
        toast.error('Payment check failed. Try Claim again.');
      });
  }, [slug, token, claimed]);

  useEffect(() => {
    if (demo?.claimed) setClaimed(true);
  }, [demo?.claimed]);

  const openDialog = useCallback(() => {
    setOpen(true);
    if (slug) trackClaimClick(slug, token).catch(() => undefined);
  }, [slug, token]);

  const close = useCallback(() => setOpen(false), []);
  const markClaimed = useCallback(() => {
    setOpen(false);
    setClaimed(true);
  }, []);

  useEffect(() => {
    if (claimed && onClaimed) onClaimed();
  }, [claimed, onClaimed]);

  return { open, openDialog, close, claimed, markClaimed };
};

export const ClaimModal = ({
  slug,
  token,
  defaultCountry,
  plans,
  onClose,
  onDone,
}: {
  slug: string;
  token: string;
  defaultCountry: string;
  plans: DemoClaimPlan[];
  onClose: () => void;
  onDone: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [submitting, setSubmitting] = useState(false);
  const [emailStage, setEmailStage] = useState(true);

  const plan =
    plans.find(
      (entry) =>
        entry.countryName.toLowerCase() === country.trim().toLowerCase() ||
        entry.countryCode.toLowerCase() === country.trim().toLowerCase()
    ) ?? plans.find((entry) => entry.currency === 'USD') ?? plans[0];

  const proceed = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email so we can send your account.');
      return;
    }
    if (!country.trim()) {
      toast.error('Pick your country so we charge you correctly.');
      return;
    }
    setSubmitting(true);
    try {
      const init = await initializeClaim(slug, token, email, country.trim());
      if (init.provider === 'simulated' || !init.authorization_url) {
        const verified = await verifyClaim(slug, token, init.reference);
        if (verified.success) {
          onDone();
          return;
        }
        toast.error('Could not verify the payment. Try again.');
        setSubmitting(false);
        return;
      }
      // Real provider: hand off to the hosted payment page; the demo app
      // picks up on return via ?claim=verify&reference=…
      window.location.href = init.authorization_url;
      return;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-md border border-foreground/10 bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
          <p className="font-display text-[16px] font-semibold tracking-[-0.02em]">
            Claim your store
          </p>
          <button onClick={onClose} aria-label="Close" className="text-foreground/50">
            <PiX className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5">
          {emailStage ? (
            <>
              <p className="text-[13px] leading-6 text-foreground/65">
                We keep the store, the products and your agent rules. A link to set your password
                goes to your inbox right after payment.
              </p>
              <label className="mt-5 block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-foreground/70">
                  <PiEnvelopeSimple className="h-3.5 w-3.5" /> Email
                </span>
                <input
                  autoFocus
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@business.com"
                  className="h-11 w-full border border-foreground/15 bg-background px-3 text-[16px] outline-none focus:border-foreground/40"
                />
              </label>
              <label className="mt-4 block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-foreground/70">
                  <PiGlobe className="h-3.5 w-3.5" /> Country
                </span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="h-11 w-full border border-foreground/15 bg-background px-3 text-[16px] outline-none focus:border-foreground/40"
                >
                  {plans.map((entry) => (
                    <option key={entry.countryCode} value={entry.countryName}>
                      {entry.countryName}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={proceed}
                disabled={submitting}
                className="btn-stack mt-5 flex h-12 w-full items-center justify-center gap-2 bg-primary text-[14px] font-medium text-primary-foreground disabled:opacity-60"
              >
                {submitting ? <Spinner className="h-4 w-4" /> : `${claimBannerCta} — pay now`}
              </button>
              <p className="mt-3 text-[11px] leading-5 text-foreground/45">
                {plan ? `${plan.display}. Cancel anytime.` : 'Cancel anytime.'}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const ConnectedScreen = ({ demo }: { demo: DemoBrandPublic }) => (
  <div className="min-h-dvh bg-background">
    <div className="mx-auto max-w-lg px-5 py-16">
      <div className="flex h-12 w-12 items-center justify-center border border-foreground/10 bg-surface">
        <PiCheck className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-5 font-display text-[26px] font-semibold leading-tight tracking-[-0.03em]">
        {demo.brand_name} is yours.
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-foreground/65">
        A link to set your password is on the way to your inbox. One quick thing while we set up:
        connect the channels you already sell on.
      </p>

      <div className="mt-8 space-y-3">
        {[
          {
            name: 'WhatsApp Business',
            note: 'The agent replies to buyers and sends payment links in your chats.',
            value: 'Recommended first',
          },
          {
            name: 'Instagram',
            note: 'Comments and DMs get answers using your catalog.',
            value: 'Connect DMs',
          },
          {
            name: 'TikTok',
            note: 'Replies to product comments with prices and stock.',
            value: 'Connect comments',
          },
        ].map((channel) => (
          <div
            key={channel.name}
            className="flex items-center justify-between gap-3 border border-foreground/10 bg-surface px-4 py-3.5"
          >
            <div>
              <p className="text-[13px] font-medium">{channel.name}</p>
              <p className="mt-0.5 text-[11px] leading-5 text-foreground/55">{channel.note}</p>
            </div>
            <span className="shrink-0 border border-foreground/15 bg-background px-3 py-1.5 text-[12px] font-medium">
              {channel.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.open('https://www.useclymb.com', '_blank')}
        className="btn-stack mt-8 flex h-12 w-full items-center justify-center bg-primary text-[14px] font-medium text-primary-foreground"
      >
        Continue in Clymb
      </button>
      <p className="mt-4 text-center text-[11px] text-foreground/45">
        No real messages sent. Everything in the demo was simulated.
      </p>
    </div>
  </div>
);
