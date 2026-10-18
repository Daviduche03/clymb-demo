import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PiMagnifyingGlassBold,
  PiPackageBold,
  PiReceiptBold,
} from 'react-icons/pi';

import { useDemo } from '@/demo/demo-context';
import OrdersPage from '@/demo/pages/orders';
import { Card } from '@/components/demo/card';
import { EmptyState } from '@/components/demo/empty-state';
import { SectionKicker } from '@/components/demo/section-kicker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatMoney, type DemoProduct } from '@/lib/api';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'products', title: 'Products', icon: PiPackageBold },
  { id: 'orders', title: 'Orders', icon: PiReceiptBold },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function StorePage() {
  const { demo } = useDemo();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: TabId = searchParams.get('tab') === 'orders' ? 'orders' : 'products';
  const setActiveTab = (tab: TabId) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    params.delete('o');
    setSearchParams(params);
  };

  if (!demo) {
    return <p className="px-6 py-14 text-center text-[14px] text-foreground/55">Loading products…</p>;
  }

  return (
    <div className="space-y-2">
      <header className="pb-4 pt-1">
        <h1 className="mt-1.5 font-display font-medium text-3xl text-foreground tracking-[-0.035em] text-balance md:text-[34px]">
          Store
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-foreground/60">
          Catalog and orders for {demo.brand_name}, priced from your posts.
        </p>
      </header>

      <nav
        aria-label="Store sections"
        className="-mx-1 flex gap-1 overflow-x-auto border-foreground/10 border-b px-1 pb-px"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                isActive
                  ? 'relative flex shrink-0 items-center gap-2 px-4 py-3 text-[13px] transition-colors text-foreground'
                  : 'relative flex shrink-0 items-center gap-2 px-4 py-3 text-[13px] transition-colors text-foreground/55 hover:text-foreground'
              }
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.title}</span>
              <span
                aria-hidden
                className={
                  isActive
                    ? '-bottom-px absolute inset-x-3 h-px transition-colors bg-primary'
                    : '-bottom-px absolute inset-x-3 h-px transition-colors bg-transparent'
                }
              />
            </button>
          );
        })}
      </nav>

      {activeTab === 'orders' ? <OrdersPage /> : <ProductsTab />}
    </div>
  );
}

function ProductsTab() {
  const { demo } = useDemo();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');

  const groups = useMemo(() => {
    if (!demo) return [] as string[];
    return Array.from(new Set(demo.products.map((product) => product.groupName || 'Products')));
  }, [demo]);

  const products = useMemo(() => {
    if (!demo) return [] as DemoProduct[];
    const query = search.trim().toLowerCase();
    return demo.products.filter((product) => {
      if (groupFilter !== 'all' && (product.groupName || 'Products') !== groupFilter) return false;
      if (query && !product.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [demo, search, groupFilter]);

  if (!demo) {
    return <p className="px-6 py-14 text-center text-[14px] text-foreground/55">Loading products…</p>;
  }

  const hasFilters = search.trim().length > 0 || groupFilter !== 'all';

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionKicker count={products.length}>Catalog</SectionKicker>
      </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
            <PiMagnifyingGlassBold className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-foreground/40" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name"
              className="h-10 rounded-none border-foreground/15 pl-9 shadow-none text-[16px]"
            />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="h-10 w-full rounded-none border-foreground/15 shadow-none sm:w-[180px]">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-foreground/10 shadow-none">
              <SelectItem value="all" className="rounded-none">
                All groups
              </SelectItem>
              {groups.map((group) => (
                <SelectItem key={group} value={group} className="rounded-none">
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card padding="none" className="mt-3 overflow-hidden">
          {products.length === 0 ? (
            hasFilters ? (
              <EmptyState
                icon={PiMagnifyingGlassBold}
                title="No products match"
                description="Try a different search, or clear the filters to see the full catalog."
              />
            ) : (
              <EmptyState
                icon={PiPackageBold}
                title="No products yet"
                description="Products from your posts will appear here."
              />
            )
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground/8 border-b bg-foreground/[0.02] hover:bg-foreground/[0.02]">
                    <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                      Product
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                      Price
                    </TableHead>
                    <TableHead className="hidden px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5 md:table-cell">
                      Group
                    </TableHead>
                    <TableHead className="hidden px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5 lg:table-cell">
                      Stock
                    </TableHead>
                    <TableHead className="hidden px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5 lg:table-cell">
                      Asked
                    </TableHead>
                    <TableHead className="hidden px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5 lg:table-cell">
                      Sold
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium font-mono text-[11px] text-foreground/55 uppercase tracking-[0.16em] sm:px-5">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-foreground/8 border-b last:border-b-0 hover:bg-surface"
                    >
                      <TableCell className="px-4 py-3 sm:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              loading="lazy"
                              className="h-10 w-10 shrink-0 border border-foreground/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground/10 bg-surface text-[10px] text-foreground/40">
                              —
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="min-w-0 truncate font-medium text-[14px] text-foreground">
                              {product.name}
                            </p>
                            {product.sizes.length > 0 ? (
                              <p className="truncate text-[11px] text-foreground/45">
                                {product.sizes.join(' · ')}
                              </p>
                            ) : null}
                            <p className="mt-0.5 text-[11px] text-foreground/55 sm:hidden">
                              Asked {product.askCount} · Sold {product.soldCount}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-[13px] text-foreground sm:px-5">
                        {formatMoney(product.price, demo.currency)}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 text-[13px] text-foreground/65 sm:px-5 md:table-cell">
                        {product.groupName || '—'}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 font-mono text-[13px] text-foreground/65 sm:px-5 lg:table-cell">
                        {product.stock}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 font-mono text-[13px] text-foreground/65 sm:px-5 lg:table-cell">
                        {product.askCount}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 font-mono text-[13px] text-foreground/65 sm:px-5 lg:table-cell">
                        {product.soldCount}
                      </TableCell>
                      <TableCell className="px-4 py-3 sm:px-5">
                        <span
                          className={cn(
                            'inline-block border px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]',
                            product.stock > 0
                              ? 'border-emerald-500/25 text-emerald-700'
                              : 'border-foreground/15 text-foreground/45'
                          )}
                        >
                          {product.stock > 0 ? 'In stock' : 'Sold out'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </section>
  );
}
