/**
 * Every portal's shell definition, by role key (see src/config/roles.js). A definition =
 *   nav            sidebar items (an item with `children` = a submenu; `devOnly` items sit apart under "Dev only")
 *   links          every navigable page (search "Jump to" list)
 *   tabs           phone bottom tab bar (+ More)
 *   routeMeta(p)   { title, section?, sectionTo? } for a pathname — breadcrumbs and the tab title
 *   notifications  show the header's notifications bell
 *   searchSources  what ⌘K searches (see services/searchApi.js)
 *   SidebarFooter  optional component under the sidebar menu ({ collapsed, onNavigate })
 *   useMoreItems   hook → extra tiles for the phone "More" sheet
 * Add a portal: create src/portals/<role>/portal.js and list it here.
 */
import { trainingPartnerPortal } from './training-partner/portal';
import { superAdminPortal } from './super-admin/portal';

export const PORTALS = {
  admin: trainingPartnerPortal,
  'super-admin': superAdminPortal,
};

/** The signed-in role's portal (Training Partner for anything without its own) */
export const portalFor = (role) => PORTALS[role] ?? trainingPartnerPortal;
