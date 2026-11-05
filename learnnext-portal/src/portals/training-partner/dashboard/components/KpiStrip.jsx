import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Hourglass, IndianRupee, Layers } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui';
import { addDays, formatDate, isSameDay } from '@/utils/formatDate';
import { formatRupeesCompact } from '@/utils/formatNumber';
import { CountUp } from './CountUp';
import { percent } from './dashboardTheme';

// Programs awaiting approval live under Projects (see src/config/navigation.js)
const APPROVALS_PATH = '/projects';

/**
 * The four numbers an admin checks first, kept calm — picked from previews: "Hairline progress". Each card's visual
 * is its number's story, in soft tints:
 *   Programs     → a hairline along the card's bottom filled to the share completed, the % beside the note
 *   Next 10 days → a muted 10-day dot calendar in the corner: one dot per session, tomorrow first
 *   Billing      → the hairline filled to the share collected
 *   To approve   → the hairline filled to the share of all programs still waiting
 * Lines and dots grow in on load; everything follows the period switcher except Next 10 days (a fixed window).
 */
export function KpiStrip({ data }) {
  const { programs, upcoming, liveToday, billing } = data;
  const pending = programs.pending;
  const rowRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  // Phones: which card is in view (for the dots), from the row's scroll position
  const onScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    const step = row.firstElementChild?.getBoundingClientRect().width ?? 1;
    setCurrent(Math.min(3, Math.max(0, Math.round(row.scrollLeft / (step + 12)))));
    setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 4);
  };
  const goTo = (i) => {
    const row = rowRef.current;
    const card = row?.children[i];
    if (card) row.scrollTo({ left: card.offsetLeft - row.firstElementChild.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div>
    {/* Phones ("Swipeable row", picked from previews): the four cards in one row you swipe sideways, each ~80% wide so the
        next one peeks in, snapping card by card, with dots underneath. Four full-width stacked cards looked empty.
        From sm up: the usual 2 / 4-column grid. */}
    <div
      ref={rowRef}
      onScroll={onScroll}
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
        // -my-1 / py-1: the cards' 1px edge ring sits just outside them, and a scroller crops anything outside its box —
        // without this room the top and bottom edges were cut off
        'max-sm:-mx-3 max-sm:-my-1 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-3 max-sm:gap-3 max-sm:overflow-x-auto max-sm:px-3 max-sm:py-1 max-sm:scrollbar-none',
        // A soft fade on the right edge while more cards wait there (gone on the last card)
        !atEnd && 'max-sm:[mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]',
        // No drop shadow in the swipe row (it read as a smudge under the cards), but keep the card edge — the top
        // highlight + 1px edge ring that every other card has (they're part of the same shadow-card)
        'max-sm:[&>*]:w-[80%] max-sm:[&>*]:shrink-0 max-sm:[&>*]:snap-start max-sm:[&>*]:shadow-[inset_0_1px_0_0_var(--ln-glass-highlight),0_0_0_1px_var(--ln-glass-edge)]',
      )}
    >
      <Stat
        tone="blue"
        icon={Layers}
        label="Programs"
        value={<CountUp value={programs.total} />}
        note={`${programs.completed} of ${programs.total} completed`}
        progress={{ value: programs.completed, total: programs.total, label: 'of programs completed' }}
      />
      <Stat
        tone="cyan"
        icon={CalendarClock}
        label="Next 10 days"
        value={<CountUp value={upcoming.length} />}
        note={liveToday.length ? `${liveToday.length} live today` : 'None live today'}
        visual={<DayDots sessions={upcoming} />}
      />
      <Stat
        tone="violet"
        icon={IndianRupee}
        label="Billing"
        value={<CountUp value={billing.invoiced} format={formatRupeesCompact} />}
        note={`${formatRupeesCompact(billing.received)} collected`}
        progress={{ value: billing.received, total: billing.invoiced, label: 'of the invoiced amount collected' }}
      />
      <Stat
        tone="amber"
        icon={Hourglass}
        label="To approve"
        value={<CountUp value={pending} />}
        note={
          pending ? (
            <Link
              to={APPROVALS_PATH}
              className="inline-flex items-center gap-1 rounded font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Review queue
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : (
            'Nothing waiting'
          )
        }
        progress={{ value: pending, total: programs.total, label: 'of all programs waiting for approval' }}
      />
    </div>
    {/* Dots (phones only): which card is showing; tap one to jump to it */}
    <div className="mt-2.5 flex justify-center gap-1.5 sm:hidden" role="tablist" aria-label="Key numbers">
      {['Programs', 'Next 10 days', 'Billing', 'To approve'].map((name, i) => (
        <button
          key={name}
          type="button"
          role="tab"
          aria-selected={current === i}
          aria-label={name}
          onClick={() => goTo(i)}
          className={cn('h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', current === i ? 'w-5 bg-primary' : 'w-1.5 bg-text-muted/30')}
        />
      ))}
    </div>
    </div>
  );
}

// Soft pastel accent per card (static class names so Tailwind can see them) — low opacity on purpose
const TONES = {
  blue: {
    wash: 'from-chart-1/[0.09]',
    tile: 'bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-chart-1/15',
    dot: 'bg-chart-1',
    track: 'bg-chart-1/10',
    fill: 'bg-chart-1/45',
  },
  cyan: {
    wash: 'from-chart-2/[0.10]',
    tile: 'bg-gradient-to-br from-chart-2/20 to-chart-2/5 text-info ring-chart-2/20',
    dot: 'bg-chart-2',
    track: 'bg-chart-2/10',
    fill: 'bg-chart-2/45',
  },
  violet: {
    wash: 'from-chart-4/[0.085]',
    tile: 'bg-gradient-to-br from-chart-4/15 to-chart-4/5 text-chart-4 ring-chart-4/15',
    dot: 'bg-chart-4',
    track: 'bg-chart-4/10',
    fill: 'bg-chart-4/45',
  },
  amber: {
    wash: 'from-chart-3/[0.11]',
    tile: 'bg-gradient-to-br from-chart-3/25 to-chart-3/5 text-warning ring-chart-3/25',
    dot: 'bg-chart-3',
    track: 'bg-chart-3/12',
    fill: 'bg-chart-3/55',
  },
};

/**
 * One stat card: icon + label, the number and its note. `progress` = { value, total, label } turns the bottom accent
 * line into a soft hairline filled to value / total, with the % at the end of the note line; `visual` sits in the
 * bottom-right corner instead (Next 10 days' dots).
 */
function Stat({ tone, icon: Icon, label, value, note, progress, visual }) {
  const t = TONES[tone];
  const on = useMounted();
  const pct = progress ? percent(progress.value, progress.total) : 0;
  return (
    <Card padding="none" className="@container/kpi relative min-w-0 overflow-hidden px-5 pb-5 pt-5 sm:px-6">
      {/* Soft colour wash from the top-left */}
      <span className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent', t.wash)} aria-hidden="true" />
      {/* Only a card with a share to show gets a bottom line (a plain accent line here would read as data) */}
      {progress && (
        // The bottom edge as a hairline progress: a faint track, filled softly to the share
        <span className={cn('absolute inset-x-0 bottom-0 h-[3px]', t.track)} role="img" aria-label={`${pct}% ${progress.label}`}>
          <span
            className={cn('block h-full rounded-r-full transition-[width] duration-1000 ease-out motion-reduce:transition-none', t.fill)}
            style={{ width: on ? `${pct}%` : 0 }}
          />
        </span>
      )}

      <div className="relative flex items-center gap-2.5">
        <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset', t.tile)}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="truncate text-[13px] font-semibold text-text-secondary">{label}</span>
      </div>
      <p className="relative mt-3 whitespace-nowrap text-[28px] font-bold leading-9 tracking-tight tabular-nums text-text">{value}</p>
      <p className="relative mt-1 flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
        <span className={cn('size-1.5 shrink-0 rounded-full', t.dot)} aria-hidden="true" />
        <span className="truncate">{note}</span>
        {progress && (
          <span className="ml-auto shrink-0 pl-2 font-semibold tabular-nums text-text-secondary" aria-hidden="true">
            {pct}%
          </span>
        )}
      </p>
      {/* A corner visual sits bottom-right, clear of the number and note */}
      {visual && <div className="absolute bottom-5 right-5 sm:right-6">{visual}</div>}
    </Card>
  );
}

/* ------------------------------------------------------------ visuals */

/** True one frame after mount — lets the hairlines / dots animate from empty to their value */
function useMounted() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    // A timer, not requestAnimationFrame: rAF is paused in background tabs, which would leave them empty
    const id = setTimeout(() => setOn(true), 30);
    return () => clearTimeout(id);
  }, []);
  return on;
}

/**
 * Next 10 days as a muted dot calendar: a column per day (tomorrow first) with a dot per session (3 max) over its initial.
 * On narrow cards (4 across on ~1280px screens) the dots tighten so they stay clear of the note.
 */
function DayDots({ sessions }) {
  const on = useMounted();
  const today = new Date();
  const days = Array.from({ length: 10 }, (_, i) => {
    const date = addDays(today, i + 1);
    return { date, n: sessions.filter((s) => isSameDay(s.date, date)).length };
  });
  const total = days.reduce((a, d) => a + d.n, 0);
  return (
    <ol className="flex items-end gap-0.5 @max-[13rem]/kpi:gap-px" aria-label={`${total} sessions over the next 10 days`}>
      {days.map((d, i) => (
        <li key={i} className="flex w-2 flex-col items-center gap-1.5 @max-[13rem]/kpi:w-1.5">
          <span className="flex flex-col-reverse gap-0.5">
            {d.n === 0 ? (
              <span className="size-2 rounded-full bg-text-muted/15 @max-[13rem]/kpi:size-1.5" />
            ) : (
              Array.from({ length: Math.min(3, d.n) }, (_, k) => (
                <span
                  key={k}
                  className={cn(
                    'size-2 rounded-full bg-chart-2/45 @max-[13rem]/kpi:size-1.5 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none',
                    on ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                  )}
                  style={{ transitionDelay: `${i * 40 + k * 60}ms` }}
                />
              ))
            )}
          </span>
          <span className={cn('text-[10px] font-medium leading-none', i === 0 ? 'text-text-secondary' : 'text-text-muted/80')} aria-hidden="true">
            {d.date.toLocaleDateString('en-GB', { weekday: 'narrow' })}
          </span>
          <span className="sr-only">
            {formatDate(d.date, { weekday: 'short', year: undefined })}: {d.n} session{d.n === 1 ? '' : 's'}
          </span>
        </li>
      ))}
    </ol>
  );
}
