import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PiWarningBold } from 'react-icons/pi';
import { Toaster } from 'sonner';

import { useDemo } from './demo-context';
import { ClaimBanner } from './claim-banner';
import { ClaimModal, useClaimController } from './claim-modal';
import { ConnectedScreen } from './claim-modal';
import { NotLinkedScreen } from './status-screens';
import { DeleteFooter } from './delete-footer';
import { DashboardHeader } from '@/components/demo/dashboard-header';
import { Sidebar } from '@/components/demo/sidebar';
import { SidebarProvider } from '@/providers/sidebar-provider';
import type { DemoBrandPublic } from '@/lib/api';

export const NotFound = () => (
  <NotLinkedScreen
    icon={PiWarningBold}
    title="This demo isn't here"
    description="The link may have expired, been deleted, or the token is off. Ask Clymb for a fresh one."
  />
);

export const DemoLayout = () => {
  const { demo, status } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'missing') navigate('/not-found', { replace: true });
  }, [status, navigate]);

  if (status === 'error') {
    return (
      <NotLinkedScreen
        icon={PiWarningBold}
        title="This demo isn't loading"
        description="Check the link or try again in a moment."
      />
    );
  }

  if (!demo) return null;

  return (
    <SidebarProvider>
      <Shell demo={demo} />
    </SidebarProvider>
  );
};

const Shell = ({ demo }: { demo: DemoBrandPublic }) => {
  const { token } = useDemo();
  const claim = useClaimController({
    demo,
    slug: demo.slug,
    token,
  });

  if (claim.claimed) {
    return (
      <>
        <Toaster position="top-center" />
        <ConnectedScreen demo={demo} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster position="top-center" />
      <DashboardHeader brandName={demo.brand_name} logoUrl={demo.logo_url} />
      <div className="flex flex-1 pt-14">
        <Sidebar slug={demo.slug} className="block" />
        <main className="min-w-0 flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-6 md:p-6 lg:ml-[var(--sidebar-width)]">
          <div className="mx-auto w-full max-w-[76rem] pb-24 lg:pb-16">
            <Outlet />
            <DeleteFooter slug={demo.slug} token={token} />
          </div>
        </main>
      </div>

      <ClaimBanner onOpen={claim.openDialog} />
      {claim.open && (
        <ClaimModal
          slug={demo.slug}
          token={token}
          defaultCountry={demo.country}
          plans={demo.claim_plans}
          onClose={claim.close}
          onDone={claim.markClaimed}
        />
      )}
    </div>
  );
};
