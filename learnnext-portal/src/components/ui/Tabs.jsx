import { useId, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { Tooltip } from './Tooltip';

/**
 * Controlled tabs. Render panel content yourself based on `value`.
 *
 * <Tabs value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: 12, icon: List }]} />
 * variant: underline (page sections) | segmented (compact toggles, filters) | onColor (segmented, on coloured backgrounds) | vertical (settings nav)
 * Per tab, optional `tooltip` (e.g. for icon-only tabs: label={<span className="sr-only">List view</span>} tooltip="List view").
 * Use <TabPanel> for proper aria wiring if you want it.
 * semantics: 'tabs' (role=tablist/tab + aria-selected, for switching panels) |
 *            'toggle' (role=group + aria-pressed buttons, for filters/sort options with no tab panels).
 */
export function Tabs({ tabs = [], value, onChange, variant = 'underline', size = 'md', fullWidth, ariaLabel, idBase, semantics = 'tabs', className }) {
  const toggle = semantics === 'toggle';
  const autoId = useId();
  const base = idBase ?? autoId;
  const listRef = useRef(null);

  const onKeyDown = (e) => {
    const horizontal = variant !== 'vertical';
    const next = horizontal ? 'ArrowRight' : 'ArrowDown';
    const prev = horizontal ? 'ArrowLeft' : 'ArrowUp';
    if (![next, prev, 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const enabled = tabs.filter((t) => !t.disabled);
    const i = enabled.findIndex((t) => t.value === value);
    let target;
    if (e.key === next) target = enabled[(i + 1) % enabled.length];
    if (e.key === prev) target = enabled[(i - 1 + enabled.length) % enabled.length];
    if (e.key === 'Home') target = enabled[0];
    if (e.key === 'End') target = enabled.at(-1);
    onChange?.(target.value);
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-value="${target.value}"]`)?.focus());
  };

  // `indicator` = the selected-state shape, drawn once and slid between tabs (see useSlidingIndicator)
  const styles = {
    underline: {
      list: 'relative flex gap-5 border-b border-border overflow-x-auto scrollbar-none',
      tab: 'relative -mb-px flex h-10 items-center gap-2 px-0.5 text-[13px] font-medium text-text-muted hover:text-text',
      active: 'text-text',
      indicator: 'bg-primary',
    },
    segmented: {
      // Soft hairline + sunken track so the control reads clearly on frosted / tinted cards
      // Radii are concentric: track 12px − 4px padding = 8px tab corners, so the selected pill sits evenly inside
      list: 'relative inline-flex items-center gap-1 rounded-xl border border-text-muted/15 bg-surface-sunken p-1 overflow-x-auto scrollbar-none max-w-full',
      tab: cn('flex items-center justify-center gap-1.5 rounded-lg px-3 font-medium text-text-muted hover:text-text whitespace-nowrap', size === 'sm' ? 'h-7 text-xs' : 'h-8 text-[13px]'),
      active: 'text-text',
      indicator: 'rounded-lg bg-surface shadow-xs ring-1 ring-text-muted/10 dark:bg-elevated',
    },
    // Frosted variant for coloured backgrounds (e.g. gradient hero banners)
    onColor: {
      list: 'relative inline-flex items-center gap-0.5 rounded-[10px] bg-white/[0.06] p-0.5 ring-1 ring-white/10 backdrop-blur-md overflow-x-auto scrollbar-none max-w-full',
      tab: cn('flex items-center justify-center gap-1.5 rounded-lg px-3 font-medium text-white/60 hover:text-white whitespace-nowrap', size === 'sm' ? 'h-7 text-xs' : 'h-8 text-[13px]'),
      active: 'text-white',
      indicator: 'rounded-lg bg-white/15 shadow-xs ring-1 ring-white/15',
    },
    vertical: {
      list: 'flex gap-1 overflow-x-auto scrollbar-none lg:flex-col',
      tab: 'flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium text-text-secondary hover:bg-surface-sunken hover:text-text whitespace-nowrap',
      active: 'bg-surface text-text shadow-xs ring-1 ring-border dark:bg-elevated',
    },
  }[variant];

  const pos = useSlidingIndicator(listRef, styles.indicator ? value : undefined, tabs.length);
  const underline = variant === 'underline';

  return (
    <div
      ref={listRef}
      role={toggle ? 'group' : 'tablist'}
      aria-label={ariaLabel}
      aria-orientation={toggle ? undefined : variant === 'vertical' ? 'vertical' : 'horizontal'}
      onKeyDown={onKeyDown}
      className={cn(styles.list, fullWidth && 'flex w-full [&>button]:flex-1', className)}
    >
      {/* Sliding selection: one pill (or underline) that glides to the selected tab */}
      {styles.indicator && pos && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-0 top-0',
            pos.animate && 'transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
            styles.indicator,
          )}
          style={{
            width: pos.w,
            height: underline ? 2 : pos.h,
            transform: `translate(${pos.x}px, ${underline ? pos.y + pos.h - 2 : pos.y}px)`,
          }}
        />
      )}
      {tabs.map((t) => {
        const active = t.value === value;
        const Icon = t.icon;
        const button = (
          <button
            key={t.value}
            type="button"
            {...(toggle
              ? { 'aria-pressed': active }
              : {
                  role: 'tab',
                  id: `${base}-tab-${t.value}`,
                  'aria-controls': `${base}-panel-${t.value}`,
                  'aria-selected': active,
                  tabIndex: active ? 0 : -1,
                })}
            data-value={t.value}
            disabled={t.disabled}
            onClick={() => onChange?.(t.value)}
            className={cn(
              // relative: keeps the label above the sliding indicator
              'relative shrink-0 transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:opacity-50',
              styles.tab,
              active && styles.active,
            )}
          >
            {Icon && <Icon className={cn('size-4 shrink-0', active ? 'text-primary-text' : '')} aria-hidden="true" />}
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums',
                  active ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-muted',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
        return t.tooltip ? (
          <Tooltip key={t.value} content={t.tooltip}>
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </div>
  );
}

/**
 * Measures the selected tab inside `listRef` and returns its box ({ x, y, w, h, animate }) so a single indicator
 * can slide to it. The first placement doesn't animate (no slide-in from the corner on page load);
 * re-measures when the list resizes (fonts loading, responsive layout, counts changing).
 */
export function useSlidingIndicator(listRef, value, count) {
  const [pos, setPos] = useState(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || value === undefined) return undefined;
    const measure = () => {
      const el = list.querySelector(`[data-value="${CSS.escape(String(value))}"]`);
      if (!el) return setPos(null);
      // Exact (fractional) box relative to the list's padding edge — offsetTop/offsetHeight round to whole pixels,
      // which drifts the pill off-centre on scaled displays (e.g. Windows 125%)
      const L = list.getBoundingClientRect();
      const R = el.getBoundingClientRect();
      // Undo any ancestor zoom (e.g. a dialog's scale-in animation) so the pill is measured at true size
      const scale = list.offsetWidth ? L.width / list.offsetWidth || 1 : 1;
      setPos({
        x: (R.left - L.left) / scale - list.clientLeft + list.scrollLeft,
        y: (R.top - L.top) / scale - list.clientTop + list.scrollTop,
        w: R.width / scale,
        h: R.height / scale,
        animate: placed.current,
      });
      placed.current = true;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [listRef, value, count]);

  return pos;
}

export function TabPanel({ value, idBase, className, children }) {
  return (
    <div role="tabpanel" id={`${idBase}-panel-${value}`} aria-labelledby={`${idBase}-tab-${value}`} className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}

/** Compact segmented toggle — same API as Tabs, toggle-button semantics (aria-pressed) by default. */
export function SegmentedControl(props) {
  return <Tabs variant="segmented" semantics="toggle" {...props} />;
}
