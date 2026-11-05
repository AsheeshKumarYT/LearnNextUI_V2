import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { NAV_PATHS } from '@/portals/training-partner/navigation';
// Eager: these must render even when a chunk can't be downloaded (crash / offline)
import PageCrash from '@/pages/errors/PageCrash';
import Offline from '@/pages/errors/Offline';
import { PreviewFrame } from '@/pages/errors/components/ErrorScreen';
import { ProtectedRoute, SignedInRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './AuthRoutes';
import { OfflineGate } from './OfflineGate';
import { ByRole } from './ByRole';

/*
 * Route table. To add a page:
 *   1. create src/pages/<module>/<Page>.jsx (default export)
 *   2. add a lazy import + <Route> below inside the AdminLayout block
 *   3. add a nav item in src/config/navigation.js (gives sidebar entry, breadcrumb and title)
 */
const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const ResetSuccess = lazy(() => import('@/pages/auth/ResetSuccess'));
const ChooseRole = lazy(() => import('@/pages/auth/ChooseRole'));
const RoleComingSoon = lazy(() => import('@/pages/auth/RoleComingSoon'));

const Dashboard = lazy(() => import('@/portals/training-partner/dashboard/Dashboard'));
const Profile = lazy(() => import('@/pages/profile/Profile'));
const Clients = lazy(() => import('@/portals/training-partner/clients/Clients'));
const AddClient = lazy(() => import('@/portals/training-partner/clients/AddClient'));
const ClientDetail = lazy(() => import('@/portals/training-partner/clients/ClientDetail'));
const ManageContent = lazy(() => import('@/portals/training-partner/content/ManageContent'));
const ProgramContent = lazy(() => import('@/portals/training-partner/content/ProgramContent'));
const Facilitators = lazy(() => import('@/portals/training-partner/facilitators/Facilitators'));
const VerifyFacilitator = lazy(() => import('@/portals/training-partner/facilitators/VerifyFacilitator'));
const FacilitatorDetail = lazy(() => import('@/portals/training-partner/facilitators/FacilitatorDetail'));
const FacilitatorPortfolio = lazy(() => import('@/portals/training-partner/facilitators/FacilitatorPortfolio'));
const SupportDesk = lazy(() => import('@/portals/training-partner/support/SupportDesk'));
const Settings = lazy(() => import('@/portals/training-partner/settings/Settings'));
const MasterPage = lazy(() => import('@/portals/training-partner/settings/MasterPage'));
const UiPreview = lazy(() => import('@/portals/training-partner/ui-preview/UiPreview'));
const Placeholder = lazy(() => import('@/portals/training-partner/placeholder/Placeholder'));

// Super Admin's own pages (its portal lives in src/portals/super-admin) — served at the same addresses via ByRole
const SuperClients = lazy(() => import('@/portals/super-admin/SuperClients'));
const SuperClientForm = lazy(() => import('@/portals/super-admin/SuperClientForm'));
const SuperClientDetail = lazy(() => import('@/portals/super-admin/SuperClientDetail'));

// Full-screen system pages
const NotFound = lazy(() => import('@/pages/errors/NotFound'));
const ServerError = lazy(() => import('@/pages/errors/ServerError'));
const ServiceUnavailable = lazy(() => import('@/pages/errors/ServiceUnavailable'));
const SessionExpired = lazy(() => import('@/pages/errors/SessionExpired'));

// Every nav item without a real page yet (generated from src/config/navigation.js)
const BUILT_PAGES = ['/dashboard', '/clients', '/content', '/facilitators', '/settings', '/ui-preview'];
const PLACEHOLDER_PATHS = NAV_PATHS.filter((p) => !BUILT_PAGES.includes(p));

// UI Preview gallery: each system page opened in preview mode (safe actions)
const PREVIEWS = [
  ['404', <NotFound key="404" />],
  ['crash', <PageCrash key="crash" />],
  ['500', <ServerError key="500" />],
  ['503', <ServiceUnavailable key="503" />],
  ['offline', <Offline key="offline" />],
  ['session-expired', <SessionExpired key="session" />],
];

export function AppRoutes() {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary resetKey={pathname} fallback={(error) => <PageCrash error={error} />}>
      <OfflineGate>
        <Suspense fallback={<LoadingState fullPage />}>
          <Routes>
            {/* One AuthLayout around both groups, so going from sign-in to the role picker only swaps the card's
                content — the page itself stays put (no remount / flicker) */}
            <Route element={<AuthLayout />}>
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-success" element={<ResetSuccess />} />
              </Route>
              {/* After sign-in: pick a role (accounts with several), or the "on its way" screen for roles not built yet */}
              <Route element={<SignedInRoute />}>
                <Route path="/choose-role" element={<ChooseRole />} />
                <Route path="/coming-soon" element={<RoleComingSoon />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                {/* Super Admin sees its own clients (training partners) here; every other role the Training Partner pages */}
                <Route path="/clients" element={<ByRole byRole={{ 'super-admin': <SuperClients /> }}><Clients /></ByRole>} />
                <Route path="/clients/new" element={<ByRole byRole={{ 'super-admin': <SuperClientForm /> }}><AddClient /></ByRole>} />
                <Route path="/clients/:id" element={<ByRole byRole={{ 'super-admin': <SuperClientDetail /> }}><ClientDetail /></ByRole>} />
                <Route path="/clients/:id/edit" element={<ByRole byRole={{ 'super-admin': <SuperClientForm /> }}><AddClient /></ByRole>} />
                <Route path="/content" element={<ManageContent />} />
                <Route path="/content/:id" element={<ProgramContent />} />
                <Route path="/facilitators" element={<Facilitators />} />
                <Route path="/facilitators/:id/verify" element={<VerifyFacilitator />} />
                <Route path="/facilitators/:id" element={<FacilitatorDetail />} />
                <Route path="/support" element={<SupportDesk />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/:slug" element={<MasterPage />} />
                <Route path="/ui-preview" element={<UiPreview />} />
                {/* Nav items without a real page yet — replace with the page component when it's built */}
                {PLACEHOLDER_PATHS.map((path) => (
                  <Route key={path} path={path} element={<Placeholder />} />
                ))}
              </Route>
              {/* A facilitator's portfolio: its own full page, outside the shell (opened in a new tab) */}
              <Route path="/facilitators/:id/portfolio" element={<FacilitatorPortfolio />} />
              {PREVIEWS.map(([key, page]) => (
                <Route key={key} path={`/preview/${key}`} element={<PreviewFrame>{page}</PreviewFrame>} />
              ))}
            </Route>

            {/* Real system pages — navigate here from API error handling (500 / 503 / 401) */}
            <Route path="/error" element={<ServerError />} />
            <Route path="/maintenance" element={<ServiceUnavailable />} />
            <Route path="/session-expired" element={<SessionExpired />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Full-screen 404 outside the shell — works signed in or out */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </OfflineGate>
    </ErrorBoundary>
  );
}
