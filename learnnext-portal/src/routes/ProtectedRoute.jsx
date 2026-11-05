import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PORTAL_ROLES, roleCanOpen } from '@/config/roles';

/**
 * Redirects unauthenticated users to /login and remembers where they were going. Signed in but no role picked yet
 * (an account with several roles) → /choose-role; a role whose portal isn't built yet → /coming-soon.
 */
export function ProtectedRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!role) return <Navigate to="/choose-role" replace state={{ from: location }} />;
  if (!PORTAL_ROLES[role]?.ready) return <Navigate to="/coming-soon" replace />;
  // A limited portal (e.g. Super Admin) can only open its own pages — anything else goes to its home
  if (!roleCanOpen(role, location.pathname)) return <Navigate to={PORTAL_ROLES[role].home} replace />;
  return <Outlet />;
}

/** The role picker and "on its way" pages: need a session (not a role) */
export function SignedInRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
