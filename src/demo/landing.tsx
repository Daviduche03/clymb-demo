import { PiArrowRight } from 'react-icons/pi';

import { StackButton } from '@/components/shared/stack-button';

const MAIN_SITE = 'https://www.useclymb.com';

export default function Landing() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto w-full max-w-[80rem] px-6 pt-20 pb-14 lg:pt-28 lg:pb-16">
        <div className="flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="Clymb" width={24} height={24} className="h-6 w-6" />
          <span className="font-display text-[16px] font-semibold tracking-[-0.03em]">Clymb</span>
        </div>

        <h1 className="mt-10 max-w-5xl text-balance font-display text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[6rem]">
          Tell Clymb what you&rsquo;re building.
          <br />
          <span className="text-foreground/45">It builds the business.</span>
        </h1>

        <p className="mt-8 max-w-xl text-[17px] leading-7 text-muted-foreground">
          Full store. Real brand. Social content ready to post. Not a template — an actual business,
          built and deployed for you.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <StackButton size="lg" asChild>
            <a href={`${MAIN_SITE}/sign-up`}>
              Build my company
              <PiArrowRight className="ml-2 h-4 w-4" />
            </a>
          </StackButton>

          <a
            href={`${MAIN_SITE}/#how`}
            className="inline-flex items-center text-[14px] text-foreground underline decoration-1 decoration-foreground/20 underline-offset-[6px] transition-colors hover:decoration-foreground"
          >
            How it works
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[80rem] px-6 pb-20 lg:pb-24">
        <div className="overflow-hidden border border-border bg-background">
          <img
            src="/store.png"
            alt="The Clymb Store overview, showing storefront settings and revenue analytics"
            className="block w-full"
          />
        </div>
      </section>
    </main>
  );
}
