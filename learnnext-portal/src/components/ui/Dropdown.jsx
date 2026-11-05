import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Popover } from './Popover';

/**
 * Accessible action menu (also used for row "⋯" menus / context menus).
 *
 * <Dropdown
 *   trigger={<IconButton icon={MoreHorizontal} label="Actions" />}
 *   items={[
 *     { label: 'Edit', icon: Pencil, onSelect: () => … },
 *     { type: 'separator' },
 *     { label: 'Delete', icon: Trash2, danger: true, onSelect: () => … },
 *   ]}
 * />
 * Item fields: label, icon, onSelect, danger, disabled, checked, shortcut, description.
 * Item types: 'separator' | 'label'. Optional `header` / `footer` nodes render above/below the items.
 */
// `triggerClassName` styles the wrapper around the trigger (e.g. "w-full" so a block trigger fills its slot)
export function Dropdown({ trigger, items = [], placement = 'bottom-end', className, triggerClassName, header, footer }) {
  const onKeyDown = (e) => {
    const nodes = [...e.currentTarget.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')];
    const i = nodes.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nodes[(i + 1) % nodes.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nodes[(i - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      nodes[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      nodes.at(-1)?.focus();
    }
  };

  return (
    <Popover
      trigger={trigger}
      triggerClassName={triggerClassName}
      placement={placement}
      role="menu"
      className={cn('min-w-48 p-1', className)}
      panelProps={{
        onKeyDown,
        tabIndex: -1,
      }}
    >
      {({ close }) => (
        <MenuFocus>
          {header}
          {items.map((item, idx) => {
            if (item.type === 'separator') return <div key={idx} role="separator" className="my-1 h-px bg-border" />;
            if (item.type === 'label')
              return (
                <div key={idx} className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {item.label}
                </div>
              );
            const Icon = item.icon;
            return (
              <button
                key={item.key ?? item.label}
                type="button"
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                onClick={() => {
                  if (item.disabled) return;
                  close();
                  item.onSelect?.();
                }}
                className={cn(
                  // Phones (bottom sheet): a touch roomier for thumbs, but the app's own text size (15px rows read oversized)
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] outline-none transition-colors max-sm:gap-3 max-sm:rounded-lg max-sm:px-3 max-sm:py-2.5 max-sm:text-sm sm:py-1.5',
                  'focus-visible:bg-surface-sunken hover:bg-surface-sunken',
                  item.danger ? 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft' : 'text-text',
                  item.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {Icon && <Icon className={cn('size-4 shrink-0 max-sm:size-[18px]', item.danger ? '' : 'text-text-muted')} aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{item.label}</span>
                  {item.description && <span className="block truncate text-xs text-text-muted">{item.description}</span>}
                </span>
                {item.checked && <Check className="size-4 text-primary-text" aria-hidden="true" />}
                {item.shortcut && <span className="text-xs text-text-muted">{item.shortcut}</span>}
                {item.submenu && <ChevronRight className="size-4 text-text-muted" />}
              </button>
            );
          })}
          {footer}
        </MenuFocus>
      )}
    </Popover>
  );
}

/** Focuses the first menu item when the menu opens (keyboard friendliness). */
function MenuFocus({ children }) {
  return (
    <div
      ref={(el) => {
        if (el && !el.dataset.focused) {
          el.dataset.focused = '1';
          requestAnimationFrame(() => el.querySelector('[role="menuitem"]')?.focus({ preventScroll: true }));
        }
      }}
    >
      {children}
    </div>
  );
}
