import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import { interceptLeave } from '@/utils/leaveGuard';
import { usePortal } from '@/hooks/usePortal';

/**
 * App-style tab bar fixed to the bottom on phones / small tablets (below md, where the sidebar is hidden): the signed-in
 * portal's everyday pages (its `tabs` — Training Partner: Home, Clients, Facilitators, Content) + More. The active tab gets a soft pill behind its icon and the primary colour — no glow.
 * (The user tried several more creative styles and went back to this first, simple one.)
 */
export function BottomNav({ onMore, moreOpen }) {
  const { pathname } = useLocation();
  const { tabs } = usePortal();
  const inTabs = tabs.some((t) => pathname === t.to || pathname.startsWith(`${t.to}/`));
  // Tells the toast stack a tab bar is on screen (phones), so toasts sit above it — and not on pages without one
  useEffect(() => {
    document.body.dataset.tabbar = '';
    return () => delete document.body.dataset.tabbar;
  }, []);
  return (
    <nav
      aria-label="Main"
      // Frosted like the top bar (asked for: content showing through un-blurred looked messy) — 85% surface + an 18px
      // blur, a firmer top line and a long, faint upward shadow. The two bars are the only blurred things on phones (the
      // cards and page background don't blur), so scrolling stays smooth
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-strong bg-[color-mix(in_srgb,var(--ln-surface)_85%,transparent)] pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_-16px_rgb(15_23_42/0.22)] backdrop-blur-[18px] backdrop-saturate-150 md:hidden dark:bg-[color-mix(in_srgb,var(--ln-surface-secondary)_85%,transparent)]"
    >
      {/* One column per tab + More (Training Partner 4 + 1, Super Admin 1 + 1) */}
      <ul className="mx-auto grid h-[70px] max-w-lg px-1" style={{ gridTemplateColumns: `repeat(${tabs.length + 1}, minmax(0, 1fr))` }}>
        {tabs.map((t) => (
          <li key={t.to} className="flex">
            <NavLink to={t.to} onClick={(e) => interceptLeave(t.to) && e.preventDefault()} className="flex flex-1 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus">
              {({ isActive }) => <Tab icon={t.icon} label={t.label} on={isActive} />}
            </NavLink>
          </li>
        ))}
        <li className="flex">
          <button type="button" onClick={onMore} aria-haspopup="dialog" className="flex flex-1 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus">
            <Tab icon={Menu} label="More" on={moreOpen || !inTabs} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

function Tab({ icon: Icon, label, on }) {
  return (
    <span className="flex flex-1 flex-col items-center justify-center gap-1.5">
      <span className={cn('inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200', on ? 'bg-primary-soft text-primary-text' : 'text-text-muted')}>
        <Icon className="size-[22px]" strokeWidth={on ? 2.2 : 1.9} aria-hidden="true" />
      </span>
      <span className={cn('text-[12px] leading-none', on ? 'font-semibold text-primary-text' : 'font-medium text-text-secondary')}>{label}</span>
    </span>
  );
}