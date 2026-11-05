import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/utils/cn';
import { compareValues } from '@/utils/helpers';
import { formatDate } from '@/utils/formatDate';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { DataTable, Pagination } from '@/components/ui';
import { ErrorState, Skeleton } from '@/components/feedback';

const GRID_PAGE = 12;

/**
 * A list page's body, the same way All Clients does it: the DataTable from tablet up, and on phones a grid of cards
 * (a table's columns are too cramped there) with its own pagination.
 * Table props pass straight through; `renderCard(row)` returns a <GridCard> for one row.
 * `cards` shows the card grid at every size (a page's Table / Cards switch); `gridClassName` adds columns for wide screens.
 */
export function ResponsiveList({ data, loading, error, onRetry, emptyState, renderCard, rowKey = (r) => r.id, cards = false, gridClassName, ...tableProps }) {
  const mobile = useIsMobile();
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [data.length]);

  // The cards follow the table's order: its default sort (column accessor, as DataTable sorts), so phone and desktop
  // list the same people in the same order
  const { defaultSort, columns } = tableProps;
  const ordered = useMemo(() => {
    const col = defaultSort && columns?.find((c) => c.key === defaultSort.key);
    if (!col) return data;
    const get = col.accessor ?? ((r) => r[col.key]);
    const out = [...data].sort((a, b) => compareValues(get(a), get(b)));
    return defaultSort.direction === 'desc' ? out.reverse() : out;
  }, [data, defaultSort, columns]);

  if (!mobile && !cards) return <DataTable data={data} loading={loading} error={error} onRetry={onRetry} emptyState={emptyState} {...tableProps} />;
  if (error) return <ErrorState compact title="Couldn’t load the list" description={error.message} onRetry={onRetry} />;
  if (!loading && data.length === 0) return emptyState;

  const pageCount = Math.max(1, Math.ceil(data.length / GRID_PAGE));
  const rows = ordered.slice((page - 1) * GRID_PAGE, page * GRID_PAGE);
  return (
    <>
      {loading ? (
        <ul className={cn('grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5', gridClassName)} aria-label="Loading">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="rounded-card border border-border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-14 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="mt-5 h-3 w-2/3" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className={cn('grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5', gridClassName)}>
          {rows.map((r) => (
            <li key={rowKey(r)} className="min-w-0">
              {renderCard(r)}
            </li>
          ))}
        </ul>
      )}
      {!loading && data.length > GRID_PAGE && (
        <Pagination
          // lg:mt-auto: at the card's bottom when the cards don't fill it (as the table's footer)
          className="border-t border-border-strong px-4 py-2.5 sm:px-5 lg:mt-auto"
          page={page}
          pageCount={pageCount}
          total={data.length}
          pageSize={GRID_PAGE}
          pageSizeOptions={[GRID_PAGE]}
          onPageChange={setPage}
        />
      )}
    </>
  );
}

/**
 * One card in the phone grid — the All Clients card: media (logo / icon) first, title + subtitle, small badges, the row
 * actions top-right, then the facts under a dashed line. `onOpen` makes the whole card tappable (the title is the
 * button; its ::after covers the card), as All Clients' cards open the client.
 */
export function GridCard({ media, title, subtitle, badges, actions, footer, onOpen, className }) {
  return (
    <div
      className={cn(
        'group relative flex h-full min-w-0 flex-col rounded-card border border-border-strong bg-surface/70 p-4 shadow-xs transition-[box-shadow,border-color] duration-300 ease-out focus-within:ring-2 focus-within:ring-focus dark:bg-surface-secondary/60',
        // Hover: a firmer edge and soft shadow only — no lift (the card popping up was asked away)
        onOpen && 'hover:border-chart-1/30 hover:shadow-raised',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {media}
        <div className="min-w-0 flex-1">
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              title={typeof title === 'string' ? title : undefined}
              className="block max-w-full truncate text-left text-sm font-semibold text-text transition-colors group-hover:text-primary-text after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
            >
              {title}
            </button>
          ) : (
            <p className="truncate text-sm font-semibold text-text">{title}</p>
          )}
          {subtitle && <p className="mt-0.5 truncate text-xs text-text-muted">{subtitle}</p>}
          {badges && <div className="mt-2 flex flex-wrap items-center gap-2">{badges}</div>}
        </div>
        {/* Above the stretched title button, so the actions stay clickable */}
        {actions && <div className="relative z-10 -mr-1 -mt-1 flex shrink-0 items-center gap-0.5">{actions}</div>}
      </div>
      {footer && <div className="mt-4 border-t border-dashed border-border-strong pt-3.5 text-[13px]">{footer}</div>}
    </div>
  );
}

/** A GridCard footer line, as on the client cards: an icon + text on the left (`lead`, e.g. Avatar or icon), the date on the right */
export function CardFooterRow({ lead, children, date }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2 text-text-secondary">
        {lead}
        <span className="truncate">{children}</span>
      </span>
      {date && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-text-muted">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatDate(date)}
        </span>
      )}
    </div>
  );
}
