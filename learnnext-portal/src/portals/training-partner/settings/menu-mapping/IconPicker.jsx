import { useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Popover } from '@/components/ui/Popover';
import { SelectTrigger } from '@/components/ui/SelectTrigger';
import { ICON_OPTIONS, menuIcon } from './menuIcons';

/**
 * Icon field: looks like a select (the chosen icon + its name). Opens a panel with a search box over a grid of ~150
 * icons — search matches names and everyday words ("money", "people", "report"…). Picking one closes the panel.
 */
export function IconPicker({ value, onChange, invalid }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return words.length ? ICON_OPTIONS.filter((o) => words.every((w) => o.words.includes(w))) : ICON_OPTIONS;
  }, [q]);
  const selected = ICON_OPTIONS.find((o) => o.name === value);
  const Current = menuIcon(value);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQ('');
      }}
      placement="bottom-start"
      className="w-[22rem] p-0"
      triggerClassName="w-full"
      // The app's select trigger (same height, border and error state as the other fields), with the chosen icon in it
      trigger={
        <SelectTrigger invalid={invalid} placeholder="Choose an icon">
          {selected && (
            <span className="flex min-w-0 items-center gap-2">
              <span className="-ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary-text">
                <Current className="size-3.5" aria-hidden="true" />
              </span>
              <span className="truncate">{selected.label}</span>
            </span>
          )}
        </SelectTrigger>
      }
    >
      <div className="border-b border-border p-2">
        <label className="flex h-9 items-center gap-2 rounded-lg bg-surface-sunken px-2.5 text-sm focus-within:ring-[3px] focus-within:ring-focus">
          <Search className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons — e.g. money, people, report"
            aria-label="Search icons"
            className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-text-muted"
          />
        </label>
      </div>
      {shown.length ? (
        <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto p-2" role="radiogroup" aria-label="Icons">
          {shown.map(({ name, Icon, label }) => {
            const on = name === value;
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={label}
                title={label}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setQ('');
                }}
                className={cn(
                  'inline-flex aspect-square items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
                  on ? 'bg-primary-soft text-primary-text ring-1 ring-primary/40' : 'text-text-secondary hover:bg-surface-sunken hover:text-text',
                )}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : (
        <p className="flex flex-col items-center gap-1.5 px-4 py-8 text-center text-[13px] text-text-muted">
          <SearchX className="size-5" aria-hidden="true" />
          No icons match “{q.trim()}”
        </p>
      )}
      <p className="border-t border-border px-3 py-1.5 text-[11px] text-text-muted">{shown.length} icons</p>
    </Popover>
  );
}
