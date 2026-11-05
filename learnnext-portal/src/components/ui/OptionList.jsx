import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * Internal searchable listbox used by SearchableSelect, MultiSelect and TimePicker.
 * Handles filtering, arrow-key navigation and Enter to select.
 */
export function OptionList({
  options,
  isSelected,
  onSelect,
  searchable = true,
  searchPlaceholder = 'Search…',
  emptyText = 'No matches',
  multiple = false,
  footer,
  autoScrollToSelected = false,
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const mobile = useIsMobile();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    // Phones: don't focus the search box on open — that throws the keyboard up over half the sheet before the user
    // even looks at the list; they tap the search box when they want it
    if (searchable && !mobile) inputRef.current?.focus({ preventScroll: true });
    else listRef.current?.focus({ preventScroll: true });
    if (autoScrollToSelected) {
      const idx = filtered.findIndex((o) => isSelected(o.value));
      if (idx >= 0) {
        setActive(idx);
        requestAnimationFrame(() => listRef.current?.children[idx]?.scrollIntoView({ block: 'center' }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[active];
      if (opt && !opt.disabled) onSelect(opt);
    }
  };

  return (
    // Phones (bottom sheet): one scroll for the whole sheet — the search box stays pinned under the grab handle and the
    // footer pinned to the bottom, so neither scrolls out of sight (e.g. when the keyboard shrinks the sheet)
    <div className="flex max-h-[inherit] flex-col" onKeyDown={onKeyDown}>
      {searchable && (
        <div className="relative border-b border-border p-1.5 max-md:sticky max-md:top-[22px] max-md:z-10 max-md:bg-elevated">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-9 w-full rounded-md bg-transparent pl-8 pr-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:bg-surface-secondary"
          />
        </div>
      )}
      <ul
        ref={listRef}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        tabIndex={searchable ? -1 : 0}
        className="max-h-64 overflow-y-auto p-1 focus:outline-none max-md:max-h-none max-md:overflow-visible"
      >
        {filtered.map((o, i) => {
          const selected = isSelected(o.value);
          const Icon = o.icon;
          return (
            <li
              key={o.value}
              role="option"
              aria-selected={selected}
              aria-disabled={o.disabled || undefined}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => !o.disabled && onSelect(o)}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] sm:py-1.5',
                i === active && 'bg-surface-sunken',
                selected && !multiple && 'font-medium text-primary-text',
                o.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {multiple && (
                <span
                  className={cn(
                    'inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border',
                    selected ? 'border-primary bg-primary text-white' : 'border-border-strong bg-surface',
                  )}
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </span>
              )}
              {Icon && <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate">{o.label}</span>
                {o.description && <span className="block truncate text-xs font-normal text-text-muted">{o.description}</span>}
              </span>
              {!multiple && selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
        {!filtered.length && <li className="px-3 py-6 text-center text-[13px] text-text-muted">{emptyText}</li>}
      </ul>
      {footer && <div className="max-md:sticky max-md:bottom-0 max-md:z-10 max-md:bg-elevated">{footer}</div>}
    </div>
  );
}

export const normalizeOptions = (options) =>
  options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
