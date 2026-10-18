import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';

import { DemoProvider } from './demo/demo-context';
import { DemoLayout, NotFound } from './demo/layout';
import Landing from './demo/landing';
import AgentPage from './demo/pages/agent';
import OrdersRedirect from './demo/orders-redirect';
import OverviewPage from './demo/pages/overview';
import SitesPage from './demo/pages/sites';
import StorePage from './demo/pages/store';

export default function App() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      const tag = document.createElement('meta');
      tag.name = 'robots';
      tag.content = 'noindex, nofollow';
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route
          path=":slug"
          element={
            <DemoProvider>
              <DemoLayout />
            </DemoProvider>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="orders" element={<OrdersRedirect />} />
          <Route path="sites" element={<SitesPage />} />
          <Route path="agent" element={<AgentPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
