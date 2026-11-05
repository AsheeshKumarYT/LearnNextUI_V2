import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePortal } from '@/hooks/usePortal';
import { Logo } from '@/components/brand/Logo';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { SidebarItem } from './SidebarItem';
import { SidebarSubmenu } from './SidebarSubmenu';

/**
 * Sidebar body — shared by the desktop/tablet rail and the mobile drawer. Everything in it comes from the signed-in
 * role's portal (usePortal → src/portals/<role>/portal.js): the line under the logo, the menu (items with `children`
 * render as submenus; `devOnly` items sit apart under "Dev only") and an optional footer card (Training Partner: the
 * Support desk card).
 */
export function SidebarContent({ collapsed = false, onNavigate, onClose }) {
  const portal = usePortal();
  const devItems = portal.nav.filter((item) => item.devOnly);
  const Footer = portal.SidebarFooter;

  return (
    <div className="relative flex h-full flex-col">
      {/* Soft brand tint behind the logo area */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-soft to-transparent" aria-hidden="true" />
      {/* Logo row — same height as the page header in both states (the collapse toggle sits on the sidebar's edge) */}
      {collapsed ? (
        <div className="relative flex h-16 shrink-0 items-center justify-center px-2">
          <Logo showWordmark={false} />
        </div>
      ) : (
        <div className="relative flex h-16 shrink-0 items-center justify-between px-4">
          <Logo subtitle={portal.label} />
          {onClose && <IconButton icon={X} label="Close menu" onClick={onClose} tooltip={false} />}
        </div>
      )}

      <nav aria-label="Main" className="relative flex flex-1 flex-col overflow-y-auto px-3 pb-3 pt-1">
        <ul className="flex flex-col gap-1">
          {portal.nav.filter((item) => !item.devOnly).map((item) =>
            item.children ? (
              <SidebarSubmenu key={item.label} item={item} collapsed={collapsed} onNavigate={onNavigate} />
            ) : (
              <SidebarItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
            ),
          )}
        </ul>
        {/* Development aids (e.g. the system pages gallery): kept apart at the bottom of the menu under a quiet label,
            so they don't read as features */}
        {devItems.length > 0 && (
          <div className="mt-auto pt-4">
            {collapsed ? (
              <span className="mx-auto mb-1.5 block h-px w-6 bg-border-strong" aria-hidden="true" />
            ) : (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/80">Dev only</p>
            )}
            <ul className="flex flex-col gap-1">
              {devItems.map((item) => (
                <SidebarItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
              ))}
            </ul>
          </div>
        )}
      </nav>
      {Footer && <Footer collapsed={collapsed} onNavigate={onNavigate} />}
    </div>
  );
}
/** Fixed sidebar for md+ screens. Forced into the icon rail on tablets. */
export function Sidebar({ collapsed, onToggleCollapse, canCollapse }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden border-r border-glass-border glass-strong shadow-[1px_0_16px_-4px_rgb(var(--ln-shadow-color)/0.16)] transition-[width] duration-200 ease-out md:block',
        collapsed ? 'w-[72px]' : 'w-[228px]',
      )}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse / expand: a small round handle on the sidebar's right edge, level with the logo — same spot in both states */}
      {canCollapse && (
        <Tooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="absolute -right-3 top-5 z-10 inline-flex size-6 items-center justify-center rounded-full border border-border-strong bg-surface text-text-secondary shadow-sm transition-colors hover:border-primary/40 hover:text-primary-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus dark:bg-surface-secondary"
          >
            {collapsed ? <ChevronRight className="size-3.5" aria-hidden="true" /> : <ChevronLeft className="size-3.5" aria-hidden="true" />}
          </button>
        </Tooltip>
      )}
    </aside>
  );
}
