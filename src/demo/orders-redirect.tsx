import { Navigate, useLocation, useParams } from 'react-router-dom';

export default function OrdersRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.set('tab', 'orders');
  return <Navigate to={`/${slug}/store?${params.toString()}`} replace />;
}
