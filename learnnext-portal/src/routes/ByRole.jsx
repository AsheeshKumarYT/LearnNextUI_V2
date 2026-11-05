import { useAuth } from '@/hooks/useAuth';

/**
 * One address, a page per role: `byRole` maps a role key to its own page (e.g. Super Admin's Manage Clients at
 * /clients); every other role gets `children` (the Training Partner page) — so a role-specific page never changes
 * what the others see.
 */
export function ByRole({ byRole = {}, children }) {
  const { role } = useAuth();
  return byRole[role] ?? children;
}
