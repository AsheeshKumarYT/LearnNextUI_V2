import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Input } from './Input';

/** Width of an element, kept up to date as it resizes (0 until measured) */
function useElementWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/**
 * The toolbar of a list page (All Clients, Settings masters): summary pills + search, Filters, extra actions and Add,
 * then — only while searching / filtering — the result count with removable chips. The layout follows the room the
 * toolbar has (not the screen — the sidebar changes it), so it never wraps awkwardly:
 *   wide     everything on one row
 *   compact  one row; search becomes an icon that slides a search field in over the pills
 *   stacked  phones: no pills (the filter drawer's Status filter covers them); search + icon-only Filters / Add on one line.
 *
 * renderSummary(className) — the pills (e.g. <StatPills className={className} />); className keeps them on one line.
 * summaryOnPhones — keep the pills on phones too (one sideways-scrolling line above search), for pages with no
 * Filters drawer, where the pills are the only filter.
 * onOpenFilters / onAdd are optional (no Filters button / no Add when left out).
 * chips = [{ key, label, onRemove }]; result = { shown, total, noun } ("3 of 30 clients"); actions = extra icon buttons
 * (after Filters); leadingActions = controls between search and Filters (e.g. a Table / Cards view switch).
 */
export function ListToolbar({
  renderSummary,
  summaryOnPhones = false,
  search,
  onSearch,
  searchPlaceholder = 'Search…',
  searchLabel = 'Search',
  filterCount = 0,
  onOpenFilters,
  leadingActions,
  actions,
  addLabel,
  onAdd,
  filtered,
  result,
  chips = [],
  onClearAll,
}) {
  const barRef = useRef(null);
  const barWidth = useElementWidth(barRef);
  const layout = barWidth >= 1080 ? 'wide' : barWidth >= 600 ? 'compact' : 'stacked';
  const searchRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const compactSearch = layout === 'compact' && (searchOpen || search !== '');
  // Opening the compact search focuses the field
  useEffect(() => {
    if (compactSearch) searchRef.current?.focus();
  }, [compactSearch]);

  // Phones (stacked): no pills at all — the filter drawer's Status filter covers them (they were shown in the drawer
  // under "Overview" before; dropped as a repeat)
  const stacked = layout === 'stacked';
  const openFilters = () => onOpenFilters?.();
  const showFilters = Boolean(onOpenFilters);
  // Search field: always shown when wide / stacked; in the compact layout it slides in over the pills
  const closeSearch = () => {
    onSearch('');
    setSearchOpen(false);
  };
  const searchField = (
    <Input
      ref={searchRef}
      type="search"
      leftIcon={Search}
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      onKeyDown={(e) => layout === 'compact' && e.key === 'Escape' && closeSearch()}
      onBlur={() => layout === 'compact' && !search && setSearchOpen(false)}
      placeholder={searchPlaceholder}
      aria-label={searchLabel}
      className={cn('min-w-0', layout === 'wide' ? 'w-60 shrink-0' : 'flex-1')}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <div ref={barRef} className={cn('flex gap-3', layout === 'stacked' ? 'flex-col' : 'items-center')}>
        {compactSearch ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 motion-safe:animate-fade-in">
            {searchField}
            <IconButton icon={X} label="Close search" onMouseDown={(e) => e.preventDefault()} onClick={closeSearch} />
          </div>
        ) : stacked && renderSummary && !summaryOnPhones ? null : (
          // One line (the vertical padding keeps the pills' rings from being clipped). Compact / phones: it scrolls
          // sideways when tight, its right edge fading out as a "more →" cue (the end padding means nothing is faded
          // when everything fits). Wide has room for all of it, so no fade there.
          renderSummary(
            cn(
              '-my-1 flex-nowrap overflow-x-auto py-1 pl-0.5 scrollbar-none',
              layout === 'wide' ? 'pr-0.5' : 'pr-6 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)]',
              layout !== 'stacked' && 'min-w-0 flex-1 sm:w-auto',
            ),
          )
        )}
        {/* ml-auto keeps the controls on the right even while the pills are still a loading placeholder */}
        <div className={cn('ml-auto flex shrink-0 items-center gap-2', layout === 'stacked' && 'w-full')}>
          {layout !== 'compact' && searchField}
          {layout === 'compact' && !compactSearch && <IconButton icon={Search} label={searchLabel} variant="secondary" onClick={() => setSearchOpen(true)} />}
          {leadingActions}
          {/* Filters only when the page has a drawer */}
          {!showFilters ? null : layout === 'stacked' ? (
            // Phones: icon only (more room for search), the active-filter count as a small corner badge
            <IconButton icon={SlidersHorizontal} label={filterCount ? `Filters (${filterCount} applied)` : 'Filters'} variant="secondary" onClick={openFilters} aria-haspopup="dialog">
              {filterCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-fg"
                  aria-hidden="true"
                >
                  {filterCount}
                </span>
              )}
            </IconButton>
          ) : (
            <Button variant="secondary" leftIcon={SlidersHorizontal} onClick={openFilters} aria-haspopup="dialog" className="shrink-0">
              Filters
              {filterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold tabular-nums text-primary-fg">{filterCount}</span>
              )}
            </Button>
          )}
          {actions}
          {onAdd &&
            (layout === 'stacked' ? (
              <IconButton icon={Plus} label={addLabel} variant="primary" onClick={onAdd} />
            ) : (
              <>
                <span className="mx-1 h-6 w-px bg-border-strong" aria-hidden="true" />
                <Button leftIcon={Plus} onClick={onAdd} className="shrink-0">
                  {addLabel}
                </Button>
              </>
            ))}
        </div>
      </div>

      {/* Only while searching / filtering: result count + removable chips (the total is already in the summary) */}
      {filtered && result && (
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <p className="mr-1 text-text-muted" aria-live="polite">
            <span className="font-semibold tabular-nums text-text">{result.shown}</span> of {result.total} {result.noun}
          </p>
          {chips.map((chip) => (
            <span key={chip.key} className="inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-primary-soft pl-2.5 pr-1 text-xs font-medium text-primary-text">
              <span className="truncate">{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove filter ${chip.label}`}
                className="inline-flex size-5 items-center justify-center rounded-full hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="rounded px-1 text-xs font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Clear all
          </button>
        </div>
      )}

    </div>
  );
}
