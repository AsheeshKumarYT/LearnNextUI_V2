import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';
import { isMac } from '@/hooks/useHotkey';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { IconButton } from '@/components/ui/IconButton';
import { Kbd } from '@/components/ui/Kbd';
import { LogoMark } from '@/components/brand/Logo';
import { NotificationMenu } from './NotificationMenu';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { interceptLeave } from '@/utils/leaveGuard';
import { usePortal } from '@/hooks/usePortal';

/**
 * Sticky top bar: breadcrumbs (the page name — pages have no title block of their own), search, notifications, theme, user.
 * Small screens open the full menu from the bottom tab bar's More (BottomNav), so there's no hamburger here.
 * It slides up out of the way while you scroll down the page, and slides back as soon as you scroll up (always shown near the top).
 */
export function Header({ onOpenSearch }) {
  const { pathname } = useLocation();
  // The signed-in portal's own page names (Super Admin: Manage Clients) and whether it has notifications
  const portal = usePortal();
  const meta = portal.routeMeta(pathname);
  const hidden = useHideOnScrollDown();
  // "Finance › All Invoices" for submenu pages, just the page name for top-level ones
  const crumbs = meta
    ? [...(meta.section ? [{ label: meta.section, to: meta.sectionTo }] : []), { label: meta.title, to: pathname }]
    : [{ label: 'LearnNext' }];

  return (
    <header
      className={cn(
        // Phones: a firmer bottom line so the bar reads as separate from the page (the near-white glass edge vanished)
        'sticky top-0 z-30 border-b border-glass-border glass-strong transition-transform duration-300 ease-out max-md:border-border-strong motion-reduce:transition-none',
        hidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
                <LogoMark className="size-7 md:hidden" />
        <Breadcrumbs items={crumbs} onLinkClick={(e, to) => interceptLeave(to) && e.preventDefault()} className="hidden min-w-0 flex-1 sm:block" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-text sm:hidden">{meta?.title}</span>

        <button
          type="button"
          onClick={onOpenSearch}
          className="group hidden h-9 w-56 items-center gap-2 rounded-control border border-border bg-surface px-3 text-[13px] text-text-muted shadow-xs transition-colors hover:border-border-strong hover:text-text-secondary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus md:flex lg:w-72"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search…</span>
          <span className="flex gap-0.5">
            <Kbd>{isMac() ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <IconButton icon={Search} label="Search" onClick={onOpenSearch} className="md:hidden" tooltip={false} />
          {portal.notifications && <NotificationMenu />}
          {/* Phones: the theme lives in the user menu only */}
          <span className="contents max-sm:hidden">
            <ThemeToggle />
          </span>
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

/**
 * true while the page is being scrolled down (past the header's own height); false again on any scroll up or near
 * the top. Small jitters (< 6px) are ignored so it doesn't flicker.
 */
function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y - last > 6) setHidden(true);
      else if (last - y > 6) setHidden(false);
      else return; // tiny move: keep the reference point until it adds up
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Tell the rest of the page: sticky panels and pinned table headings follow --app-header-h (index.css) in CSS; the
  // JS bits that care whether something is pinned re-check now and once the slide has finished
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', hidden);
    // Re-check now (pinned-or-not uses where the header is heading) and once more after the slide has settled
    window.dispatchEvent(new Event('scroll'));
    const t = setTimeout(() => window.dispatchEvent(new Event('scroll')), 320);
    return () => clearTimeout(t);
  }, [hidden]);
  return hidden;
}
