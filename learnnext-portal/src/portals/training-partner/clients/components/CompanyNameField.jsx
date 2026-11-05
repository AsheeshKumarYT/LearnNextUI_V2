import { useId, useMemo, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';

const MAX = 6;

/** Highlights the typed part of a name */
function Match({ text, query }) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-transparent font-semibold text-primary-text">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/**
 * "Company name" filter with live suggestions: typing shows matching companies (logo + name + code).
 * Picking one fills the exact name; free text still works as a "contains" filter.
 * Keyboard: ↑/↓ to move, Enter to pick, Esc to close.
 */
export function CompanyNameField({ value, onChange, clients }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const blurTimer = useRef();

  const q = value.trim();
  const matches = useMemo(
    () => (q ? clients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase())).slice(0, MAX) : []),
    [clients, q],
  );
  const show = open && matches.length > 0 && !(matches.length === 1 && matches[0].name === value);

  const pick = (c) => {
    onChange(c.name);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!show) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === 'Escape') {
      e.stopPropagation(); // close the list, not the drawer
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        leftIcon={Building2}
        placeholder="Company name contains…"
        aria-label="Company name"
        role="combobox"
        aria-expanded={show}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={show ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => (blurTimer.current = setTimeout(() => setOpen(false), 120))}
        onKeyDown={onKeyDown}
      />
      {show && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Matching companies"
          className="absolute inset-x-0 top-full z-10 mt-1.5 max-h-72 animate-fade-in overflow-y-auto rounded-pop border border-border bg-elevated p-1 shadow-pop"
          onMouseDown={() => clearTimeout(blurTimer.current)}
        >
          {matches.map((c, i) => (
            <li
              key={c.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(c)}
              className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5', i === active && 'bg-surface-sunken')}
            >
              <ClientLogo client={c} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-text">
                  <Match text={c.name} query={q} />
                </span>
                <span className="block truncate text-xs text-text-muted">
                  {c.code} · {c.city}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
