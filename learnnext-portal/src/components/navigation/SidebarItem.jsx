import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { interceptLeave } from '@/utils/leaveGuard';
import { Tooltip } from '@/components/ui/Tooltip';

/**
 * One nav entry. Renders a NavLink when `to` is set, otherwise a button (onClick).
 * `nested`  — smaller row for submenu children.
 * `active`  — force the active style on a button (e.g. a submenu parent whose child page is open).
 * `trailing`— node rendered at the end of the row (e.g. a chevron). Extra props (aria-*) go to the button.
 * `bare`    — skip the <li> wrapper (when the caller already renders the list item, e.g. a submenu parent).
 */
export function SidebarItem({ to, icon: Icon, label, badge, collapsed, onClick, end, nested, active: forceActive, trailing, bare, ...buttonProps }) {
  const base = cn(
    'group relative flex w-full items-center gap-2.5 rounded-xl text-sm outline-none transition-[background-color,color] duration-150',
    'focus-visible:ring-[3px] focus-visible:ring-focus',
    nested ? 'h-9' : 'h-10',
    collapsed ? 'justify-center px-0' : 'px-1.5',
  );
  // Hover: one soft tint across the whole row and darker icon + text — nothing pops or moves (a white icon tile with a
  // shadow and a label nudge looked off)
  const inactive = 'font-medium text-text-secondary hover:bg-primary-soft/55 hover:text-text';
  const active = 'bg-primary-soft font-semibold text-primary-text';

  const content = (isActive) => (
    <>
      {/* Icon tile: solid brand tile when active (nested rows use a lighter active tile); on hover only the icon darkens */}
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-lg transition-[background-color,color,box-shadow] duration-150',
          nested ? 'size-6' : 'size-7',
          isActive && !nested && 'bg-primary text-primary-fg shadow-[0_4px_10px_-2px_var(--ln-primary-shadow)]',
          isActive && nested && 'text-primary-text',
          !isActive && 'text-text-muted group-hover:text-primary-text',
        )}
      >
        {/* Even sizes in even tiles (18 in 28, 16 in 24) so the icon centres on whole pixels */}
        <Icon className={nested ? 'size-4' : 'size-[18px]'} aria-hidden="true" />
      </span>
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {badge > 0 &&
        (collapsed ? (
          <span className="absolute right-2 top-1.5 size-2 rounded-full bg-primary ring-2 ring-sidebar" aria-label={`${badge} new`} />
        ) : (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-danger-soft px-1.5 text-xs font-bold tabular-nums text-danger">{badge}</span>
        ))}
      {!collapsed && trailing}
    </>
  );

  const el = to ? (
    <NavLink
      to={to}
      end={end}
      // A page with unsaved changes can step in first (leaveGuard)
      onClick={(e) => (interceptLeave(to) ? e.preventDefault() : onClick?.(e))}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) => cn(base, isActive ? active : inactive)}
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  ) : (
    <button type="button" onClick={onClick} aria-label={collapsed ? label : undefined} className={cn(base, forceActive ? active : inactive)} {...buttonProps}>
      {content(Boolean(forceActive))}
    </button>
  );

  const item = (
    <Tooltip content={label} side="right" disabled={!collapsed} delay={80}>
      {el}
    </Tooltip>
  );
  return bare ? item : <li className="list-none">{item}</li>;
}
