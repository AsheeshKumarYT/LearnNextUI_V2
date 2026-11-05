import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Wraps public auth pages: signed-in users are sent on — to the page they
 * originally requested (set by ProtectedRoute) or the dashboard.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  if (isAuthenticated) {
    const from = location.state?.from;
    // No role picked yet → straight to the picker (no hop through /dashboard)
    if (!role) return <Navigate to="/choose-role" replace state={from ? { from } : undefined} />;
    const to = from ? `${from.pathname}${from.search ?? ''}` : '/dashboard';
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
}
