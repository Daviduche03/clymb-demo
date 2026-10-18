import type {
  DemoActivity,
  DemoBrandPublic,
  DemoClaimPlan,
  DemoOrder,
  DemoPost,
  DemoProduct,
  DemoSummary,
  DemoTimelineStep,
} from '@/types';

export type {
  DemoActivity,
  DemoBrandPublic,
  DemoClaimPlan,
  DemoOrder,
  DemoPost,
  DemoProduct,
  DemoSummary,
  DemoTimelineStep,
};

export class DemoNotFound extends Error {
  constructor() {
    super('demo-not-found');
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (response.status === 404) throw new DemoNotFound();
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

const SESSION_KEY = 'clymb-demo-key';

export const sessionKey = () => {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const key = Math.random().toString(36).slice(2, 12);
  localStorage.setItem(SESSION_KEY, key);
  return key;
};

export const fetchPublicDemo = (
  slug: string,
  token: string,
  page: string,
  countsAsView: boolean
) =>
  request<DemoBrandPublic>(
    `/api/v1/demos/pub/${slug}?k=${encodeURIComponent(token)}&page=${page}&count=${countsAsView ? '1' : '0'}`
  );

export const sendChatMessage = (slug: string, token: string, message: string) =>
  request<{ reply: string; order_id: string | null; remaining: number }>(
    `/api/v1/demos/pub/${slug}/chat`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
        message,
        session_key: sessionKey(),
      }),
    }
  );

export const saveRules = (slug: string, token: string, rules: string[]) =>
  request<{ success: boolean; rules: string[] }>(`/api/v1/demos/pub/${slug}/rules`, {
    method: 'POST',
    body: JSON.stringify({ token, rules }),
  });

export const fetchChatHistory = (slug: string, token: string) =>
  request<{ messages: { id: string; role: string; text: string; orderRef: string | null }[] }>(
    `/api/v1/demos/pub/${slug}/chat?k=${encodeURIComponent(token)}&session_key=${encodeURIComponent(sessionKey())}`
  );

export const trackClaimClick = (slug: string, token: string) =>  request<{ success: boolean }>(`/api/v1/demos/pub/${slug}/track`, {
    method: 'POST',
    body: JSON.stringify({ token, action: 'claim_click' }),
  });

export const initializeClaim = (slug: string, token: string, email: string, country: string) =>
  request<{
    provider: string;
    reference: string;
    authorization_url: string | null;
    email_saved: boolean;
    currency: string;
    display: string;
  }>(`/api/v1/demos/pub/${slug}/claim`, {
    method: 'POST',
    body: JSON.stringify({ token, email, country }),
  });

export const verifyClaim = (slug: string, token: string, reference: string) =>
  request<{ success: boolean; provider: string; claimed_email: string; magic_link_sent: boolean }>(
    `/api/v1/demos/pub/${slug}/claim/verify?reference=${encodeURIComponent(reference)}&k=${encodeURIComponent(token)}`
  );

export const deleteDemo = (slug: string, token: string) =>
  request<void>(`/api/v1/demos/pub/${slug}`, {
    method: 'DELETE',
    body: JSON.stringify({ token }),
  });

export const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  GHS: '₵',
  ZAR: 'R',
  KES: 'KSh ',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const formatMoney = (amount: number, currency: string) => {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
};
