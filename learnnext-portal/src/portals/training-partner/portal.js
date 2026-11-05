/**
 * The Training Partner portal, as the app's shell sees it (read through usePortal — the shell itself knows nothing
 * portal-specific): its menu, phone tab bar, page names, ⌘K search sources, the sidebar's footer card and the extra
 * tiles in the phone "More" sheet. Every portal has one of these (see src/portals/index.js).
 */
import { Building2, Headset, LayoutDashboard, Library, Users } from 'lucide-react';
import { awaitingReply, useTickets } from './support/supportStore';
import { NAV_ITEMS, NAV_LINKS, getRouteMeta } from './navigation';
import { searchSources } from './search';
import { SidebarFooter } from './support/SidebarFooter';

export const trainingPartnerPortal = {
  nav: NAV_ITEMS,
  links: NAV_LINKS,
  // Phones: the everyday pages in the bottom tab bar; everything else sits behind "More"
  tabs: [
    { label: 'Home', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Clients', to: '/clients', icon: Building2 },
    { label: 'Facilitators', to: '/facilitators', icon: Users },
    { label: 'Content', to: '/content', icon: Library },
  ],
  routeMeta: getRouteMeta,
  notifications: true,
  searchSources,
  SidebarFooter,
  // Extra tiles in the phone "More" sheet (a hook — it reads live ticket counts)
  useMoreItems() {
    const waiting = useTickets().filter(awaitingReply).length;
    return [{ to: '/support', label: 'Support', icon: Headset, note: waiting ? `${waiting} waiting` : undefined }];
  },
};
