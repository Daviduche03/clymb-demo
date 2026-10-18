import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDemo } from '@/demo/demo-context';
import { formatMoney, CHANNEL_LABELS } from '@/lib/api';
import type { DemoOrder, DemoTimelineStep } from '@/lib/api';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SectionKicker } from '@/components/demo/section-kicker';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<DemoOrder['status'], string> = {
  quoted: 'Quoted',
  awaiting_payment: 'Awaiting payment',
  paid: 'Paid',
  shipped: 'Shipped',
};

const Timeline = ({ steps }: { steps: DemoTimelineStep[] }) => {
  const format = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  return (
    <ol className="mt-1 space-y-3 border-l border-foreground/10 pl-4">
      {steps.map((step, index) => (
        <li key={index} className="relative">
          <span
            className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${
              step.agent ? 'bg-primary' : 'bg-foreground/40'
            }`}
          />
          <p className="text-[13px] font-medium leading-5">{step.label}</p>
          {step.detail ? (
            <p className="text-[12px] leading-5 text-foreground/55">{step.detail}</p>
          ) : null}
          <p className="text-[10px] text-foreground/35">{format(step.at)}</p>
        </li>
      ))}
    </ol>
  );
};

export default function OrdersPage() {
  const { demo, status, navigating } = useDemo();
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get('o');

  const orders = demo?.orders ?? [];
  const open = useMemo(() => orders.find((order) => order.id === openId) ?? null, [orders, openId]);

  const openSheet = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('o', id);
    setSearchParams(params);
  };
  const closeSheet = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('o');
    setSearchParams(params);
  };

  if (!demo) {
    return (
      <p className="px-6 py-14 text-center text-[14px] text-foreground/55">
        {status === 'loading' || navigating ? 'Loading orders…' : 'No orders yet.'}
      </p>
    );
  }

  const paid = orders.filter((order) => order.status === 'paid' || order.status === 'shipped');

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionKicker count={orders.length}>Orders</SectionKicker>
        <p className="text-[12px] text-foreground/55">
          {formatMoney(
            paid.reduce((sum, order) => sum + order.amount, 0),
            demo.currency
          )}{' '}
          collected
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="border border-foreground/10 bg-surface px-4 py-8 text-center text-[13px] text-foreground/55">
          No orders yet in the demo.
        </p>
      ) : (
        <div className="overflow-x-auto border border-foreground/10">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/8 border-b bg-foreground/[0.02] hover:bg-foreground/[0.02]">
                <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                  Buyer
                </TableHead>
                <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                  Product
                </TableHead>
                <TableHead className="hidden px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5 md:table-cell">
                  Channel
                </TableHead>
                <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                  Amount
                </TableHead>
                <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => openSheet(order.id)}
                  className="cursor-pointer border-foreground/8 border-b last:border-b-0 hover:bg-surface"
                >
                  <TableCell className="px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 shrink-0 border border-foreground/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground/10 bg-surface text-[10px] text-foreground/40">
                          —
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[14px] text-foreground">
                          {order.buyerName}
                        </p>
                        <p className="truncate text-[11px] text-foreground/45 md:hidden">
                          {order.productName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-4 py-3 text-[13px] text-foreground/65 sm:px-5">
                    {order.productName}
                  </TableCell>
                  <TableCell className="hidden px-4 py-3 text-[13px] text-foreground/65 sm:px-5 md:table-cell">
                    {CHANNEL_LABELS[order.channel] ?? order.channel}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-mono text-[13px] text-foreground sm:px-5">
                    {formatMoney(order.amount, demo.currency)}
                  </TableCell>
                  <TableCell className="px-4 py-3 sm:px-5">
                    <span
                      className={cn(
                        'inline-block border px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]',
                        order.status === 'paid' || order.status === 'shipped'
                          ? 'border-emerald-500/25 text-emerald-700'
                          : order.status === 'awaiting_payment'
                            ? 'border-amber-500/30 text-amber-700'
                            : 'border-foreground/15 text-foreground/45'
                      )}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={Boolean(open)} onOpenChange={(next) => !next && closeSheet()}>
        <SheetContent side="right" className="overflow-y-auto p-0 sm:max-w-md">
          {open ? (
            <div className="px-6 py-6">
              <SheetHeader className="p-0 text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/50">
                  Order · {STATUS_LABEL[open.status]}
                </p>
                <SheetTitle className="mt-1 font-display text-[20px] tracking-[-0.02em]">
                  {open.buyerName} · {formatMoney(open.amount, demo.currency)}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex items-center gap-3">
                {open.productImage ? (
                  <img src={open.productImage} className="h-14 w-14 object-cover" alt="" />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{open.productName}</p>
                  <p className="text-[11px] text-foreground/55">
                    {CHANNEL_LABELS[open.channel] ?? open.channel}
                    {open.kind === 'follow_up'
                      ? ' · follow-up win'
                      : open.kind === 'restock'
                        ? ' · restock re-engagement'
                        : ''}
                    {open.postUrl ? (
                      <>
                        {' '}·{' '}
                        <a
                          href={open.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-foreground/20 underline-offset-2"
                        >
                          source post
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Timeline steps={open.timeline} />
              </div>
              <p className="mt-4 text-[11px] text-foreground/45">
                Simulated order — shown only in this demo.
              </p>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
