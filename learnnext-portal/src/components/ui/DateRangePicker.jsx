import { useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, formatDate, startOfDay } from '@/utils/formatDate';
import { Popover } from './Popover';
import { Calendar } from './Calendar';
import { SelectTrigger } from './SelectTrigger';
import { Button } from './Button';

export const DATE_PRESETS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
  { key: '365d', label: 'Last 12 months', days: 365 },
];

export const rangeFromPreset = (days) => ({ from: addDays(startOfDay(new Date()), -(days - 1)), to: startOfDay(new Date()) });

/**
 * <DateRangePicker value={{ from, to }} onChange={setRange} />
 * Includes quick presets on wider screens.
 */
export function DateRangePicker({ value, onChange, placeholder = 'Select dates', presets = DATE_PRESETS, align = 'start', className }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const sameYear = value?.from && value?.to && value.from.getFullYear() === value.to.getFullYear();
  const label = value?.from
    ? `${formatDate(value.from, sameYear ? { year: undefined } : {})} – ${value.to ? formatDate(value.to) : '…'}`
    : null;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setDraft(value);
      }}
      placement={`bottom-${align}`}
      triggerClassName={className ?? 'w-full'}
      trigger={
        <SelectTrigger icon={CalendarRange} placeholder={placeholder}>
          {label && <span className="truncate">{label}</span>}
        </SelectTrigger>
      }
    >
      <div className="flex flex-col sm:flex-row">
        {presets?.length > 0 && (
          <div className="flex gap-1 overflow-x-auto border-b border-border p-2 sm:w-36 sm:flex-col sm:border-b-0 sm:border-r">
            {presets.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  onChange?.(rangeFromPreset(p.days));
                  setOpen(false);
                }}
                className={cn('shrink-0 rounded-md px-2.5 py-1.5 text-left text-[13px] text-text-secondary hover:bg-surface-sunken hover:text-text')}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
        <div>
          <Calendar mode="range" value={draft} onSelect={setDraft} />
          <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!draft?.from || !draft?.to}
              onClick={() => {
                onChange?.(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  );
}
