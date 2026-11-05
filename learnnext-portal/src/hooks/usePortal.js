import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PORTAL_ROLES, roleCanOpen } from '@/config/roles';
import { portalFor } from '@/portals';

/**
 * The signed-in role's portal, for the app's shell (sidebar, phone menus, header, search, tab title): its shell
 * definition (src/portals/<role>/portal.js — menu, tabs, page names, search, footer card…) plus the role's label
 * (the line under the logo), home page and what it may open (src/config/roles.js). `limited` = a role that may open
 * only some pages (Super Admin).
 */
export function usePortal() {
  const { role } = useAuth();
  return useMemo(() => {
    const r = PORTAL_ROLES[role] ?? PORTAL_ROLES.admin;
    return {
      ...portalFor(role),
      role,
      label: r.label,
      home: r.home ?? '/dashboard',
      limited: Boolean(r.allow),
      can: (path) => roleCanOpen(role, path),
    };
  }, [role]);
}
