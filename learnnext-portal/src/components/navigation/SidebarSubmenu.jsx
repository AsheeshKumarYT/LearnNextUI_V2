import { useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { interceptLeave } from '@/utils/leaveGuard';
import { Popover } from '@/components/ui/Popover';
import { SidebarItem } from './SidebarItem';

/**
 * A nav item with `children` (e.g. Finance).
 * Expanded sidebar: collapsible group with a chevron; opens automatically when one of its pages is active.
 * Collapsed rail: the icon opens a flyout listing the sub-pages beside the rail.
 */
export function SidebarSubmenu({ item, collapsed, onNavigate }) {
  const { pathname } = useLocation();
  const childActive = item.children.some((c) => pathname === c.to || pathname.startsWith(`${c.to}/`));
  const [open, setOpen] = useState(childActive);
  const listId = useId();

  // Navigating into one of the sub-pages (e.g. via search) opens the group
  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  if (collapsed) return <CollapsedFlyout item={item} active={childActive} onNavigate={onNavigate} />;

  return (
    <li className="list-none">
      <SidebarItem
        bare
        icon={item.icon}
        label={item.label}
        active={childActive && !open}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        trailing={
          <ChevronDown
            className={cn('mr-1 size-4 shrink-0 text-text-muted transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        }
      />
      {open && (
        // Children are indented under a guide line
        <ul id={listId} className="ml-[1.35rem] mt-0.5 flex animate-fade-in flex-col gap-0.5 border-l border-border-strong pl-2">
          {item.children.map((child) => (
            <SidebarItem key={child.to} {...child} nested onClick={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

function CollapsedFlyout({ item, active, onNavigate }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <li className="list-none">
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="right-start"
        role="menu"
        className="w-56 p-1.5"
        triggerClassName="w-full"
        // The flyout shows the item's name as its heading, so the trigger needs no tooltip
        trigger={
          <button
            type="button"
            aria-label={item.label}
            className={cn(
              'group flex h-10 w-full items-center justify-center rounded-xl outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-focus',
              active ? 'bg-primary-soft text-primary-text' : 'text-text-secondary hover:bg-surface-sunken/70',
            )}
          >
            <span
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-lg',
                active ? 'bg-primary text-primary-fg shadow-[0_4px_10px_-2px_var(--ln-primary-shadow)]' : 'text-text-muted group-hover:bg-surface group-hover:text-text-secondary',
              )}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
          </button>
        }
      >
        {({ close }) => (
          <>
            <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{item.label}</p>
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              return (
                <NavLink
                  key={child.to}
                  to={child.to}
                  role="menuitem"
                  onClick={(e) => {
                    close();
                    if (interceptLeave(child.to)) e.preventDefault(); // a page with unsaved changes can step in first
                    else onNavigate?.();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-focus',
                      isActive ? 'bg-primary-soft font-semibold text-primary-text' : 'font-medium text-text-secondary hover:bg-surface-sunken hover:text-text',
                    )
                  }
                >
                  <ChildIcon className="size-4 shrink-0" aria-hidden="true" />
                  {child.label}
                </NavLink>
              );
            })}
          </>
        )}
      </Popover>
    </li>
  );
}
