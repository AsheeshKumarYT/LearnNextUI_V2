import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, isSameDay, startOfDay, startOfWeek } from '@/utils/formatDate';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Month calendar used by DatePicker / DateRangePicker (can be used inline too).
 * mode="single": value = Date, onSelect(date)
 * mode="range":  value = { from, to }, onSelect({ from, to })
 */
export function Calendar({ mode = 'single', value, onSelect, minDate, maxDate, className }) {
  const anchor = mode === 'range' ? value?.from : value;
  const [month, setMonth] = useState(() => {
    const d = anchor ? new Date(anchor) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [focused, setFocused] = useState(() => startOfDay(anchor || new Date()));
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
        <div className="text-[13px] font-semibold text-text" aria-live="polite">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
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
