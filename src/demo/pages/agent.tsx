import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PiArrowUp,
  PiCheckBold,
  PiChatCircleDotsBold,
  PiPencil,
  PiPlus,
} from 'react-icons/pi';
import { toast } from 'sonner';

import { useDemo } from '@/demo/demo-context';
import { saveRules, fetchChatHistory, sendChatMessage } from '@/lib/api';
import type { DemoProduct } from '@/lib/api';
import { formatMoney } from '@/lib/api';

type Message = { role: 'user' | 'agent'; text: string };

const SUGGESTIONS = (product: DemoProduct | undefined) => [
  'How much is the ' + product?.name.toLowerCase() + '?',
  'Is it still available?',
  'What sizes do you have?',
  'I want to buy it',
];

export default function AgentPage() {
  const { demo, token } = useDemo();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [rules, setRules] = useState<string[]>(demo?.rules ?? []);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [newRule, setNewRule] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (demo) setRules(demo.rules);
  }, [demo]);

  useEffect(() => {
    if (!slug || !token) return;
    fetchChatHistory(slug, token)
      .then((history) =>
        setMessages(
          history.messages.map((message) => ({
            role: message.role === 'user' ? 'user' : 'agent',
            text: message.text,
          }))
        )
      )
      .catch(() => undefined);
  }, [slug, token]);

  const persistRules = (next: string[]) => {
    if (!slug) return;
    saveRules(slug, token, next).catch(() =>
      toast.error('Rule saved locally — sync failed. Try again later.')
    );
  };

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  const greeting = useMemo(() => {
    if (!demo) return '';
    const firstProduct = demo.products[0];
    return firstProduct
      ? `Hey! Looking at ${firstProduct.name}? I can give prices, sizes or a payment link.`
      : 'Hey! Ask me about any product.';
  }, [demo]);

  if (!demo) return <div className="h-[70dvh] w-full animate-pulse bg-foreground/5" />;

  const send = async (text: string) => {
    if (!text.trim() || sending || !slug) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setSending(true);
    try {
      const response = await sendChatMessage(slug, token, text);
      setMessages((prev) => [...prev, { role: 'agent', text: response.reply }]);
      setRemaining(response.remaining);
      if (response.order_id) {
        toast.success('Order drafted — see it in Orders.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Chat failed. Try again.';
      if (message.includes('capped')) {
        setMessages((prev) => [...prev, { role: 'agent', text: message }]);
      } else {
        toast.error(message);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="pb-1 pt-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/50">Agent</p>
        <h1 className="mt-1.5 font-display font-medium text-3xl text-foreground tracking-[-0.035em] text-balance md:text-[34px]">
          Works in your chats. Answers like you.
        </h1>
        <p className="mt-1 text-[11px] text-foreground/45">
          Rules apply to every reply, instantly. Try the chat as a buyer — catalog and pricing come
          from your real products.
        </p>
      </header>

      <section>
        <p className="mb-2 text-[11px] uppercase tracking-[0.06em] text-foreground/50">
          House rules
        </p>
        <div className="border border-foreground/10 bg-surface p-4">
          <ul className="space-y-2.5">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <PiCheckBold className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {editingRule === index ? (
                  <>
                    <input
                      autoFocus
                      value={rule}
                      onChange={(event) =>
                        setRules((prev) =>
                          prev.map((value, i) => (i === index ? event.target.value : value))
                        )
                      }
                      className="h-8 flex-1 border border-foreground/15 px-2 text-[13px]"
                    />
                    <button
                      onClick={() => {
                        setEditingRule(null);
                        persistRules(rules);
                      }}
                      className="text-[12px] font-medium text-primary"
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-[13px] leading-6">{rule}</span>
                    <button
                      onClick={() => setEditingRule(index)}
                      className="text-foreground/40 hover:text-foreground"
                      aria-label="Edit rule"
                    >
                      <PiPencil className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {rules.length < 6 ? (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!newRule.trim()) return;
                const next = [...rules, newRule.trim()];
                setRules(next);
                setNewRule('');
                persistRules(next);
                toast.success('New rule active — the agent replies this way now.');
              }}
            >
              <input
                value={newRule}
                onChange={(event) => setNewRule(event.target.value)}
                placeholder="Add a rule, e.g. Free delivery over {currency} {amount}"
                className="h-9 flex-1 border border-foreground/15 bg-background px-2.5 text-[13px]"
              />
              <button
                type="submit"
                className="btn-stack-sm flex h-9 items-center gap-1 bg-primary px-3 text-[12px] font-medium text-primary-foreground"
              >
                <PiPlus className="h-3.5 w-3.5" /> Add
              </button>
            </form>
          ) : null}
          <p className="mt-3 text-[11px] text-foreground/40">
            Changes take effect in the live chat right away.
          </p>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] uppercase tracking-[0.06em] text-foreground/50">
          Try it as a buyer
        </p>
        <div className="border border-foreground/10">
          <div className="flex items-center gap-2 border-b border-foreground/10 bg-surface px-4 py-2.5">
            <PiChatCircleDotsBold className="h-4 w-4 text-primary" />
            <span className="text-[12px] font-medium">{demo.brand_name}</span>
            <span className="ml-auto text-[10px] text-foreground/40">
              {remaining !== null ? `${remaining} left` : 'Simulated'}
            </span>
          </div>
          <div ref={scrollerRef} className="max-h-[46dvh] min-h-[240px] overflow-y-auto px-4 py-4">
            <Bubble role="agent" text={greeting} />
            {messages.map((message, index) => (
              <Bubble key={index} role={message.role} text={message.text} />
            ))}
            {sending ? (
              <div className="mt-2 flex gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/30" />
                <span className="mt-1 h-2 w-1.5 animate-pulse rounded-full bg-foreground/30" style={{ animationDelay: '120ms' }} />
                <span className="mt-1 h-2 w-1.5 animate-pulse rounded-full bg-foreground/30" style={{ animationDelay: '240ms' }} />
              </div>
            ) : null}
          </div>
          {messages.length === 0 ? (
            <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
              {SUGGESTIONS(demo.products[0]).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void send(suggestion)}
                  className="shrink-0 border border-foreground/15 bg-background px-2.5 py-1.5 text-[11px] text-foreground/70"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
          <form
            className="flex items-center gap-2 border-t border-foreground/10 px-3 py-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Message…"
              className="h-10 flex-1 bg-transparent text-[16px] outline-none placeholder:text-foreground/40"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Send"
            >
              <PiArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

const Bubble = ({ role, text }: { role: 'user' | 'agent'; text: string }) => (
  <div className={`mt-2.5 flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-[1.5] ${
        role === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'border border-foreground/10 bg-surface text-foreground/85'
      }`}
    >
      {text}
    </div>
  </div>
);
