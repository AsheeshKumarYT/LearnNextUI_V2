import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, SearchX, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { compareValues } from '@/utils/helpers';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Checkbox } from './Checkbox';
import { Pagination } from './Pagination';
import { TableActions } from './TableActions';
import { SkeletonTable, Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';

/**
 * Reusable data table. Everything except `columns` and `data` is optional.
 *
 * columns: [{
 *   key: 'title',                  // unique id; also default accessor (row[key])
 *   header: 'Course',              // header label (string or node)
 *   cell: (row) => node,           // custom renderer
 *   accessor: (row) => value,      // value used for sorting (defaults to row[key])
 *   sortable: true,
 *   align: 'left' | 'right' | 'center',
 *   width: '30%' | 160,
 *   hideBelow: 'lg' | 'xl' | …,     // secondary column: left out of the phone cards. The table itself never hides columns —
 *                                   // when it's wider than its frame it scrolls sideways (actions stay pinned on the right)
 *   pin: 'right',                   // keep this column in view on the right while the table scrolls (key 'actions' does it too)
 *   hideable: false,               // exclude from ColumnVisibility
 *   primary: true,                 // used as card title in mobile card layout
 *   wrap: true,                    // allow text wrapping (cells are nowrap by default)
 * }]
 *
 * Props:
 *   rowKey='id', loading, error, onRetry, emptyState (node), onRowClick(row), rowHover={false} (no hover tint on rows)
 *   rowClickable(row) => bool: with onRowClick, only these rows open something (pointer + click); every row still gets
 *     the brand hover look
 *   selectable, selectedKeys, onSelectionChange(keys), bulkActions(selectedRows, clearSelection) => node
 *   rowActions(row) => Dropdown items
 *   defaultSort={{ key, direction: 'asc'|'desc' }}, sort/onSortChange (controlled), manualSorting
 *   pagination: false | { pageSize, pageSizeOptions } (client) |
 *               { manual: true, page, pageSize, total, onPageChange, onPageSizeChange } (server)
 *   hiddenColumns: string[]  (pair with <ColumnVisibility/>)
 *   toolbar: node rendered inside the frame above the table
 *   mobileCards: render stacked cards below md instead of horizontal scroll
 *   embedded: no frame of its own (use inside a Card so glass surfaces don't stack)
 *   stickyHeader: from lg up, the column headings stay pinned under the app header while the page scrolls — frosted,
 *     with a soft shadow. Any frame around the table must not clip with overflow-hidden (use overflow-clip), or the
 *     header can't stick.
 */
// 'wide' = from 1400px (between xl and 2xl — e.g. a 1440px laptop with the full sidebar)
/** The actions column stays pinned to the right edge while the table scrolls sideways */
const isPinned = (c) => c.key === 'actions' || c.pin === 'right';
// Pinned cells stick to the right edge. While the table fits they're see-through like any cell. While it scrolls
// sideways, what passes under them dissolves into a soft fade (transparent → the card's colour over the first 28px),
// so there's no hard block (solid white read as "a strange white strip", frosted glass let the text ghost through).
// --pin-bg is the colour faded into; a hovered / selected row swaps it for its own tint.
const PIN = 'sticky right-0';
// Behind that, a light blur (masked to fade in the same way, so it has no hard edge) softens anything still showing.
const PIN_ON =
  'pl-9 [--pin-bg:color-mix(in_srgb,var(--color-surface)_95%,transparent)] dark:[--pin-bg:color-mix(in_srgb,var(--color-surface-secondary)_97%,transparent)] bg-[linear-gradient(to_right,transparent,var(--pin-bg)_28px)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:backdrop-blur-[6px] before:[mask-image:linear-gradient(to_right,transparent,black_28px)] before:content-[""]';
const PIN_TH_ON = `z-20 lg:z-20 ${PIN_ON} [--pin-bg:color-mix(in_srgb,var(--color-surface-sunken)_60%,var(--color-surface))]`;
const PIN_TD_ON = `z-[5] ${PIN_ON}`;
const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };

export function DataTable({
  columns,
  data = [],
  rowKey = 'id',
  loading,
  error,
  onRetry,
  emptyState,
  onRowClick,
  rowClickable,
  selectable,
  selectedKeys: selectedProp,
  onSelectionChange,
  bulkActions,
  rowActions,
  defaultSort,
  sort: sortProp,
  onSortChange,
  manualSorting,
  pagination = { pageSize: 10 },
  hiddenColumns = [],
  toolbar,
  mobileCards = false,
  embedded = false,
  stickyHeader = false,
  rowHover = true,
  caption,
  className,
}) {
  const getKey = (row) => (typeof rowKey === 'function' ? rowKey(row) : row[rowKey]);

  /* --- sticky header: is it pinned right now --- */
  const tableRef = useRef(null);
  const theadRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const isDesktop = useIsDesktop();
  // The heading cells stick just below the app header (--app-header-h) and any pinned page bar above the table, e.g.
  // the client tabs (--page-bar-h) — both CSS variables, so the cells glide along when those move. pinFix = a small
  // correction from measurement, because some browsers place sticky table cells a few px off.
  const [pinFix, setPinFix] = useState(0);
  // Wider than its frame? Then it scrolls sideways (its own scroll box — which also means the headings can't stick to
  // the page then); otherwise it flows so they can
  const scrollRef = useRef(null);
  const [wide, setWide] = useState(false);
  // While it scrolls: is there more to the left / right? (drives the edge shade and the ‹ › arrows)
  const [more, setMore] = useState({ left: false, right: false });
  const readEdges = () => {
    const box = scrollRef.current;
    if (!box) return;
    const left = box.scrollLeft > 2;
    const right = box.scrollLeft + box.clientWidth < box.scrollWidth - 2;
    setMore((m) => (m.left === left && m.right === right ? m : { left, right }));
  };
  const scrollStep = (dir) => {
    const box = scrollRef.current;
    box?.scrollBy({ left: dir * Math.max(240, box.clientWidth * 0.6), behavior: 'smooth' });
  };

  /* --- sorting --- */
  const [sortInner, setSortInner] = useState(defaultSort ?? null);
  const sort = sortProp !== undefined ? sortProp : sortInner;
  const setSort = (s) => (onSortChange ? onSortChange(s) : setSortInner(s));
  const toggleSort = (key) => {
    if (!sort || sort.key !== key) setSort({ key, direction: 'asc' });
    else if (sort.direction === 'asc') setSort({ key, direction: 'desc' });
    else setSort(null);
  };

  const visibleColumns = columns.filter((c) => !hiddenColumns.includes(c.key));
  const hasPinned = Boolean(rowActions) || visibleColumns.some(isPinned);

  const sorted = useMemo(() => {
    if (!sort || manualSorting) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const get = col.accessor ?? ((r) => r[col.key]);
    const out = [...data].sort((a, b) => compareValues(get(a), get(b)));
    return sort.direction === 'desc' ? out.reverse() : out;
  }, [data, sort, columns, manualSorting]);

  /* --- pagination --- */
  const manualPaging = pagination && pagination.manual;
  const [pageInner, setPageInner] = useState(1);
  const [pageSizeInner, setPageSizeInner] = useState(pagination?.pageSize ?? 10);
  const pageSizeChoice = manualPaging ? pagination.pageSize : pageSizeInner; // a number, or 'all'
  const total = manualPaging ? pagination.total : sorted.length;
  const pageSize = pageSizeChoice === 'all' ? Math.max(total, 1) : pageSizeChoice;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = manualPaging ? pagination.page : Math.min(pageInner, pageCount);

  // Back to page 1 when the result set changes size (search / filter / delete)
  useEffect(() => {
    if (!manualPaging) setPageInner(1);
  }, [data.length, manualPaging]);

  const rows = useMemo(() => {
    if (!pagination || manualPaging) return sorted;
    return sorted.slice((page - 1) * pageSize, page * pageSize);
  }, [sorted, pagination, manualPaging, page, pageSize]);

  /* --- selection --- */
  const [selectedInner, setSelectedInner] = useState([]);
  const selected = selectedProp ?? selectedInner;
  const setSelected = (keys) => (onSelectionChange ? onSelectionChange(keys) : setSelectedInner(keys));
  const pageKeys = rows.map(getKey);
  const allOnPage = pageKeys.length > 0 && pageKeys.every((k) => selected.includes(k));
  const someOnPage = pageKeys.some((k) => selected.includes(k));
  const toggleAll = () =>
    setSelected(allOnPage ? selected.filter((k) => !pageKeys.includes(k)) : [...new Set([...selected, ...pageKeys])]);
  const toggleRow = (k) => setSelected(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
  const selectedRows = data.filter((r) => selected.includes(getKey(r)));

  useEffect(() => {
    // drop selections for rows that no longer exist
    const keys = new Set(data.map(getKey));
    if (selected.some((k) => !keys.has(k))) setSelected(selected.filter((k) => keys.has(k)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const colCount = visibleColumns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const showBody = !loading && !error && rows.length > 0;

  useEffect(() => {
    const box = scrollRef.current;
    const table = tableRef.current;
    if (!box || !table) return undefined;
    const check = () => {
      setWide(table.scrollWidth > box.clientWidth + 1);
      readEdges();
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(box);
    ro.observe(table);
    return () => ro.disconnect();
  }, [showBody, visibleColumns.length]);

  // Watch the page scroll: pinned = the table's top has passed under the app header while its body is still on screen
  useEffect(() => {
    // Pinned headings exist from lg only — below that (phones / tablets) don't run this on every scroll frame at all
    // (it reads styles and positions each time, which made phone scrolling stutter)
    if (!stickyHeader || !isDesktop) {
      setStuck(false);
      return undefined;
    }
    const update = () => {
      const table = tableRef.current;
      const head = theadRef.current;
      if (!table || !head) return;
      // Where the cells should settle (not mid-slide): the app header's height (0 while it has slid away on scroll down)
      // plus any pinned page bar above the table
      const root = document.documentElement;
      const pageBar = parseFloat(getComputedStyle(root).getPropertyValue('--page-bar-h')) || 0;
      const TOP = (root.hasAttribute('data-header-hidden') ? 0 : (document.querySelector('body header')?.offsetHeight ?? 64)) + pageBar;
      const r = table.getBoundingClientRect();
      const stuck = window.matchMedia('(min-width: 1024px)').matches && r.top < TOP && r.bottom > TOP + head.offsetHeight;
      setStuck(stuck);
      // While pinned, line the cells up exactly (see pinFix) — measured only when they aren't gliding along with the
      // header, so a half-finished slide isn't mistaken for a misalignment; a browser quirk is a few px at most
      const cell = head.querySelector('th');
      if (stuck && cell && !cell.getAnimations().length) {
        const off = cell.getBoundingClientRect().top - TOP;
        if (Math.abs(off) > 0.5) setPinFix((t) => Math.max(-6, Math.min(6, t - off)));
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [stickyHeader, rows.length, isDesktop]);

  // Heading cells: pinned from lg (each <th> sticks — <thead> borders don't travel, so the divider + shadow are box-shadows).
  // The stick position is plain CSS, always on (lg+), so the browser pins them instantly however fast you scroll — just
  // below the app header (--app-header-h) and any pinned page bar (--page-bar-h), gliding along when the header slides
  // away / back. JS only decides the frosted "pinned" look (stuck) and the tiny --pin-fix correction.
  // (Not while the table scrolls sideways: inside its own scroll box the offset would push the headings over the rows)
  const stickyTh =
    stickyHeader &&
    !wide &&
    'lg:sticky lg:z-10 lg:top-[calc(var(--app-header-h)+var(--page-bar-h,0px)+var(--pin-fix,0px))] lg:transition-[top] lg:duration-300 lg:ease-out';
  const stuckTh =
    stuck &&
    !wide &&
    'lg:bg-surface/85 lg:backdrop-blur-md dark:lg:bg-surface-secondary/85 lg:[box-shadow:inset_0_-1px_0_var(--color-border-strong),0_12px_20px_-16px_rgb(var(--ln-shadow-color)/0.45)]';

  const cellPad = 'px-4 first:pl-5 sm:first:pl-6 last:pr-5 sm:last:pr-6';

  return (
    <div
      className={cn(
        'relative',
        stickyHeader ? 'overflow-clip' : 'overflow-hidden',
        !embedded && 'rounded-card glass border border-glass-border shadow-card',
        // Inside a list card that fills the page height (lg+): take the room left, so the footer sits at the card's bottom
        embedded && 'lg:flex lg:flex-1 lg:flex-col',
        className,
      )}
      style={stickyHeader && pinFix ? { '--pin-fix': `${pinFix}px` } : undefined}
    >
      {toolbar && <div className="border-b border-border-strong p-3 sm:px-5 sm:py-3.5">{toolbar}</div>}

      {selectable && selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-primary-soft/60 px-4 py-2.5 sm:px-5 animate-fade-in">
          <div className="flex items-center gap-2 text-[13px] font-medium text-primary-text">
            <button type="button" onClick={() => setSelected([])} aria-label="Clear selection" className="inline-flex size-6 items-center justify-center rounded-md hover:bg-primary-soft-hover">
              <X className="size-4" />
            </button>
            {selected.length} selected
          </div>
          <div className="flex flex-wrap items-center gap-2">{bulkActions?.(selectedRows, () => setSelected([]))}</div>
        </div>
      )}

      {/* Mobile card layout — each row its own card (as the list pages' cards on phones), not rows split by lines */}
      {mobileCards && showBody && (
        <ul className="flex flex-col gap-3 p-3 sm:p-4 md:hidden">
          {rows.map((row) => {
            const k = getKey(row);
            const primary = visibleColumns.find((c) => c.primary) ?? visibleColumns[0];
            // The actions column (pinned right on desktop) sits in the card's top-right corner, beside the title — as on the
            // list pages' cards — not as one more fact with an invisible label
            const actionCols = visibleColumns.filter((c) => c !== primary && isPinned(c));
            // Columns hidden below lg/xl on desktop are secondary — keep mobile cards compact
            const rest = visibleColumns.filter((c) => c !== primary && !isPinned(c) && c.header && !['lg', 'xl'].includes(c.hideBelow));
            const opens = onRowClick && (!rowClickable || rowClickable(row));
            return (
              <li
                key={k}
                onClick={opens ? () => onRowClick(row) : undefined}
                className={cn(
                  'flex gap-3 rounded-card border border-border-strong bg-surface/70 p-4 shadow-xs dark:bg-surface-secondary/60',
                  opens && 'cursor-pointer transition-colors active:bg-surface-secondary',
                  selected.includes(k) && 'border-primary/40 bg-primary-soft/40',
                )}
              >
                {selectable && (
                  <span onClick={(e) => e.stopPropagation()} className="pt-0.5">
                    <Checkbox checked={selected.includes(k)} onChange={() => toggleRow(k)} aria-label="Select row" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="min-w-0 flex-1">{primary.cell ? primary.cell(row) : row[primary.key]}</div>
                    {actionCols.map((c) => (
                      // Taps here don't open the row. The desktop-only "hover arrow" cue (an aria-hidden span) is left out.
                      <div key={c.key} onClick={(e) => e.stopPropagation()} className="-mr-1.5 -mt-1 shrink-0 [&>span>span[aria-hidden=true]]:hidden">
                        {c.cell ? c.cell(row) : null}
                      </div>
                    ))}
                  </div>
                  {/* The facts under a dashed line (as the list pages' cards), quiet sentence-case labels, room between rows */}
                  <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-dashed border-border-strong pt-4">
                    {rest.map((c) => (
                      <div key={c.key} className="min-w-0">
                        <dt className="text-xs text-text-muted">{c.header}</dt>
                        <dd className="mt-1 min-w-0 truncate text-[13px] text-text">{c.cell ? c.cell(row) : row[c.key]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {rowActions && <TableActions items={rowActions(row)} />}
              </li>
            );
          })}
        </ul>
      )}

      {/* Sideways scroll when the table is wider than its frame (no columns are ever hidden). Otherwise, with a sticky
          header, it lets the table flow from lg — a scroll box would trap the sticky heading cells.
          So you can tell it scrolls: ‹ › arrows in the pinned actions heading, a soft shade on the edge that has more
          (left; and right when there's no pinned column), and a scrollbar dark enough to notice. */}
      <div className={cn('relative', mobileCards && showBody && 'hidden md:block')}>
      <div
        ref={scrollRef}
        onScroll={wide ? readEdges : undefined}
        className={cn(
          'relative overflow-x-auto',
          stickyHeader && !wide && 'lg:overflow-x-visible',
          wide && '[scrollbar-color:color-mix(in_srgb,var(--ln-text-muted)_55%,transparent)_transparent]',
        )}
      >
        <table ref={tableRef} className="w-full min-w-full border-collapse text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead ref={theadRef} className="border-b border-border-strong bg-surface-sunken/60">
            <tr>
              {selectable && (
                <th scope="col" className={cn('w-10 py-2.5 pl-5 pr-0 sm:pl-6', stickyTh, stuckTh)}>
                  <Checkbox checked={allOnPage} indeterminate={!allOnPage && someOnPage} onChange={toggleAll} aria-label="Select all rows on this page" />
                </th>
              )}
              {visibleColumns.map((c) => {
                const active = sort?.key === c.key;
                const SortIcon = active ? (sort.direction === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{ width: c.width }}
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn(
                      'h-12 whitespace-nowrap text-[13px] font-semibold text-text-secondary',
                      cellPad,
                      alignClass[c.align ?? 'left'],
                      stickyTh,
                      stuckTh,
                      isPinned(c) && [PIN, wide && PIN_TH_ON],
                    )}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={cn(
                          'group -mx-1.5 inline-flex items-center gap-1 rounded px-1.5 py-1 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                          active && 'text-text',
                          c.align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        {c.header}
                        <SortIcon className={cn('size-3.5', !active && 'opacity-40 group-hover:opacity-100')} aria-hidden="true" />
                      </button>
                    ) : (
                      c.header
                    )}
                    {isPinned(c) && wide && <ScrollArrows more={more} onStep={scrollStep} />}
                  </th>
                );
              })}
              {rowActions && (
                <th scope="col" className={cn('w-12 pr-4 sm:pr-5', stickyTh, stuckTh, PIN, wide && PIN_TH_ON)}>
                  <span className="sr-only">Actions</span>
                  {wide && <ScrollArrows more={more} onStep={scrollStep} />}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-strong">
            {showBody &&
              rows.map((row) => {
                const k = getKey(row);
                const isSel = selected.includes(k);
                const opens = onRowClick && (!rowClickable || rowClickable(row));
                // The pinned actions cell: see-through like the rest while the table fits; a soft fade while it scrolls (its
                // colour follows the row's hover / selected tint)
                const pinTd = cn(
                  PIN,
                  wide && [
                    PIN_TD_ON,
                    isSel
                      ? '[--pin-bg:color-mix(in_srgb,var(--color-primary-soft)_55%,var(--color-surface))]'
                      : onRowClick
                        ? 'row-hover:[--pin-bg:color-mix(in_srgb,var(--color-chart-1)_5%,var(--color-surface))]'
                        : rowHover && 'group-hover:[--pin-bg:var(--color-surface-secondary)]',
                  ],
                );
                return (
                  <tr
                    key={k}
                    onClick={opens ? () => onRowClick(row) : undefined}
                    className={cn(
                      'group transition-colors',
                      opens && 'cursor-pointer',
                      // Clickable rows get a faint brand tint on hover (they open something); others a neutral one
                      isSel ? 'bg-primary-soft/50' : onRowClick ? 'row-self-hover:bg-chart-1/[0.045]' : rowHover && 'hover:bg-surface-secondary',
                    )}
                  >
                    {selectable && (
                      <td className="w-10 py-4 pl-5 pr-0 sm:pl-6" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSel} onChange={() => toggleRow(k)} aria-label="Select row" />
                      </td>
                    )}
                    {visibleColumns.map((c) => (
                      <td
                        key={c.key}
                        className={cn('py-4 text-sm text-text', !c.wrap && 'whitespace-nowrap', cellPad, alignClass[c.align ?? 'left'], isPinned(c) && pinTd)}
                      >
                        {c.cell ? c.cell(row) : row[c.key]}
                      </td>
                    ))}
                    {rowActions && (
                      <td className={cn('w-12 py-2 pr-3 sm:pr-4', pinTd)}>
                        <TableActions items={rowActions(row)} />
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {loading && (
          <div>
            <SkeletonTable rows={Math.min(pageSize, 6)} cols={Math.min(colCount, 5)} />
          </div>
        )}
      </div>
        {/* Edge shades: more columns that way (they fade in/out with the scroll position) */}
        {wide && (
          <>
            <span
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 z-[6] w-8 bg-gradient-to-r from-[rgb(var(--ln-shadow-color)/0.16)] to-transparent transition-opacity duration-200',
                more.left ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden="true"
            />
            {!hasPinned && (
              <span
                className={cn(
                  'pointer-events-none absolute inset-y-0 right-0 z-[6] w-8 bg-gradient-to-l from-[rgb(var(--ln-shadow-color)/0.16)] to-transparent transition-opacity duration-200',
                  more.right ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      {!loading && error && <ErrorState compact title="Couldn’t load data" description={error.message} onRetry={onRetry} />}
      {!loading && !error && rows.length === 0 &&
        (emptyState ?? <EmptyState compact icon={SearchX} title="No results" description="Try adjusting your search or filters." />)}

      {pagination && !error && (loading ? (
        <div className="flex justify-between border-t border-border px-4 py-3 sm:px-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      ) : (
        total > 0 && (
          <Pagination
            // lg:mt-auto: pinned to the bottom when the table is short (see `embedded` above)
            className="border-t border-border-strong px-4 py-2.5 sm:px-5 lg:mt-auto"
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={pageSizeChoice}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageChange={manualPaging ? pagination.onPageChange : setPageInner}
            onPageSizeChange={
              manualPaging
                ? pagination.onPageSizeChange
                : (s) => {
                    setPageSizeInner(s);
                    setPageInner(1);
                  }
            }
          />
        )
      ))}
    </div>
  );
}

/**
 * ‹ › in the pinned actions heading while the table scrolls sideways — tells you there are more columns and moves
 * between them; the side with nothing more is greyed out
 */
function ScrollArrows({ more, onStep }) {
  const btn =
    'inline-flex size-6 items-center justify-center rounded-full bg-surface text-text-secondary shadow-xs ring-1 ring-inset ring-border-strong transition-colors hover:text-primary-text hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-35 dark:bg-surface-secondary';
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <button type="button" className={btn} onClick={() => onStep(-1)} disabled={!more.left} aria-label="Scroll table left" title="More columns to the left">
        <ChevronLeft className="size-3.5" aria-hidden="true" />
      </button>
      <button type="button" className={btn} onClick={() => onStep(1)} disabled={!more.right} aria-label="Scroll table right" title="More columns to the right">
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}
