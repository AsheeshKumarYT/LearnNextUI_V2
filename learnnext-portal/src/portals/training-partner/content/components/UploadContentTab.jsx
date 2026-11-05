import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, GripHorizontal, Plus, UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { programsApi } from '@/services/api';
import { Card, IconButton } from '@/components/ui';
import { ErrorState, Skeleton } from '@/components/feedback';
import { TabHeader } from '@/shared/clients/detail/TabHeader';
import { FILE_KINDS, KIND_ORDER, plural, useContentStages } from './contentStages';
import { ElementModal } from './ElementModal';
import { ElementDrawer } from './ElementDrawer';

/**
 * Upload Content (program page): the program's content as a journey in three lanes — Pre-program → During →
 * Post-program (picked from previews: "Journey lanes"). A numbered journey line runs across the top (lg+); each lane is
 * a faint wash of its stage colour holding its elements as calm cards (name, description, a chip per file kind with its
 * count) and an "Add element" slot at the bottom. Add element opens a modal (name, description, documents / videos /
 * links); a card opens a drawer with every file, where it can be edited or deleted. Lanes stack on smaller screens.
 * The lanes are the program's own modules (Pre / During / Post for most programs); with more than three, the
 * board scrolls sideways like a kanban (picked from previews: "Scrolling board").
 */
export function UploadContentTab({ program, onElementRemoved }) {
  const toast = useToast();
  const { user } = useAuth();
  const { data, loading, error, reload, setData } = useAsync(() => programsApi.content(program.id), [program.id]);
  // The lanes: one per module of this program, in order
  const { stages, byKey, error: stagesError, reload: reloadStages } = useContentStages(program.id);
  const [drag, setDrag] = useState(null); // { id, from } while a card is being dragged
  const [dropAt, setDropAt] = useState(null); // { stage, index } — where it would land

  // Move an element to `index` of stage `to` (index counted as if it were still in place) — shown at once, then saved
  const move = async (id, from, to, index) => {
    const at = data[from].findIndex((e) => e.id === id);
    if (at < 0) return;
    const target = from === to && index > at ? index - 1 : index;
    if (from === to && target === at) return;
    const el = data[from][at];
    setData((d) => {
      const next = { ...d, [from]: d[from].filter((e) => e.id !== id) };
      next[to] = [...next[to]];
      next[to].splice(target, 0, el);
      return next;
    });
    if (viewing.element?.id === id) setViewing((v) => ({ ...v, stage: to }));
    try {
      setData(await programsApi.moveElement(program.id, from, id, to, target, user?.name ?? 'You'));
      if (from !== to) toast.success(`Moved to ${byKey[to]?.label ?? 'another module'}`, { description: el.name });
    } catch (er) {
      toast.error('Couldn’t move the element', { description: er.message });
      reload();
    }
  };
  const endDrag = () => {
    setDrag(null);
    setDropAt(null);
  };
  // The modal adds (element null) or edits; editing starts from the drawer, which steps aside (overlays don't stack)
  // and comes back — with the saved version — when the modal closes
  const [modal, setModal] = useState({ open: false, stage: 'pre', element: null, back: false });
  const [viewing, setViewing] = useState({ open: false, stage: 'pre', element: null });
  const addTo = (stage) => setModal({ open: true, stage, element: null, back: false });
  const editViewed = () => {
    setViewing((v) => ({ ...v, open: false }));
    setModal({ open: true, stage: viewing.stage, element: viewing.element, back: true });
  };
  const closeModal = () => {
    setModal((m) => ({ ...m, open: false }));
    if (modal.back) setViewing((v) => ({ ...v, open: true }));
  };
  const saved = (el) => {
    reload();
    if (modal.element) setViewing((v) => ({ ...v, element: el }));
  };

  const lanes = stages ?? [];
  const n = lanes.length;
  const counts = data ? lanes.map((s) => data[s.key]?.length ?? 0) : [];
  const elements = counts.reduce((a, c) => a + c, 0);
  const files = data ? lanes.reduce((a, s) => a + (data[s.key] ?? []).reduce((b, e) => b + e.files.length, 0), 0) : 0;
  // More than three modules (lg+): a kanban board — lanes keep a fixed width (three and a bit in view, the next one
  // peeking in) and the ribbon + lanes scroll sideways together, with ‹ › in the header and soft fades at the edges
  const board = useBoardScroll(n);
  const wide = n > 3;
  // Phones (picked from previews: "Stage chips"): one module at a time — a row of chips (name + count) switches between
  // them, instead of every lane stacked into one long scroll
  const mobile = useIsMobile();
  const [activeKey, setActiveKey] = useState(null);
  const current = lanes.find((s) => s.key === activeKey) ?? lanes[0];
  const shown = mobile ? lanes.filter((s) => s === current) : lanes;

  return (
    <Card tint="primary" subtleTint flatOnMobile padding="none" className="flex flex-col">
      <TabHeader icon={UploadCloud} title="Upload Content" description="What participants get before, during and after the program." hideTitleOnMobile className="max-sm:px-3 max-sm:pb-4 max-sm:pt-0">
        {(data || (wide && board.overflows)) && (
          <div className="flex items-center gap-2">
            {data && (
              <span className="inline-flex h-8 items-center gap-2 rounded-full bg-text-muted/[0.06] px-3 text-xs font-medium text-text-secondary ring-1 ring-inset ring-text-muted/10">
                <span className="font-semibold tabular-nums text-text">{plural(elements, 'element')}</span>
                <span className="text-text-muted/60" aria-hidden="true">
                  ·
                </span>
                {plural(files, 'file')}
              </span>
            )}
            {wide && board.overflows && (
              <span className="hidden items-center gap-1 lg:inline-flex">
                <IconButton icon={ChevronLeft} label="Earlier modules" size="sm" variant="secondary" disabled={!board.canLeft} onClick={() => board.step(-1)} />
                <IconButton icon={ChevronRight} label="Later modules" size="sm" variant="secondary" disabled={!board.canRight} onClick={() => board.step(1)} />
              </span>
            )}
          </div>
        )}
      </TabHeader>

      <div className="flex-1 px-5 pb-6 max-sm:px-3 max-sm:pb-0 sm:px-6">
        {(error && !data) || (stagesError && !stages) ? (
          <ErrorState
            compact
            title="Couldn’t load the content"
            description={(error ?? stagesError).message}
            onRetry={() => {
              reload();
              reloadStages();
            }}
          />
        ) : (
          <div
            ref={board.ref}
            onDragOver={wide ? board.edgeScroll : undefined}
            className={cn(wide && 'lg:-mx-1 lg:overflow-x-auto lg:px-1 lg:pb-3 lg:[scrollbar-width:thin]')}
            // The board's edge fades are for the desktop board only — on phones the chip row fades itself (the board mask
            // used to fade the lane and its cards too)
            style={wide ? { '--lane': 'max(17rem, calc((100% - 3rem) / 3.25))', ...(mobile ? null : board.fade) } : undefined}
            aria-label={wide ? `${n} modules — scroll sideways to see them all` : undefined}
          >
            {/* Journey ribbon (lg+): joined arrow segments, softly tinted in each stage's colour (picked from previews:
                "Arrow steps") — icon, name and count in each; the points show the direction. On the scrolling board each
                segment sits over its lane and reaches into the gap so the points still nest */}
            <ol
              className={cn('mb-4 hidden lg:grid', wide ? 'auto-cols-[var(--lane)] grid-flow-col gap-4' : 'gap-1 overflow-hidden rounded-xl')}
              style={wide ? undefined : { gridTemplateColumns: `repeat(${Math.max(n, 1)}, minmax(0, 1fr))` }}
              aria-label="Content journey"
            >
              {lanes.map((s, i) => {
                const last = i === n - 1;
                return (
                  <li
                    key={s.key}
                    className={cn(
                      'flex h-14 min-w-0 items-center gap-3',
                      s.arrow,
                      i === 0 ? 'pl-4' : 'pl-8',
                      last ? 'pr-4' : 'pr-8',
                      wide && [i === 0 && 'rounded-l-xl', last && 'rounded-r-xl', !last && '-mr-3'],
                    )}
                    style={{ clipPath: n === 1 ? undefined : ARROW[i === 0 ? 'first' : last ? 'last' : 'middle'] }}
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface/80 shadow-xs" aria-hidden="true">
                      <s.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text" title={s.label}>
                      {s.label}
                    </span>
                    {data && (
                      <span className="shrink-0 rounded-full bg-surface/80 px-2 py-0.5 text-xs font-semibold tabular-nums text-text-secondary" title={plural(counts[i], 'element')}>
                        {counts[i]}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>

            {mobile && lanes.length > 1 && <StageChips stages={lanes} counts={data ? counts : null} active={current?.key} onPick={setActiveKey} />}

            <div
              className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', wide ? 'lg:auto-cols-[var(--lane)] lg:grid-flow-col lg:grid-cols-none' : 'lg:[grid-template-columns:var(--cols)]')}
              style={wide ? undefined : { '--cols': `repeat(${Math.max(n, 1)}, minmax(0, 1fr))` }}
            >
              {!stages &&
                [0, 1, 2].map((i) => <Skeleton key={i} className="h-[22rem] rounded-2xl" />)}
              {shown.map((s) => (
                <Lane
                  key={s.key}
                  stage={s}
                  n={lanes.indexOf(s) + 1}
                  elements={data?.[s.key] ?? (data ? [] : undefined)}
                  loading={loading && !data}
                  onAdd={() => addTo(s.key)}
                  onOpen={(element) => setViewing({ open: true, stage: s.key, element })}
                  drag={drag}
                  dropIndex={dropAt?.stage === s.key ? dropAt.index : null}
                  onDragStart={(id) => setDrag({ id, from: s.key })}
                  onDragOverIndex={(index) => setDropAt((d) => (d?.stage === s.key && d.index === index ? d : { stage: s.key, index }))}
                  onDragLeaveLane={() => setDropAt((d) => (d?.stage === s.key ? null : d))}
                  onDrop={(index) => {
                    if (drag) move(drag.id, drag.from, s.key, index);
                    endDrag();
                  }}
                  onDragEnd={endDrag}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ElementModal open={modal.open} stages={stages} stage={modal.stage} element={modal.element} program={program} onClose={closeModal} onSaved={saved} />
      <ElementDrawer
        open={viewing.open}
        stages={stages}
        stage={viewing.stage}
        element={viewing.element}
        program={program}
        position={viewing.element && data?.[viewing.stage] ? { index: data[viewing.stage].findIndex((e) => e.id === viewing.element.id), count: data[viewing.stage].length } : null}
        stageCounts={data ? Object.fromEntries(lanes.map((s) => [s.key, data[s.key]?.length ?? 0])) : null}
        onMove={(to, index) => move(viewing.element.id, viewing.stage, to, index)}
        onClose={() => setViewing((v) => ({ ...v, open: false }))}
        onEdit={editViewed}
        onRemoved={() => {
          onElementRemoved?.(viewing.element.id);
          setViewing((v) => ({ ...v, open: false }));
          reload();
        }}
      />
    </Card>
  );
}

/**
 * The sideways-scrolling board (more than three modules): whether it overflows / can scroll either way (for ‹ › and the
 * edge fades), `step(±1)` = scroll by one lane, and `edgeScroll` = while dragging a card near either edge, keep scrolling
 * so it can reach a lane that's out of view. `ref` goes on the scroller.
 */
function useBoardScroll(count) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ overflows: false, canLeft: false, canRight: false });
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = { overflows: max > 2, canLeft: el.scrollLeft > 2, canRight: el.scrollLeft < max - 2 };
    setEdges((e) => (e.overflows === next.overflows && e.canLeft === next.canLeft && e.canRight === next.canRight ? e : next));
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [measure, count]);

  // One lane = the first lane's width plus the gap
  const step = (dir) => {
    const el = ref.current;
    const lane = el?.querySelector('section');
    if (el) el.scrollBy({ left: dir * ((lane?.offsetWidth ?? el.clientWidth / 3) + 16), behavior: 'smooth' });
  };
  const edgeScroll = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (e.clientX < r.left + 64) el.scrollLeft -= 14;
    else if (e.clientX > r.right - 64) el.scrollLeft += 14;
  };
  // Soft fades on the side(s) with more to see
  const l = edges.canLeft ? '28px' : '0px';
  const rr = edges.canRight ? '28px' : '0px';
  const mask = `linear-gradient(to right, transparent, #000 ${l}, #000 calc(100% - ${rr}), transparent)`;
  const fade = edges.overflows ? { maskImage: mask, WebkitMaskImage: mask } : undefined;
  return { ref, ...edges, step, edgeScroll, fade };
}

/**
 * Phones: the modules as a row of chips — icon, name and element count — scrolling sideways when they don't fit. The
 * picked one takes its stage's soft tint; the rest stay plain white.
 */
function StageChips({ stages, counts, active, onPick }) {
  // Soft fade on the side(s) with more chips to scroll to — only this row fades, never the lane below
  const ref = useRef(null);
  const [more, setMore] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      setMore((m) => {
        const next = { left: el.scrollLeft > 2, right: el.scrollLeft < max - 2 };
        return m.left === next.left && m.right === next.right ? m : next;
      });
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [stages.length]);
  // 56px: the row runs to the screen edge (12px of it is padding), so a shorter fade barely touched the chips
  const mask = `linear-gradient(to right, transparent, #000 ${more.left ? '56px' : '0px'}, #000 calc(100% - ${more.right ? '56px' : '0px'}), transparent)`;
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="Modules"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className="-mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {stages.map((s, i) => {
        const on = s.key === active;
        return (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={(e) => {
              onPick(s.key);
              e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
            }}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border pl-2.5 pr-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              on ? [s.arrow, 'border-transparent font-semibold text-text ring-1 ring-inset', s.ring, s.chipDark] : 'border-border-strong/70 bg-surface font-medium text-text-secondary dark:bg-surface-secondary',
            )}
          >
            <s.icon className="size-4 shrink-0" aria-hidden="true" />
            {s.label}
            {counts && (
              <span className={cn('rounded-full px-1.5 text-[11px] font-semibold tabular-nums', on ? 'bg-surface/80 text-text-secondary' : 'bg-text-muted/[0.08] text-text-muted')}>
                {counts[i]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// The journey ribbon's segment shapes: a point on the right; a notch on the left where the previous one points in
const ARROW = {
  first: 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)',
  middle: 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)',
  last: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 16px 50%)',
};

/** A numbered stage dot with a soft halo (lane headers on smaller screens); `soft` = a light tint with a coloured number */
export function StageDot({ stage, n, small, soft }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums',
        small ? 'size-6 text-[11px]' : 'size-8 text-[13px]',
        soft ? [stage.arrow, 'ring-1', stage.ring] : ['ring-4', stage.dot, stage.ring],
      )}
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

/**
 * One bucket: its own header on smaller screens (the journey line covers it on lg), its elements, then the add slot.
 * Cards can be dragged to reorder them or into another lane: while dragging, a line shows where it will land and the
 * lane under the pointer gets a soft outline.
 */
function Lane({ stage, n, elements, loading, onAdd, onOpen, drag, dropIndex, onDragStart, onDragOverIndex, onDragLeaveLane, onDrop, onDragEnd }) {
  const empty = !loading && elements?.length === 0;
  const listRef = useRef(null);
  // Where the pointer would drop: before the first card whose middle is below it, else at the end
  const indexAt = (y) => {
    const cards = [...(listRef.current?.querySelectorAll('[data-el-card]') ?? [])];
    const i = cards.findIndex((c) => {
      const r = c.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return i < 0 ? cards.length : i;
  };
  // A drop that would leave the card where it is shows no line
  const from = drag ? elements?.findIndex((e) => e.id === drag.id) : -1;
  const showLine = (i) => dropIndex === i && !(from >= 0 && (i === from || i === from + 1));
  const line = <span className="block h-1 shrink-0 rounded-full bg-primary/45" aria-hidden="true" />;

  return (
    <section
      ref={listRef}
      aria-label={stage.label}
      onDragOver={(e) => {
        if (!drag) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOverIndex(indexAt(e.clientY));
      }}
      onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && onDragLeaveLane()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(indexAt(e.clientY));
      }}
      // A flat tint in the same hue as its arrow (a step lighter), with a border in that hue
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-2xl border p-3 transition-shadow sm:p-3.5 lg:min-h-[22rem]',
        stage.lane,
        drag && dropIndex != null && 'ring-2 ring-primary/25',
      )}
    >
      {/* Phones name the module in the chips above, so the lane's own header shows only between md and lg */}
      <header className="flex items-center gap-2.5 px-0.5 pt-0.5 max-md:hidden lg:hidden">
        <StageDot stage={stage} n={n} small />
        <p className="text-sm font-semibold text-text">{stage.label}</p>
        {elements && <span className="text-xs tabular-nums text-text-muted">· {plural(elements.length, 'element')}</span>}
      </header>
      {/* The lane's top line: its hint, and "+ Add" at the right — the same spot in every lane and always in view
          (picked from previews; the dashed slot under the cards slid out of sight and sat at a different height per lane) */}
      <div className="-mt-1 flex min-h-7 items-center gap-2 px-0.5 max-md:mt-0 lg:mt-0">
        <p className="min-w-0 flex-1 truncate text-xs text-text-muted" title={stage.hint}>
          {stage.hint}
        </p>
        {!empty && !loading && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add element to ${stage.label}`}
            // The small white "+ Add" pill (a bigger blue "Add element" read too heavy); the plus sits in a little solid
            // round badge in the lane's own colour (white plus), and the pill has a dashed edge in that colour (like the old dashed add slot) —
            // it turns solid on hover. No shadow (flat on the lane)
            className={cn(
              'group/addbtn inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-dashed bg-surface pl-1 pr-2.5 text-xs font-semibold text-primary-text hover:border-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary',
              stage.edge,
            )}
          >
            <span className={cn('inline-flex size-5 items-center justify-center rounded-full transition-transform duration-200 group-hover/addbtn:rotate-90', stage.dot)} aria-hidden="true">
              <Plus className="size-3.5" strokeWidth={2.75} />
            </span>
            Add
          </button>
        )}
      </div>

      {loading ? (
        <>
          <Skeleton className="h-[92px] rounded-xl" />
          <Skeleton className="h-[92px] rounded-xl" />
        </>
      ) : (
        elements.map((e, i) => (
          <Fragment key={e.id}>
            {showLine(i) && line}
            <div
              data-el-card
              draggable
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('text/plain', e.name);
                onDragStart(e.id);
              }}
              onDragEnd={onDragEnd}
              className={cn('group/drag relative cursor-grab transition-opacity active:cursor-grabbing', drag?.id === e.id && 'opacity-40')}
            >
              <ElementCard element={e} onOpen={() => onOpen(e)} />
              {/* Drag handle: a small pill sitting on the card's top edge, centred — shows on hover, clear of the text (the whole card drags) */}
              {!drag && (
                <span
                  className="pointer-events-none absolute -top-2 left-1/2 inline-flex h-4 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border-strong/70 bg-surface text-text-muted opacity-0 shadow-xs transition-opacity group-hover/drag:opacity-100 dark:bg-surface-secondary"
                  aria-hidden="true"
                >
                  <GripHorizontal className="size-3.5" />
                </span>
              )}
            </div>
          </Fragment>
        ))
      )}
      {!loading && showLine(elements.length) && line}

      {/* An empty lane keeps its big centred slot — it's the lane's only content */}
      {empty && <AddElementSlot stage={stage} empty onClick={onAdd} />}
    </section>
  );
}

/** An element: name, a short description, then one small chip per kind of file with its count, and when it was added (its lane adds the drag handle) */
function ElementCard({ element: e, onOpen }) {
  const byKind = KIND_ORDER.map((k) => [k, e.files.filter((f) => f.kind === k).length]).filter(([, n]) => n);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group/el relative w-full rounded-xl border border-border-strong/70 bg-surface p-3.5 text-left shadow-xs transition-[box-shadow,border-color] duration-200 hover:border-chart-1/25 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary"
    >
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-text transition-colors group-hover/el:text-primary-text" title={e.name}>
          {e.name}
        </p>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-text-muted/60 transition-colors group-hover/el:text-primary-text" aria-hidden="true" />
      </div>
      {e.description && <p className="mt-0.5 line-clamp-2 text-xs leading-[18px] text-text-secondary">{e.description}</p>}
      <div className="mt-3 flex items-center gap-1.5">
        {byKind.map(([k, n]) => {
          const K = FILE_KINDS[k];
          return (
            <span
              key={k}
              className={cn('inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold tabular-nums', K.tile)}
              title={`${n} ${n === 1 ? K.label.toLowerCase() : K.plural.toLowerCase()}`}
            >
              <K.icon className="size-3.5" aria-hidden="true" />
              {n}
            </span>
          );
        })}
        <span className="ml-auto text-[11px] tabular-nums text-text-muted">{formatRelative(e.updatedAt ?? e.createdAt)}</span>
      </div>
    </button>
  );
}

/**
 * The lane's "Add element" slot — a white dashed slot (solid, so it stands out on the tinted lane like the cards), with
 * a tile in the stage colour holding the stage icon. On hover / focus the icon slides up out of the tile and a plus
 * slides in (in the stage colour), the tile lifting with a soft halo (no spin, no shine, no colour fill — a solid fill read
 * as too vibrant). Large and centred when the lane is still empty; a slim row under the cards otherwise.
 */
function AddElementSlot({ stage, empty, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group/add relative flex w-full items-center rounded-xl bg-surface text-left shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary',
        empty ? 'flex-1 flex-col justify-center gap-2 px-4 py-8 text-center' : 'gap-3 px-3 py-2.5',
      )}
    >
      {/* Flowing outline (picked from previews): a fine dashed line in the lane colour (3 / 2 — twice the dashes of the
          first version) that only travels round the slot on hover / focus; still for anyone who prefers reduced motion */}
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <rect
          x="0.625"
          y="0.625"
          rx="11.375"
          style={{ width: 'calc(100% - 1.25px)', height: 'calc(100% - 1.25px)' }}
          fill="none"
          strokeWidth="1.25"
          strokeDasharray="3 2"
          strokeLinecap="round"
          className={cn(
            'animate-dash-flow [animation-play-state:paused] group-hover/add:[animation-play-state:running] group-focus-visible/add:[animation-play-state:running] motion-reduce:animate-none',
            stage.outline,
          )}
        />
      </svg>
      <SwapTile stage={stage} large={empty} />
      <span className={cn(empty && 'flex flex-col gap-1')}>
        <span className="block text-[13px] font-semibold text-primary-text">Add element</span>
        <span className="block text-xs text-text-muted">{empty ? `Nothing for ${stage.label.toLowerCase()} yet — documents, videos or links` : 'Documents, videos or links'}</span>
      </span>
    </button>
  );
}

/**
 * The slot's tile: the stage icon, swapped for a plus on hover (it slides up and out, the plus slides up in). The tile
 * itself stays put — no lift and no halo ring (they nudged it off the text's centre line and crowded the dashed edge)
 */
function SwapTile({ stage, large }) {
  const swapOut = large ? 'group-hover/add:-translate-y-10 group-focus-visible/add:-translate-y-10' : 'group-hover/add:-translate-y-8 group-focus-visible/add:-translate-y-8';
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
        large ? 'mb-1 size-11 rounded-2xl' : 'size-9 rounded-xl',
        stage.slot,
      )}
      aria-hidden="true"
    >
      <stage.icon
        className={cn(
          'absolute transition-[transform,opacity] duration-300 ease-out group-hover/add:opacity-0 group-focus-visible/add:opacity-0',
          large ? 'size-5' : 'size-4',
          swapOut,
        )}
      />
      <Plus
        className={cn(
          'absolute opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover/add:translate-y-0 group-hover/add:opacity-100 group-focus-visible/add:translate-y-0 group-focus-visible/add:opacity-100',
          large ? 'size-5 translate-y-10' : 'size-4 translate-y-8',
        )}
        strokeWidth={2.5}
      />
    </span>
  );
}
