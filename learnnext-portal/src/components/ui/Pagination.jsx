import { ChevronLeft, ChevronRight, Rows3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SegmentedControl } from './Tabs';
import { Select } from './Select';

function pageRange(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i && p - pages[i - 1] > 1) out.push('…' + p);
    out.push(p);
  });
  return out;
}

/**
 * <Pagination page={page} pageCount={n} onPageChange={setPage} total={rows} pageSize={10} onPageSizeChange={…} />
 * Left: a "10 rows" dropdown + "1–10 of 30". Right: page numbers as a sliding toggle with round prev/next.
 * Collapses to "‹ 2 / 9 ›" on small screens. Add 'all' to pageSizeOptions for an "All rows" choice
 * (pageSize === 'all' shows everything on one page and hides the page buttons).
 */
export function Pagination({ page, pageCount, onPageChange, total, pageSize, onPageSizeChange, pageSizeOptions = [10, 20, 50], className }) {
  const all = pageSize === 'all';
  const size = all ? Math.max(total ?? 0, 1) : pageSize;
  const from = total ? (page - 1) * size + 1 : 0;
  const to = Math.min(page * size, total ?? 0);
  // Page numbers as one sliding toggle; gaps ("…") are disabled spacers
  const pages = pageRange(page, pageCount).map((p) => (typeof p === 'string' ? { value: p, label: '…', disabled: true } : { value: p, label: String(p) }));
  const arrow =
    'inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-text-muted/15 bg-surface text-text-secondary shadow-xs transition-colors hover:border-primary/30 hover:text-primary-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-40 dark:bg-surface-secondary';

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      {/* Rows-per-page dropdown, then the range ("1–10 of 30") — the right side keeps the only toggle */}
      {total != null && (
        <div className="flex items-center gap-3 text-[13px] text-text-muted">
          {onPageSizeChange && pageSizeOptions.length > 1 && (
            <Select
              size="sm"
              leftIcon={Rows3}
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => onPageSizeChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              options={pageSizeOptions.map((s) => ({ value: s, label: s === 'all' ? 'All rows' : `${s} rows` }))}
              className="hidden w-[118px] md:block"
            />
          )}
          <span>
            {all ? (
              <>
                All <span className="font-semibold tabular-nums text-text">{total}</span> shown
              </>
            ) : (
              <>
                <span className="font-semibold tabular-nums text-text">{from}–{to}</span> of <span className="font-semibold tabular-nums text-text">{total}</span>
              </>
            )}
          </span>
        </div>
      )}

      <div className={cn('flex items-center gap-3', pageCount <= 1 && 'hidden')}>
        <nav aria-label="Pagination" className="flex items-center gap-2">
          <button type="button" className={arrow} disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="px-1 text-[13px] tabular-nums text-text-muted sm:hidden">
            <span className="font-semibold text-text">{page}</span> / {pageCount}
          </span>
          {pageCount > 1 && (
            <SegmentedControl size="sm" ariaLabel="Page" value={page} onChange={onPageChange} tabs={pages} className="hidden tabular-nums sm:inline-flex" />
          )}
          <button type="button" className={arrow} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}
