import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { ROUTE_META } from '@/portals/training-partner/navigation';
import { Card } from '@/components/ui';
import { EmptyState } from '@/components/feedback';

/**
 * Temporary page for nav items that aren't built yet. Title and icon come from ROUTE_META.
 * To build the real page: create src/pages/<module>/<Page>.jsx and point its route at it in AppRoutes.jsx.
 */
export default function Placeholder() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? { title: 'Coming soon' };

  return (
    // No title block: the header already shows the page name
    // Fills the page height (see AdminLayout), message centred
    <Card className="flex flex-col justify-center lg:flex-1">
      <EmptyState icon={meta.icon ?? Construction} title="Nothing here yet" description={`The ${meta.title} page hasn’t been built yet.`} />
    </Card>
  );
}
