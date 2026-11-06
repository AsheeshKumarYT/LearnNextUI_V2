import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, isSameDay, startOfDay, startOfWeek } from '@/utils/formatDate';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Month calendar used by DatePicker / DateRangePicker (can be used inline too).
 * mode="single": value = Date, onSelect(date)
 * mode="range":  value = { from, to }, onSelect({ from, to })
 * pickMonthYear: month + year dropdowns in the header instead of the plain title (for far-off dates such as a date of
 *   birth); years run between minDate and maxDate. With nothing picked, the calendar opens on today, or on the nearest
 *   allowed month when today is outside minDate / maxDate.
 */
export function Calendar({ mode = 'single', value, onSelect, minDate, maxDate, pickMonthYear, className }) {
  const anchor = mode === 'range' ? value?.from : value;
  const start = () => {
    if (anchor) return new Date(anchor);
    const now = new Date();
    if (maxDate && now > maxDate) return new Date(maxDate);
    if (minDate && now < minDate) return new Date(minDate);
    return now;
  };
  const [month, setMonth] = useState(() => {
    const d = start();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [focused, setFocused] = useState(() => startOfDay(start()));
  const [hover, setHover] = useState(null);
  const gridRef = useRef(null);
  const keyboardNav = useRef(false);

  useEffect(() => {
    if (!keyboardNav.current) return;
    gridRef.current?.querySelector(`[data-date="${focused.toDateString()}"]`)?.focus();
  }, [focused]);

  const gridStart = startOfWeek(month);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const today = new Date();

  const disabled = (d) => (minDate && d < startOfDay(minDate)) || (maxDate && d > startOfDay(maxDate));

  const select = (d) => {
    if (disabled(d)) return;
    if (mode === 'single') return onSelect?.(d);
    const { from, to } = value || {};
    if (!from || (from && to)) onSelect?.({ from: d, to: null });
    else if (d < from) onSelect?.({ from: d, to: from });
    else onSelect?.({ from, to: d });
  };

  const inRange = (d) => {
    if (mode !== 'range' || !value?.from) return false;
    const end = value.to || hover;
    if (!end) return false;
    const [a, b] = value.from <= end ? [value.from, end] : [end, value.from];
    return d > startOfDay(a) && d < startOfDay(b);
  };

  const isSelected = (d) =>
    mode === 'single' ? isSameDay(d, value) : isSameDay(d, value?.from) || isSameDay(d, value?.to);

  const moveFocus = (n) => {
    keyboardNav.current = true;
    const next = addDays(focused, n);
    setFocused(next);
    if (next.getMonth() !== month.getMonth()) setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const onKeyDown = (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (map[e.key]) {
      e.preventDefault();
      moveFocus(map[e.key]);
    }
  };

  const shiftMonth = (n) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  return (
    <div className={cn('w-[17.5rem] p-3', className)}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="inline-flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface-sunken hover:text-text">
          <ChevronLeft className="size-4" />
        </button>
        {pickMonthYear ? (
          <div className="flex items-center gap-1">
            <HeaderSelect label="Month" value={month.getMonth()} onChange={(m) => setMonth(new Date(month.getFullYear(), m, 1))} options={MONTHS.map((name, i) => ({ value: i, label: name }))} />
            <HeaderSelect label="Year" value={month.getFullYear()} onChange={(y) => setMonth(new Date(y, month.getMonth(), 1))} options={yearOptions(minDate, maxDate, month.getFullYear())} />
          </div>
        ) : (
          <div className="text-[13px] font-semibold text-text" aria-live="polite">
            {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        )}
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="inline-flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface-sunken hover:text-text">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1.5">
            {w}
          </div>
        ))}
      </div>
      <div ref={gridRef} role="grid" className="grid grid-cols-7 gap-y-0.5" onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
        {days.map((d) => {
          const outside = d.getMonth() !== month.getMonth();
          const sel = isSelected(d);
          const range = inRange(d);
          return (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              data-date={d.toDateString()}
              tabIndex={isSameDay(d, focused) ? 0 : -1}
              aria-selected={sel}
              aria-label={d.toDateString()}
              disabled={disabled(d)}
              onClick={() => {
                setFocused(d);
                select(d);
              }}
              onMouseEnter={() => setHover(d)}
              className={cn(
                'relative mx-auto inline-flex size-9 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-30',
                outside ? 'text-text-muted/60' : 'text-text',
                !sel && !range && 'hover:bg-surface-sunken',
                range && 'w-full rounded-none bg-primary-soft text-primary-text',
                sel && 'bg-primary font-semibold text-primary-fg hover:bg-primary-hover',
              )}
            >
              {d.getDate()}
              {isSameDay(d, today) && !sel && <span className="absolute bottom-1 size-1 rounded-full bg-primary" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Years for the header dropdown: newest first, from maxDate (or this year + 10) back to minDate (or 100 years ago) */
function yearOptions(minDate, maxDate, current) {
  const now = new Date().getFullYear();
  const top = Math.max(maxDate ? maxDate.getFullYear() : now + 10, current);
  const bottom = Math.min(minDate ? minDate.getFullYear() : now - 100, current);
  return Array.from({ length: top - bottom + 1 }, (_, i) => ({ value: top - i, label: String(top - i) }));
}

/** A compact native dropdown for the calendar header (month / year) */
function HeaderSelect({ label, value, onChange, options }) {
  return (
    <span className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 cursor-pointer appearance-none rounded-md border border-border bg-surface py-0 pl-2.5 pr-7 text-[13px] font-semibold text-text hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </span>
  );
}
