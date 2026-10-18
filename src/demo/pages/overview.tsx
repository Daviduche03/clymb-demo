import { useDemo } from '@/demo/demo-context';
import { Card } from '@/components/demo/card';
import { SectionKicker } from '@/components/demo/section-kicker';
import { formatMoney, CHANNEL_LABELS } from '@/lib/api';
import type { DemoActivity } from '@/lib/api';
import {
  PiWhatsappLogoBold,
  PiInstagramLogoBold,
  PiTiktokLogoBold,
} from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const CHANNEL_ICONS: Record<string, typeof PiWhatsappLogoBold> = {
  whatsapp: PiWhatsappLogoBold,
  instagram: PiInstagramLogoBold,
  tiktok: PiTiktokLogoBold,
};

const channelLabel = (channel: string) => CHANNEL_LABELS[channel] ?? channel;

const timeAgo = (iso: string) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const StatGrid = ({
  stats,
}: {
  stats: { label: string; value: string; hint?: string }[];
}) => (
  <section>
    <SectionKicker>This week · Pulse</SectionKicker>
    <Card
      padding="none"
      className="mt-2 grid grid-cols-2 divide-x divide-y divide-foreground/8 md:grid-cols-4 md:divide-y-0"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="px-5 py-4">
          <p className="font-normal font-sans text-[11px] text-foreground/60 uppercase tracking-[0.06em]">
            {stat.label}
          </p>
          <p className="mt-1.5 font-display font-medium text-2xl text-foreground tracking-[-0.02em]">
            {stat.value}
          </p>
          {stat.hint ? (
            <p className="mt-0.5 text-[12px] text-foreground/50">{stat.hint}</p>
          ) : null}
        </div>
      ))}
    </Card>
  </section>
);

export const ChannelBadge = ({ channel }: { channel: string }) => {
  const Icon = CHANNEL_ICONS[channel] ?? PiInstagramLogoBold;
  return (
    <span className="flex items-center gap-1 border border-foreground/10 bg-background px-1.5 py-0.5 text-[10px] text-foreground/60">
      <Icon className="h-3 w-3" />
      {channelLabel(channel)}
    </span>
  );
};

export const ActivityRow = ({ activity }: { activity: DemoActivity }) => {
  const navigate = useNavigate();
  const { demo, token } = useDemo();
  if (!demo) return null;
  const order = demo.orders.find((o) => o.id === activity.orderRef);
  const product = demo.products.find((p) => p.id === activity.productRef);
  const key = `k=${encodeURIComponent(token)}`;

  const open = () => {
    if (order) navigate(`/${demo.slug}/store?tab=orders&o=${order.id}&${key}`);
    else if (product) navigate(`/${demo.slug}/store?${key}`);
  };

  return (
    <button
      onClick={open}
      className="flex w-full items-start gap-3 border-b border-foreground/10 py-4 text-left"
    >
      {activity.postThumb ? (
        <img src={activity.postThumb} alt="" className="h-12 w-12 shrink-0 object-cover" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-foreground/10 bg-surface">
          {activity.orderRef ? (
            <PiWhatsappLogoBold className="h-5 w-5 text-foreground/35" />
          ) : (
            <span className="font-display text-[13px] font-semibold text-foreground/35">
              {activity.title.slice(0, 1)}
            </span>
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-[1.55] text-foreground/80">
          <span className="font-medium text-foreground">Handled.</span> {activity.headline}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <ChannelBadge channel={activity.channel} />
          {activity.postUrl ? (
            <a
              href={activity.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-foreground/55 underline decoration-foreground/20 underline-offset-2"
              onClick={(event) => event.stopPropagation()}
            >
              the post
            </a>
          ) : null}
          {order ? (
            <button
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/${demo.slug}/store?tab=orders&o=${order.id}&${key}`);
              }}
              className="text-[11px] text-foreground/55 underline decoration-foreground/20 underline-offset-2"
            >
              the order
            </button>
          ) : null}
          <span className="text-[11px] text-foreground/40">{timeAgo(activity.at)}</span>
        </div>
      </div>
    </button>
  );
};

export const SimulatedNote = () => (
  <p className="mt-1 text-[11px] text-foreground/45">
    All activity in this demo is simulated. Nothing was sent or charged.
  </p>
);

export default function OverviewPage() {
  const { demo, status, navigating } = useDemo();

  if (!demo) {
    return <SkeletonOverview full={status === 'loading' || navigating} />;
  }

  const { summary } = demo;

  return (
    <div className="space-y-2">
      <header className="pb-4 pt-1">
        <h1 className="font-display font-medium text-3xl text-foreground tracking-[-0.035em] md:text-[34px] text-balance">
          While you were away, {summary?.buyersAnswered ?? 0} buyers got answers.
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-foreground/60">
          Orders kept moving on {demo.platform}. Everything below is simulated.
        </p>
      </header>

      <StatGrid
        stats={[
          { label: 'buyers answered', value: String(summary?.buyersAnswered ?? 0) },
          { label: 'orders closed', value: String(summary?.ordersClosed ?? 0) },
          {
            label: `revenue · ${demo.currency}`,
            value: formatMoney(summary?.revenue ?? 0, demo.currency),
          },
          { label: 'hours saved', value: String(summary?.hoursSaved ?? 0) },
        ]}
      />

      <section className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.06em] text-foreground/50">
          What the agent did
        </p>
        <div className="mt-2 border-t border-foreground/10">
          {demo.activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
}

const SkeletonOverview = ({ full }: { full: boolean }) => (
  <div className="space-y-4">
    <div className="h-3 w-24 animate-pulse bg-foreground/10" />
    <div className={`${full ? 'h-40' : 'h-8'} w-full animate-pulse bg-foreground/5`} />
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse bg-foreground/5" />
      ))}
    </div>
  </div>
);
