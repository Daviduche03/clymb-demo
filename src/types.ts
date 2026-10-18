
export type DemoClaimPlan = {
  countryCode: string;
  countryName: string;
  currency: string;
  amount: number;
  usdAmount: number;
  display: string;
};

export type DemoBrandPublic = {
  demo_id: string;
  slug: string;
  brand_name: string;
  platform: string;
  handle: string;
  country: string;
  currency: string;
  language: string;
  description: string;
  logo_url: string | null;
  brand_colors: string[];
  template: 'editorial' | 'full-bleed' | 'lookbook';
  rules: string[];
  faqs: { q: string; a: string }[];
  claimed: boolean;
  claim_hint: string;
  claim_plans: DemoClaimPlan[];
  products: DemoProduct[];
  posts: DemoPost[];
  orders: DemoOrder[];
  activities: DemoActivity[];
  summary: DemoSummary | null;
};

export type DemoProduct = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  stock: number;
  description: string;
  imageUrl: string | null;
  imagePlaceholder: boolean;
  postUrl: string | null;
  groupName: string;
  sortOrder: number;
  askCount: number;
  soldCount: number;
};

export type DemoPost = {
  id: string;
  url: string;
  thumbUrl: string | null;
  caption: string;
  postedAt: string;
  productNames: string[];
  sortOrder: number;
};

export type DemoOrder = {
  id: string;
  buyerName: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  amount: number;
  channel: string;
  postUrl: string | null;
  status: 'quoted' | 'awaiting_payment' | 'paid' | 'shipped';
  timeline: DemoTimelineStep[];
  kind: 'question' | 'follow_up' | 'restock';
  createdAt: string;
  sortOrder: number;
};

export type DemoTimelineStep = {
  at: string;
  label: string;
  detail?: string;
  agent: boolean;
};

export type DemoActivity = {
  id: string;
  kind: string;
  headline: string;
  title: string;
  channel: string;
  postUrl: string | null;
  postThumb: string | null;
  productRef: string | null;
  orderRef: string | null;
  at: string;
  sortOrder: number;
};

export type DemoSummary = {
  demoId: string;
  buyersAnswered: number;
  ordersClosed: number;
  revenue: number;
  currency: string;
  hoursSaved: number;
  commentsHandled: number;
};
