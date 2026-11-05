import { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarClock,
  CalendarX2,
  ChevronDown,
  ClipboardList,
  FileCheck,
  FilePlus,
  FileUp,
  Flame,
  FolderPlus,
  Image,
  KeyRound,
  LogIn,
  Palette,
  Pencil,
  ReceiptText,
  Rocket,
  Settings2,
  ShieldAlert,
  Smartphone,
  ToggleRight,
  Trophy,
  TrendingDown,
  TrendingUp,
  UserCog,
  UserPen,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, formatDate, formatTime, isSameDay, startOfDay } from '@/utils/formatDate';
import { formatCurrency, formatRupeesCompact } from '@/utils/formatNumber';
import { Button, Card, CardHeader, DateRangePicker, Select } from '@/components/ui';
import { EmptyState, ErrorState, Skeleton } from '@/components/feedback';

const PAGE = 8;

// Soft tinted tiles per tone (static class names so Tailwind can see them)
const TONES = {
  blue: { tile: 'bg-chart-1/10 text-chart-1 ring-chart-1/20', dot: 'bg-chart-1' },
  violet: { tile: 'bg-chart-4/10 text-chart-4 ring-chart-4/20', dot: 'bg-chart-4' },
  cyan: { tile: 'bg-chart-2/12 text-info ring-chart-2/25', dot: 'bg-chart-2' },
  green: { tile: 'bg-success-main/12 text-success ring-success-main/25', dot: 'bg-success-main' },
  amber: { tile: 'bg-chart-3/15 text-warning ring-chart-3/30', dot: 'bg-chart-3' },
};
// The profile's modules (default). Pass your own `modules` ({ key: { label, tone } }) for other activity feeds.
const PROFILE_MODULES = {
  projects: { label: 'Projects', tone: 'blue' },
  finance: { label: 'Finance', tone: 'violet' },
  content: { label: 'Content', tone: 'cyan' },
  security: { label: 'Security', tone: 'green' },
  profile: { label: 'Profile', tone: 'amber' },
};
const KIND_ICONS = {
  signin: LogIn,
  newdevice: Smartphone,
  approve: BadgeCheck,
  create: FolderPlus,
  publish: Rocket,
  assign: UserPlus,
  credit: ReceiptText,
  debit: FilePlus,
  complete: Trophy,
  einvoice: FileCheck,
  survey: ClipboardList,
  profile: UserPen,
  upload: FileUp,
  reschedule: CalendarClock,
  password: KeyRound,
  avatar: Image,
  cover: Palette,
  // Client activity
  client: Building2,
  edit: Pencil,
  status: ToggleRight,
  settings: Settings2,
  paid: Wallet,
  access: UserCog,
};
const RANGE_PRESETS = [
  { key: 'today', label: 'Today', days: 1 },
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
];
// Heatmap intensity steps (0 = no activity)
// (empty days a faint grey that still reads on the tinted panel)
const HEAT = ['bg-text-muted/[0.1]', 'bg-primary/20', 'bg-primary/40', 'bg-primary/65', 'bg-primary'];
const level = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 4 ? 2 : n <= 6 ? 3 : 4);

function dayLabel(date) {
  const now = new Date();
  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, addDays(now, -1))) return 'Yesterday';
  const sameYear = new Date(date).getFullYear() === now.getFullYear();
  return formatDate(date, { weekday: 'short', year: sameYear ? undefined : 'numeric' });
}

/**
 * An activity feed: a light summary panel (this week + 12-week heatmap) beside a day-grouped timeline, filtered by
 * type and a from–to date range. Used for "My activity" (profile, the defaults) and a client's Activity History.
 * data = { entries: [{ id, module, kind, verb, entity, detail, at, amount?, alert? }] newest first, heat: [{ date, count }] }.
 * `modules` = { key: { label, tone: blue|violet|cyan|green|amber } } — the type filter and tile colours.
 * `summaryStickyClassName` = how far below the top the summary pins while scrolling (more under a sticky tab bar).
 * `showHeatmap={false}` swaps the summary for a period one (client page): one window — the picked date range or the last 30 days —
 * with its total, a neutral comparison and per-type counts that filter the timeline.
 * `onSecure` opens the password flow from an unfamiliar sign-in (profile only).
 * `lightTint` = a lighter colour wash on the card and its summary panel (the profile page).
 */
export function ActivityTimeline({
  data,
  loading,
  error,
  onRetry,
  onSecure,
  title = 'My activity',
  icon = Activity,
  // Phones get the short line (long sub-texts wrapped to two lines there)
  description = (
    <>
      <span className="sm:hidden">Your latest actions.</span>
      <span className="max-sm:hidden">Everything you’ve done across LearnNext, newest first.</span>
    </>
  ),
  count,
  modules: moduleDefs = PROFILE_MODULES,
  summaryStickyClassName = 'lg:top-[calc(var(--app-header-h)+2rem)]',
  showHeatmap = true,
  lightTint = false,
  hideHeaderOnMobile = false, // phones: no header (e.g. inside a tab that already names it)
  className,
}) {
  const MODULES = useMemo(() => Object.fromEntries(Object.entries(moduleDefs).map(([k, m]) => [k, { ...m, ...TONES[m.tone] }])), [moduleDefs]);
  const [type, setType] = useState('all');
  const [range, setRange] = useState(null); // { from, to } — null = all time
  const [visible, setVisible] = useState(PAGE);
  const entries = data?.entries ?? [];

  const filtered = useMemo(() => {
    const from = range?.from && startOfDay(range.from).getTime();
    const to = range?.to && addDays(startOfDay(range.to), 1).getTime(); // inclusive end day
    return entries.filter((e) => {
      const t = new Date(e.at).getTime();
      return (type === 'all' || e.module === type) && (!from || t >= from) && (!to || t < to);
    });
  }, [entries, type, range]);

  const shown = filtered.slice(0, visible);
  const groups = useMemo(() => {
    const out = [];
    shown.forEach((e) => {
      const label = dayLabel(e.at);
      if (out.at(-1)?.label === label) out.at(-1).items.push(e);
      else out.push({ label, items: [e] });
    });
    return out;
  }, [shown]);

  const typeOptions = [
    { value: 'all', label: 'All activity' },
    ...Object.entries(MODULES)
      .filter(([k]) => entries.some((e) => e.module === k))
      .map(([value, m]) => ({ value, label: m.label })),
  ];
  const filteredBy = type !== 'all' || range;
  const clear = () => {
    setType('all');
    setRange(null);
    setVisible(PAGE);
  };

  return (
    <Card tint="violet" softTint={lightTint} padding="none" className={className}>
      <CardHeader
        divided
        icon={icon}
        iconTone="violet"
        title={
          <>
            {title}
            {count != null && <span className="ml-1.5 text-sm font-medium tabular-nums text-text-muted">{count}</span>}
          </>
        }
        description={description}
        className={cn(hideHeaderOnMobile && 'max-sm:hidden')}
      />

      {error && !data ? (
        <ErrorState compact title="Couldn’t load your activity" description={error.message} onRetry={onRetry} />
      ) : !data ? (
        <ActivitySkeleton />
      ) : (
        <div className={cn('grid gap-6 px-5 pb-6 sm:px-6 lg:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] lg:gap-10', hideHeaderOnMobile && 'max-sm:pt-5')}>
          {showHeatmap ? (
            <Summary heat={data.heat} entries={entries} modules={MODULES} stickyClassName={summaryStickyClassName} lightTint={lightTint} showHeat />
          ) : (
            <PeriodSummary
              entries={entries}
              modules={MODULES}
              range={range}
              type={type}
              onType={(t) => {
                setType(t);
                setVisible(PAGE);
              }}
              stickyClassName={summaryStickyClassName}
              lightTint={lightTint}
            />
          )}

          <div className={cn('min-w-0 transition-opacity', loading && 'opacity-60')} aria-busy={loading}>
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-text-muted" aria-live="polite">
                <span className="font-semibold tabular-nums text-text">{filtered.length}</span> {filtered.length === 1 ? 'activity' : 'activities'}
                {range?.from ? ' in this period' : ''}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  aria-label="Activity type"
                  options={typeOptions}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setVisible(PAGE);
                  }}
                  className="w-full sm:w-40"
                />
                <DateRangePicker
                  value={range}
                  onChange={(r) => {
                    setRange(r);
                    setVisible(PAGE);
                  }}
                  placeholder="From – To"
                  presets={RANGE_PRESETS}
                  align="end"
                  className="w-full sm:w-56"
                />
                {filteredBy && (
                  <Button variant="ghost" size="sm" leftIcon={X} onClick={clear}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {groups.length === 0 ? (
              <EmptyState
                compact
                icon={CalendarX2}
                title="No activity in this view"
                description="Try a different date range or activity type."
                action={
                  <Button variant="soft" size="sm" onClick={clear}>
                    Show all activity
                  </Button>
                }
                className="mt-4"
              />
            ) : (
              <div className="mt-6 flex flex-col gap-6">
                {groups.map((g) => (
                  <section key={g.label} aria-label={g.label}>
                    <h4 className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
                      {g.label}
                      <span className="rounded-full bg-surface-sunken px-1.5 text-[10px] tabular-nums">{g.items.length}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-border-strong to-transparent" aria-hidden="true" />
                    </h4>
                    <ol className="relative">
                      {/* Spine connecting the tiles */}
                      <span className="absolute bottom-6 left-[19px] top-6 w-px bg-border-strong" aria-hidden="true" />
                      {g.items.map((e, i) => (
                        <Entry key={e.id} entry={e} index={i} onSecure={onSecure} modules={MODULES} />
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            )}

            {filtered.length > visible && (
              <Button variant="soft" size="sm" rightIcon={ChevronDown} className="mt-4" onClick={() => setVisible((v) => v + PAGE)}>
                Show more
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function Entry({ entry: e, index, onSecure, modules }) {
  const m = modules[e.module] ?? Object.values(modules)[0];
  const Icon = (e.alert ? ShieldAlert : KIND_ICONS[e.kind]) ?? Activity;

  return (
    <li className="relative flex animate-rise items-start gap-4 py-3" style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}>
      {/* Solid backing so the spine doesn't show through the tinted tile */}
      <span className="relative z-[1] shrink-0 rounded-xl bg-surface" title={m.label}>
        <span className={cn('inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset', e.alert ? 'bg-warning-soft text-warning ring-warning/30' : m.tile)}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-[13px] leading-5 text-text-secondary">
            {e.verb} <span className="font-semibold text-text">{e.entity}</span>
          </p>
          <time dateTime={e.at} className="shrink-0 pt-px text-xs tabular-nums text-text-muted">
            {formatTime(e.at)}
          </time>
        </div>
        <p className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-text-muted">
          <span className="truncate">{e.detail}</span>
          {e.amount != null && (
            <span className="shrink-0 rounded-md bg-chart-4/10 px-1.5 py-px font-semibold tabular-nums text-chart-4" title={formatCurrency(e.amount, 'INR')}>
              {formatRupeesCompact(e.amount)}
            </span>
          )}
        </p>
        {e.alert && (
          <p className="mt-1 text-xs text-warning">
            Wasn’t you?{' '}
            <button
              type="button"
              onClick={onSecure}
              aria-haspopup="dialog"
              className="rounded font-semibold underline underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Secure your account
            </button>
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Light summary: this week vs last week, one line of highlights, the heatmap (12 weeks, or since the feed began if
 * that's shorter — so a new feed isn't a wall of empty days) and a by-type count for the last 30 days
 */
function Summary({ heat, entries, modules: MODULES, stickyClassName, lightTint, showHeat }) {
  const thisWeek = heat.slice(-7).reduce((s, d) => s + d.count, 0);
  const lastWeek = heat.slice(-14, -7).reduce((s, d) => s + d.count, 0);
  const change = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;
  let streak = 0;
  for (let i = heat.length - 1; i >= 0 && heat[i].count > 0; i--) streak++;

  const recent = entries.filter((e) => Date.now() - new Date(e.at).getTime() < 30 * 864e5);
  const byModule = recent.reduce((acc, e) => ({ ...acc, [e.module]: (acc[e.module] ?? 0) + 1 }), {});
  const ranked = Object.entries(byModule)
    .filter(([k]) => MODULES[k])
    .sort((a, b) => b[1] - a[1]);
  const top = ranked[0] && MODULES[ranked[0][0]];
  const full = heat.length >= 84;
  const span = full ? 'Last 12 weeks' : `Since ${formatDate(heat[0].date, { year: undefined })}`;

  // Monday-first rows: pad the start so each row is one weekday
  const offset = (new Date(heat[0].date).getDay() + 6) % 7;
  const cells = [...Array(offset).fill(null), ...heat];
  const weeks = Math.ceil(cells.length / 7);

  return (
    <div
      className={cn(
        'relative h-fit overflow-hidden rounded-2xl border border-border-strong bg-surface/50 bg-gradient-to-br via-transparent p-5 shadow-xs dark:bg-surface-secondary/50 max-sm:rounded-none max-sm:border-0 max-sm:border-b max-sm:border-dashed max-sm:bg-none max-sm:bg-transparent max-sm:px-0 max-sm:pb-4 max-sm:pt-0 max-sm:shadow-none max-sm:dark:bg-transparent lg:sticky lg:transition-[top] lg:duration-300 lg:ease-out',
        lightTint ? 'from-primary/[0.04] to-chart-4/[0.04]' : 'from-primary/[0.06] to-chart-4/[0.06]',
        stickyClassName,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">This week</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-[32px] font-bold leading-none tracking-tight tabular-nums text-text">{thisWeek}</span>
        <span className="pb-0.5 text-[13px] text-text-secondary">actions</span>
        {change != null && (
          <span
            className={cn('mb-0.5 ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold', change >= 0 ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger')}
            title={`${lastWeek} last week`}
          >
            {change >= 0 ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* Highlights on one quiet line instead of boxes (left out on the client page, which keeps the card minimal) */}
      {showHeat && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3.5 text-chart-5" aria-hidden="true" />
            {streak}-day streak
          </span>
          {top && (
            <span className="inline-flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', top.dot)} aria-hidden="true" />
              Mostly {top.label.toLowerCase()}
            </span>
          )}
        </p>
      )}

      {showHeat && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2.5 text-xs font-semibold text-text">{span}</p>
          <div
            className="grid grid-flow-col grid-rows-7 gap-1"
            // Cells grow up to 1.25rem; a short span stays compact on the left instead of stretching
            style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1.25rem))` }}
            role="img"
            aria-label={`Activity ${full ? 'over the last 12 weeks' : span.toLowerCase()}, ${thisWeek} actions this week`}
          >
            {cells.map((d, i) =>
              d ? (
                <span
                  key={d.date}
                  title={`${d.count} action${d.count === 1 ? '' : 's'} · ${formatDate(d.date, { weekday: 'short' })}`}
                  className={cn('aspect-square rounded-[3px]', HEAT[level(d.count)], i === cells.length - 1 && 'ring-2 ring-primary/50 ring-offset-1 ring-offset-surface')}
                />
              ) : (
                <span key={`pad-${i}`} />
              ),
            )}
          </div>
          <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-text-muted">
            Less
            {HEAT.map((c) => (
              <span key={c} className={cn('size-2 rounded-[2px]', c)} aria-hidden="true" />
            ))}
            More
          </div>
        </div>
      )}

      {/* What it was: count per type, last 30 days */}
      {ranked.length > 0 && (
        <div className={cn('border-t border-border', showHeat ? 'mt-4 pt-4' : 'mt-6 pt-5')}>
          <p className="mb-3 text-xs font-semibold text-text">Last 30 days</p>
          <ul className="space-y-2.5">
            {ranked.map(([k, n]) => (
              <li key={k} className="flex items-center gap-2.5 text-[13px] text-text-secondary">
                <span className={cn('size-2 shrink-0 rounded-full', MODULES[k].dot)} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{MODULES[k].label}</span>
                <span className="font-semibold tabular-nums text-text">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Period summary (used instead of Summary when the heatmap is off — the client page). One window for the whole card:
 * the date range picked in the toolbar, or the last 30 days. Shows how many activities happened in it, a neutral
 * comparison with the same-length period before, and the count per type (they add up to the total). Each type row
 * filters the timeline (click again to show all).
 */
function PeriodSummary({ entries, modules: MODULES, range, type, onType, stickyClassName, lightTint }) {
  const today = startOfDay(new Date());
  const from = range?.from ? startOfDay(range.from) : addDays(today, -29);
  const to = range?.from ? addDays(startOfDay(range.to ?? range.from), 1) : addDays(today, 1); // exclusive
  const length = Math.round((to - from) / 864e5);
  const label = range?.from ? `${formatDate(from, { year: undefined })} – ${formatDate(addDays(to, -1))}` : 'Last 30 days';
  const previous = range?.from ? 'the previous period' : 'the previous 30 days';

  const inPeriod = entries.filter((e) => {
    const t = new Date(e.at).getTime();
    return t >= from.getTime() && t < to.getTime();
  });
  const before = entries.filter((e) => {
    const t = new Date(e.at).getTime();
    return t >= addDays(from, -length).getTime() && t < from.getTime();
  }).length;
  const total = inPeriod.length;
  const diff = total - before;
  // No comparison when nothing happened before this period at all (e.g. a client added within it) — "19 more" would mislead
  const hasHistory = entries.some((e) => new Date(e.at).getTime() < from.getTime());
  const compare = !hasHistory ? null : diff === 0 ? `Same as ${previous}` : `${Math.abs(diff)} ${diff > 0 ? 'more' : 'fewer'} than ${previous}`;

  const byModule = inPeriod.reduce((acc, e) => ({ ...acc, [e.module]: (acc[e.module] ?? 0) + 1 }), {});
  const ranked = Object.entries(byModule)
    .filter(([k]) => MODULES[k])
    .sort((a, b) => b[1] - a[1]);

  return (
    <div
      className={cn(
        'relative h-fit overflow-hidden rounded-2xl border border-border-strong bg-surface/50 bg-gradient-to-br via-transparent p-5 shadow-xs dark:bg-surface-secondary/50 max-sm:rounded-none max-sm:border-0 max-sm:border-b max-sm:border-dashed max-sm:bg-none max-sm:bg-transparent max-sm:px-0 max-sm:pb-4 max-sm:pt-0 max-sm:shadow-none max-sm:dark:bg-transparent lg:sticky lg:transition-[top] lg:duration-300 lg:ease-out',
        lightTint ? 'from-primary/[0.04] to-chart-4/[0.04]' : 'from-primary/[0.06] to-chart-4/[0.06]',
        stickyClassName,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-[32px] font-bold leading-none tracking-tight tabular-nums text-text max-sm:text-[26px]">{total}</span>
        <span className="pb-0.5 text-[13px] text-text-secondary">{total === 1 ? 'activity' : 'activities'}</span>
      </div>
      {compare && <p className="mt-2 text-xs text-text-muted max-sm:mt-1">{compare}</p>}

      {/* Phones: no "By type" breakdown — it crowded the top, and the type filter right below covers it */}
      {ranked.length > 0 && (
        <div className="mt-6 border-t border-border pt-5 max-sm:hidden">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-text">By type</p>
            {type !== 'all' && (
              <button type="button" onClick={() => onType('all')} className="rounded px-1 text-xs font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Show all
              </button>
            )}
          </div>
          <ul className="-mx-2 space-y-0.5 max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-0.5 max-sm:space-y-0">
            {ranked.map(([k, n]) => {
              const on = type === k;
              return (
                <li key={k}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onType(on ? 'all' : k)}
                    title={on ? 'Show all activity' : `Show only ${MODULES[k].label.toLowerCase()}`}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      on ? 'bg-primary-soft text-primary-text' : 'text-text-secondary hover:bg-surface-sunken hover:text-text',
                      type !== 'all' && !on && 'opacity-60',
                    )}
                  >
                    <span className={cn('size-2 shrink-0 rounded-full', MODULES[k].dot)} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{MODULES[k].label}</span>
                    <span className={cn('font-semibold tabular-nums', on ? 'text-primary-text' : 'text-text')}>{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="grid gap-6 px-5 pb-6 sm:px-6 lg:grid-cols-[17.5rem_1fr] lg:gap-10" role="status" aria-label="Loading activity">
      <Skeleton className="h-72 rounded-2xl" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-80 max-w-[60%]" />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
