import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import { DemoContext } from '../src/demo/demo-context';
import OverviewPage from '../src/demo/pages/overview';
import StorePage from '../src/demo/pages/store';
import OrdersPage from '../src/demo/pages/orders';
import SitesPage from '../src/demo/pages/sites';
import AgentPage from '../src/demo/pages/agent';

const demo = {
  demo_id: 'x',
  slug: 'anu-s-closet',
  brand_name: "Anu's Closet",
  platform: 'instagram',
  handle: 'anuscloset.ng',
  country: 'Nigeria',
  currency: 'NGN',
  language: 'English',
  description: 'Ready-to-wear.',
  logo_url: null,
  brand_colors: ['#1d3a2f'],
  template: 'editorial',
  rules: ['Never promise delivery before payment.'],
  faqs: [],
  claimed: false,
  claim_hint: '₦25,000/mo, 14 days free',
  products: [
    {
      id: 'p1', name: 'Asoke Maxi Dress', price: 25000, sizes: ['S', 'M'], stock: 4,
      description: 'Maxi', imageUrl: null, imagePlaceholder: false, postUrl: null,
      groupName: 'Dresses', sortOrder: 0, askCount: 6, soldCount: 2,
    },
  ],
  posts: [],
  orders: [
    {
      id: 'o1', buyerName: 'Ada', productId: 'p1', productName: 'Asoke Maxi Dress',
      productImage: null, amount: 25000, channel: 'instagram', postUrl: 'https://x/post',
      status: 'paid', timeline: [{ at: new Date().toISOString(), label: 'Paid', agent: true }],
      kind: 'question', createdAt: new Date().toISOString(), sortOrder: 0,
    },
  ],
  activities: [
    {
      id: 'a1', kind: 'question',
      headline: 'Someone asked "how much?" Paid, NGN 25,000.',
      title: 'Asoke Maxi Dress', channel: 'instagram', postUrl: 'https://x/post',
      postThumb: null, productRef: 'p1', orderRef: 'o1', at: new Date().toISOString(), sortOrder: 0,
    },
  ],
  summary: {
    demoId: 'x', buyersAnswered: 1, ordersClosed: 1, revenue: 25000,
    currency: 'NGN', hoursSaved: 1, commentsHandled: 2,
  },
};

const state = {
  status: 'ready',
  demo,
  token: 'tok',
  error: null,
  navigating: false,
  trackClaimClick: () => undefined,
  productOrderCount: () => 1,
};

const pages: Record<string, unknown> = {
  overview: OverviewPage,
  store: StorePage,
  orders: OrdersPage,
  sites: SitesPage,
  agent: AgentPage,
};

const checks: Record<string, string> = {
  overview: 'buyers answered',
  store: 'Asoke Maxi Dress',
  orders: 'Paid',
  sites: 'Editorial',
  agent: 'House rules',
};

const failures: string[] = [];
for (const [name, Page] of Object.entries(pages)) {
  try {
    const html = renderToStaticMarkup(
      h(MemoryRouter, null, h(DemoContext.Provider, { value: state as never }, h(Page as never, null)))
    );
    const token = checks[name];
    if (!html.includes(token) || html.length < 300) {
      failures.push(`${name}: missing "${token}" (${html.length} chars)`);
    } else {
      console.log(`${name}: renders OK (${html.length} chars)`);
    }
  } catch (error) {
    failures.push(`${name}: ${(error as Error).message}`);
  }
}
if (failures.length > 0) {
  console.error('FAILURES:', failures);
  process.exit(1);
}
console.log('ALL PAGES RENDER');
