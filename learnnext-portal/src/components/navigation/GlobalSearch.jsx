import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CornerDownLeft, LayoutGrid, Library, LifeBuoy, Search, SearchX, Settings2, Users, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { interceptLeave } from '@/utils/leaveGuard';
import { searchAll } from '@/services/api';
import { usePortal } from '@/hooks/usePortal';
import { useDebounce } from '@/hooks/useDebounce';
import { Overlay } from '@/components/ui/Overlay';
import { Kbd } from '@/components/ui/Kbd';
import { Spinner } from '@/components/ui/Spinner';

// One icon per search source (the `icon` key each source in services/api.js names)
const GROUP_ICONS = { pages: LayoutGrid, clients: Building2, programs: Library, facilitators: Users, tickets: LifeBuoy, masters: Settings2 };

/**
 * ⌘K / Ctrl+K command palette. What it searches comes from the signed-in portal (its `searchSources` and `links`,
 * src/portals/<role>/portal.js); services/searchApi.js does the matching;
 * add a source there and it appears here automatically.
 */
export function GlobalSearch({ open, onClose }) {
  const portal = usePortal();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const debounced = useDebounce(query, 150);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setGroups([]);
    }
  }, [open]);

  useEffect(() => {
    let alive = true;
    if (!debounced.trim()) {
      setGroups([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    searchAll(debounced, { sources: portal.searchSources }).then((g) => {
      if (alive) {
        setGroups(g);
        setLoading(false);
        setActive(0);
      }
    });
    return () => {
      alive = false;
    };
  }, [debounced, portal.searchSources]);

  // Flat list of selectable entries for keyboard navigation
  const entries = useMemo(() => {
    // Only what the signed-in role may open (Super Admin: its own menu, and clients)
    if (!query.trim()) return portal.links.map((p) => ({ id: p.to, title: p.label, to: p.to, icon: p.icon, group: 'Jump to' }));
    return groups
      .flatMap((g) => g.results.map((r) => ({ ...r, icon: GROUP_ICONS[g.icon], group: g.label, more: g.total - g.results.length })))
      .filter((e) => portal.can(e.to));
  }, [query, groups, portal]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (entry) => {
    if (!entry) return;
    onClose();
    if (!interceptLeave(entry.to)) navigate(entry.to); // a page with unsaved changes can step in first
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, entries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(entries[active]);
    }
  };

  let lastGroup = null;
  const noResults = query.trim() && !loading && debounced === query && entries.length === 0;

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy="global-search-label"
      containerClassName="items-start justify-center px-3 pt-[8vh] sm:px-6 sm:pt-[12vh]"
      panelClassName="w-full max-w-xl overflow-hidden rounded-2xl border border-border"
      enterClassName="animate-scale-in"
      exitClassName="opacity-0 scale-[0.98]"
    >
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-[18px] shrink-0 text-text-muted" aria-hidden="true" />
          <label id="global-search-label" htmlFor="global-search-input" className="sr-only">
            Search LearnNext
          </label>
          <input
            id="global-search-input"
            data-autofocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search clients, programs, facilitators, tickets, settings…"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            aria-activedescendant={entries[active] ? `gs-${active}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-text placeholder:text-text-muted focus:outline-none"
          />
          {loading ? (
            <Spinner size="sm" className="text-text-muted" />
          ) : query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="inline-flex size-7 items-center justify-center rounded-md text-text-muted hover:bg-surface-sunken hover:text-text">
              <X className="size-4" />
            </button>
          ) : (
            <Kbd className="hidden sm:inline-flex">Esc</Kbd>
          )}
        </div>

        <div ref={listRef} id="global-search-results" role="listbox" className="max-h-[min(420px,60dvh)] overflow-y-auto p-2">
          {noResults ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <SearchX className="mb-3 size-6 text-text-muted" aria-hidden="true" />
              <p className="text-sm font-medium text-text">No results for “{query}”</p>
              <p className="mt-1 text-[13px] text-text-muted">Try a client or program name, a person’s name or email, a ticket number or a setting.</p>
            </div>
          ) : (
            entries.map((entry, i) => {
              const showHeader = entry.group !== lastGroup;
              lastGroup = entry.group;
              const Icon = entry.icon;
              return (
                <div key={`${entry.group}-${entry.id}`}>
                  {showHeader && (
                    <p className="flex items-baseline gap-2 px-2.5 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                      {entry.group}
                      {entry.more > 0 && <span className="font-medium normal-case tracking-normal text-text-muted/80">+{entry.more} more — keep typing to narrow</span>}
                    </p>
                  )}
                  <div
                    id={`gs-${i}`}
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(entry)}
                    className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2', i === active && 'bg-surface-sunken')}
                  >
                    <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border', i === active ? 'bg-surface text-primary-text' : 'bg-surface-secondary text-text-muted')}>
                      {Icon && <Icon className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-text">{entry.title}</span>
                      {entry.subtitle && <span className="block truncate text-xs text-text-muted">{entry.subtitle}</span>}
                    </span>
                    {i === active && <ArrowRight className="size-4 text-text-muted" aria-hidden="true" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-border bg-surface-secondary/60 px-4 py-2.5 text-xs text-text-muted sm:flex">
          <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="flex items-center gap-1.5"><Kbd><CornerDownLeft className="size-3" /></Kbd> open</span>
          <span className="flex items-center gap-1.5"><Kbd>Esc</Kbd> close</span>
        </div>
      </div>
    </Overlay>
  );
}
