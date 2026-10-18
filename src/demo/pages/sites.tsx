import { useDemo } from '@/demo/demo-context';
import { formatMoney } from '@/lib/api';
import { PiCursorClickBold, PiLinkSimpleBold } from 'react-icons/pi';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function SitesPage() {
  const { demo } = useDemo();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('k') ?? '';

  if (!demo) {
    return <div className="mt-2 h-[70dvh] w-full animate-pulse bg-foreground/5" />;
  }

  const colors = demo.brand_colors.length > 0 ? demo.brand_colors : ['#e8e2d9'];

  const share = async () => {
    const shareUrl = `${window.location.origin}/${demo.slug}/sites?k=${encodeURIComponent(tokenParam)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: demo.brand_name, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied. This could be your link in bio.');
    } catch {
      toast.error('Could not share. Copy the URL bar instead.');
    }
  };

  return (
    <div className="space-y-5">
      <header className="pb-1 pt-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/50">Sites</p>
        <h1 className="mt-1.5 font-display font-medium text-3xl text-foreground tracking-[-0.035em] text-balance md:text-[34px]">
          Your storefront. Built from your posts.
        </h1>
        <p className="mt-1 text-[11px] text-foreground/45">
          {demo.template === 'editorial'
            ? 'Editorial — magazine-style with a split hero.'
            : demo.template === 'full-bleed'
              ? 'Full-bleed — a full-screen photo hero.'
              : 'Lookbook — gallery-led browsing.'}
        </p>
      </header>

      <button
        onClick={share}
        className="btn-stack-sm flex h-10 items-center gap-2 bg-primary px-4 text-[13px] font-medium text-primary-foreground"
      >
        <PiLinkSimpleBold className="h-4 w-4" />
        Share it — this could be your link in bio
      </button>

      <StorefrontFrame label={demo.slug}>
        {demo.template === 'editorial' ? (
          <EditorialStorefront demo={demo} accent={colors[0]} />
        ) : demo.template === 'full-bleed' ? (
          <FullBleedStorefront demo={demo} accent={colors[0]} />
        ) : (
          <LookbookStorefront demo={demo} accent={colors[0]} />
        )}
      </StorefrontFrame>
      <p className="flex items-center gap-1.5 text-[11px] text-foreground/45">
        <PiCursorClickBold className="h-3.5 w-3.5" />
        Real products from your page. Branding from your colors.
      </p>
    </div>
  );
}

const StorefrontFrame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="border border-foreground/10 bg-white">
    <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="ml-2 truncate rounded-sm bg-surface px-2 py-0.5 text-[10px] text-foreground/45">
        {label}.useclymb.com
      </span>
    </div>
    <div className="max-h-[72dvh] overflow-y-auto">{children}</div>
  </div>
);

type StorefrontDemo = NonNullable<ReturnType<typeof useDemo>['demo']>;

const Hero = ({ demo, accent }: { demo: StorefrontDemo; accent: string }) => (
  <div className="relative">
    {demo.products[0]?.imageUrl ? (
      <img src={demo.products[0].imageUrl} className="h-44 w-full object-cover sm:h-60" alt="" />
    ) : (
      <div className="h-44 w-full sm:h-60" style={{ background: accent }} />
    )}
    <div className="absolute inset-0 flex items-end bg-black/25 p-4">
      <div>
        <p className="font-display text-[20px] font-semibold text-white sm:text-[26px]">
          {demo.brand_name}
        </p>
        {demo.description ? (
          <p className="mt-1 max-w-sm text-[11px] leading-5 text-white/85">{demo.description}</p>
        ) : null}
      </div>
    </div>
  </div>
);

const Grid = ({ demo }: { demo: StorefrontDemo }) => (
  <div className="grid grid-cols-2 gap-px bg-foreground/10 sm:grid-cols-3">
    {demo.products.slice(0, 8).map((product) => (
      <div key={product.id} className="bg-white">
        <div className="aspect-square bg-surface">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="px-3 py-2">
          <p className="truncate text-[12px] font-medium">{product.name}</p>
          <p className="text-[12px] text-foreground/70">{formatMoney(product.price, demo.currency)}</p>
        </div>
      </div>
    ))}
  </div>
);

const Footer = ({ demo, accent }: { demo: StorefrontDemo; accent: string }) => (
  <footer className="px-4 py-8" style={{ background: accent }}>
    <p className="font-display text-[18px] font-semibold text-white/95">{demo.brand_name}</p>
    <p className="mt-1 text-[11px] text-white/70">@{demo.handle} on {demo.platform}</p>
  </footer>
);

const EditorialStorefront = ({ demo, accent }: { demo: StorefrontDemo; accent: string }) => (
  <>
    <Hero demo={demo} accent={accent} />
    <div className="grid gap-0 sm:grid-cols-2">
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-foreground/40">New in</p>
        <p className="mt-2 font-display text-[18px] font-semibold leading-snug tracking-[-0.02em]">
          {demo.products[0]?.name ?? 'Featured'}
        </p>
        <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-foreground/60">
          {demo.products[0]?.description || 'Straight from your latest post.'}
        </p>
      </div>
      {demo.products[1]?.imageUrl ? (
        <img src={demo.products[1].imageUrl} className="h-full min-h-40 w-full object-cover" alt="" />
      ) : null}
    </div>
    <div className="border-t border-foreground/10" />
    <Grid demo={demo} />
    <Footer demo={demo} accent={accent} />
  </>
);

const FullBleedStorefront = ({ demo, accent }: { demo: StorefrontDemo; accent: string }) => (
  <>
    <div className="px-4 py-2 text-center text-[10px] uppercase tracking-[0.08em] text-white" style={{ background: accent }}>
      Selling every day on {demo.platform}
    </div>
    <Hero demo={demo} accent={accent} />
    <Grid demo={demo} />
    <Footer demo={demo} accent={accent} />
  </>
);

const LookbookStorefront = ({ demo, accent }: { demo: StorefrontDemo; accent: string }) => (
  <>
    <div className="px-4 pt-5 pb-2 text-center">
      <p className="font-display text-[22px] font-semibold tracking-[-0.03em]">{demo.brand_name}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-foreground/45">
        The lookbook
      </p>
    </div>
    <div className="grid grid-cols-2 gap-px bg-foreground/10">
      {demo.products.slice(0, 10).map((product, i) => (
        <div key={product.id} className={i % 5 === 0 ? 'col-span-2' : ''}>
          <div className={i % 5 === 0 ? 'aspect-[2/1] bg-surface' : 'aspect-square bg-surface'}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="px-3 py-2 bg-white">
            <p className="truncate text-[12px] font-medium">{product.name}</p>
            <p className="text-[12px] text-foreground/70">{formatMoney(product.price, demo.currency)}</p>
          </div>
        </div>
      ))}
    </div>
    <Footer demo={demo} accent={accent} />
  </>
);
