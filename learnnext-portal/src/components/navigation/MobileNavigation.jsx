import { Link, NavLink } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePortal } from '@/hooks/usePortal';
import { interceptLeave } from '@/utils/leaveGuard';
import { useAuth } from '@/hooks/useAuth';
import { Overlay } from '@/components/ui/Overlay';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';

/**
 * "More" for screens below md — an app launcher in a bottom sheet rising from the tab bar (picked from previews: "App
 * launcher"). Grab handle and rounded top; you at the top (avatar, name, role, View profile); then the other modules as
 * neutral icon tiles with their names and no boxes around them, like a phone's home screen; Finance's six pages as
 * their own group. The Dev only pages (System pages) are left out on phones. Closes on a pick, ×, Esc, the backdrop or a
 * page change. Everything comes from the signed-in role's portal (usePortal): its menu minus what's already in the tab
 * bar, plus its own extra tiles (Training Partner: Support with the waiting count).
 */
export function MobileNavigation({ open, onClose }) {
  const { user } = useAuth();
  const portal = usePortal();
  // Already one tap away in the bottom tab bar, so not repeated in the sheet
  const inTabBar = portal.tabs.map((t) => t.to);
  const modules = portal.nav.filter((i) => !i.children && !i.devOnly && !inTabBar.includes(i.to));
  const extras = portal.useMoreItems(); // the portal's own tiles (a role can't change while this is open)
  const items = [...modules, ...extras];
  const finance = portal.nav.find((i) => i.children);
  // The sheet closes either way; with unsaved work the page's own leave dialog takes over
  const go = (to) => (e) => {
    if (interceptLeave(to)) e.preventDefault();
    onClose();
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy="more-sheet-title"
      containerClassName="items-end justify-center"
      panelClassName="max-h-[85dvh] w-full overflow-hidden rounded-t-3xl border border-b-0 border-border bg-elevated"
      enterClassName="animate-slide-in-bottom"
      exitClassName="translate-y-full"
    >
      <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
      <h2 id="more-sheet-title" className="sr-only">
        More
      </h2>

      {/* You */}
      <div className="mx-5 flex items-center gap-3 border-b border-dashed border-border-strong pb-4 pt-3">
        <Avatar name={user?.name} src={user?.avatar} size="md" />
        <Link to="/profile" onClick={go('/profile')} className="group min-w-0 flex-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <p className="truncate text-[15px] font-semibold text-text">{user?.name}</p>
          <p className="flex items-center gap-1 text-xs text-text-secondary">
            {portal.label}
            <span className="text-text-muted" aria-hidden="true">
              ·
            </span>
            <span className="font-medium text-primary-text">View profile</span>
            <ChevronRight className="size-3.5 text-primary-text transition-transform group-active:translate-x-0.5" aria-hidden="true" />
          </p>
        </Link>
        <IconButton icon={X} label="Close menu" onClick={onClose} tooltip={false} className="-mr-2 self-start" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        {/* When everything is in the tab bar already (Super Admin), the sheet just holds you (profile) */}
        {items.length > 0 && <Launcher items={items} onPick={go} />}

        {finance && (
          <>
            <GroupLabel>{finance.label}</GroupLabel>
            <Launcher items={finance.children} onPick={go} />
          </>
        )}
      </div>
    </Overlay>
  );
}

function GroupLabel({ children }) {
  return <p className="mb-2 mt-5 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">{children}</p>;
}

/**
 * Home-screen grid: a neutral grey tile with the icon and the name under it — no box around each item. Uncoloured on
 * purpose (per-module colours were asked away); only the page you're on is tinted blue.
 */
function Launcher({ items, onPick }) {
  return (
    <ul className="grid grid-cols-3 gap-x-1 gap-y-4">
      {items.map(({ to, label, icon: Icon, note }) => {
        return (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onPick(to)}
              className="group flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex size-[52px] items-center justify-center rounded-2xl transition-transform duration-150 group-active:scale-95',
                      // The page you're on: a clearly-there but calm blue tile — a firmer tint, a thin blue edge and a blue
                      // icon (the faint tint was barely visible; a solid blue tile was too vibrant)
                      isActive
                        ? 'bg-primary/[0.14] text-primary-text ring-1 ring-inset ring-primary/35'
                        : 'bg-surface-sunken text-text-secondary dark:bg-surface-secondary',
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className={cn('text-[12px] leading-tight', isActive ? 'font-semibold text-primary-text' : 'font-medium text-text')}>{label}</span>
                  {note && <span className="-mt-1 text-[11px] leading-tight text-text-muted">{note}</span>}
                </>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
