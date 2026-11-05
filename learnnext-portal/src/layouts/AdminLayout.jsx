import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { APP_NAME, STORAGE_KEYS } from '@/config/app';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useHotkey } from '@/hooks/useHotkey';
import { usePortal } from '@/hooks/usePortal';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { BottomNav } from '@/components/navigation/BottomNav';
import { InstallCard } from '@/components/pwa/PwaPrompts';
import { GlobalSearch } from '@/components/navigation/GlobalSearch';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Footer } from '@/components/layout/Footer';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PendingToasts } from '@/context/ToastContext';

/**
 * The one admin shell: Sidebar + Header + main content + Footer.
 * Pages render into <Outlet /> and should NOT add their own outer padding or max-width.
 *
 * Responsive behaviour:
 *   < md   : bottom tab bar (main pages + More → off-canvas drawer)
 *   md–lg  : icon rail sidebar (tooltips); its edge handle opens the full sidebar OVER the page (backdrop, closes on navigate)
 *   ≥ lg   : full sidebar, user-collapsible (persisted)
 */
export function AdminLayout() {
  const { pathname } = useLocation();
  const isDesktop = useIsDesktop();
  const [collapsedPref, setCollapsedPref] = useLocalStorage(STORAGE_KEYS.sidebarCollapsed, false);
  const [railOpen, setRailOpen] = useState(false); // md–lg: the full sidebar shown over the page
  const collapsed = isDesktop ? collapsedPref : !railOpen;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useHotkey('mod+k', () => setSearchOpen((o) => !o));
  const portal = usePortal();

  useEffect(() => {
    const meta = portal.routeMeta(pathname); // the role's own page names (Super Admin: Manage Clients)
    document.title = meta ? `${meta.title} · ${APP_NAME}` : APP_NAME;
    setMobileOpen(false);
    setRailOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname, portal]);

  return (
    <div className="min-h-dvh bg-page">
      <a href="#main" className="sr-only z-[100] rounded-md bg-surface px-3 py-2 text-sm font-medium shadow-pop focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} canCollapse onToggleCollapse={() => (isDesktop ? setCollapsedPref((c) => !c) : setRailOpen((o) => !o))} />
      {/* md–lg: the opened sidebar covers the page; tapping outside closes it */}
      {!isDesktop && railOpen && <div className="fixed inset-0 z-[35] hidden bg-black/20 motion-safe:animate-fade-in md:block" onClick={() => setRailOpen(false)} aria-hidden="true" />}
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className={cn('flex min-h-dvh min-w-0 flex-col transition-[padding] duration-200 ease-out max-md:pb-[calc(4.375rem+env(safe-area-inset-bottom))]', collapsed || !isDesktop ? 'md:pl-[72px]' : 'md:pl-[228px]')}>
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <main id="main" className="min-w-0 flex-1 py-3.5 sm:py-6" tabIndex={-1}>
          <ContentContainer>
            <Suspense fallback={<LoadingState fullPage />}>
              {/* Large screens: every page is at least the window's height (minus the header + page padding — the same as the
                  Settings card), so the footer always sits just below the fold. Pages can stretch into it with flex-1. */}
              <div key={pathname} className="animate-page lg:flex lg:min-h-[calc(100dvh-6.75rem)] lg:flex-col">
                <Outlet />
                {/* Toasts held for "after the next page loads" (Welcome back, Client added…) appear once this page is ready */}
                <PendingToasts />
              </div>
            </Suspense>
          </ContentContainer>
        </main>
        <Footer />
      </div>

      <BottomNav onMore={() => setMobileOpen(true)} moreOpen={mobileOpen} />
      {/* Phones: "Install LearnNext" card (the update toast is app-wide, see App.jsx) */}
      <InstallCard />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
