import { Fragment } from 'react';
import { AlertCircle, ArrowRight, Check, CircleCheck, Circle, Clock, Hourglass, LayoutList, Lock, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card } from '@/components/ui';
import { CopyButton } from '@/shared/clients/detail/CopyButton';
import { daysBetween, daysFromToday, longDate, relDayBoth, shortDate } from '../components/projectMeta';
import { CHAPTER_ICONS, firstOpenStep } from './workspaceMeta';

const KPI_TILE = {
  primary: 'bg-chart-1/10 text-chart-1',
  success: 'bg-success-main/12 text-success',
  violet: 'bg-chart-4/10 text-chart-4',
  warning: 'bg-chart-3/15 text-warning',
};

/** A step's state as a small icon (Up next) */
export function StateIcon({ state, className = 'size-5' }) {
  if (state === 'done') return <CircleCheck className={cn(className, 'text-success')} aria-hidden="true" />;
  if (state === 'overdue') return <AlertCircle className={cn(className, 'text-danger')} aria-hidden="true" />;
  if (state === 'due') return <Clock className={cn(className, 'text-warning')} aria-hidden="true" />;
  if (state === 'locked') return <Lock className={cn(className, 'text-text-muted')} aria-hidden="true" />;
  return <Circle className={cn(className, 'text-text-muted')} aria-hidden="true" />;
}

const Heading = ({ children }) => <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">{children}</h3>;

const DOT = {
  done: 'bg-primary/70',
  overdue: 'bg-danger-main',
  due: 'bg-warning-main',
  locked: 'bg-text-muted/15',
  todo: 'border-[1.5px] border-text-muted/40',
};

/**
 * Overview: four numbers (each opens its section), then one card — what's up next, the program's details, its key dates
 * and the setup by chapter.
 */
export function OverviewTab({ ws, onOpen }) {
  const { program: pg, project, chapters, progress, next, timeline, journey } = ws;
  const firstWork = chapters.find((c) => c.key !== 'after' && c.steps.some((s) => s.state !== 'done' && s.state !== 'locked')) ?? chapters[0];
  const toGo = daysFromToday(pg.start);
  const runningDay = daysBetween(pg.start, new Date()) + 1;

  const kpis = [
    { value: `${progress.pct}%`, label: 'Setup done', icon: CircleCheck, tone: 'primary', open: () => onOpen(firstWork.key) },
    { value: pg.participants, label: 'Participants', icon: Users, tone: 'success', open: () => onOpen('people') },
    { value: journey.length, label: 'Journey steps', icon: LayoutList, tone: 'violet', open: () => onOpen('journey') },
    {
      value: pg.status === 'upcoming' ? toGo : pg.status === 'in-progress' ? `Day ${runningDay}` : '✓',
      label: pg.status === 'upcoming' ? 'Days to go' : pg.status === 'in-progress' ? 'Running now' : 'Delivered',
      icon: Hourglass,
      tone: 'warning',
      open: () => onOpen('golive'),
    },
  ];

  const details = [
    { label: 'Program type', value: pg.type },
    { label: 'Delivered by', value: pg.subEntity, title: pg.entity },
    { label: 'Facilitator', value: pg.facilitator?.name },
    {
      label: 'Opportunity',
      value: (
        <span className="group inline-flex items-center gap-1">
          <span className="font-mono">OPP-{pg.oppId}</span>
          <CopyButton text={`OPP-${pg.oppId}`} label="opportunity ID" />
        </span>
      ),
    },
    { label: 'Starts', value: longDate(pg.start), title: relDayBoth(daysFromToday(pg.start)) },
    { label: 'Ends', value: longDate(pg.end), title: relDayBoth(daysFromToday(pg.end)) },
    { label: 'Cohort', value: pg.cohort },
    { label: 'Project', value: project.name },
  ];

  const firstFuture = timeline.findIndex((t) => !t.past);
  const showToday = firstFuture > 0;

  return (
    <div className="flex flex-col gap-5 lg:flex-1">
      <Card padding="none" className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        {kpis.map((k, i) => (
          <button
            key={k.label}
            type="button"
            onClick={k.open}
            className={cn(
              'flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-sunken/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:px-5',
              i % 2 === 1 && 'border-l border-border',
              i >= 2 && 'max-lg:border-t lg:border-l',
              'border-border',
            )}
          >
            <span className={cn('hidden size-10 shrink-0 items-center justify-center rounded-xl sm:inline-flex', KPI_TILE[k.tone])}>
              <k.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-bold tabular-nums text-text">{k.value}</span>
              <span className="block truncate text-xs text-text-secondary">{k.label}</span>
            </span>
          </button>
        ))}
      </Card>

      <Card tint="primary" subtleTint padding="none" flatOnMobile className="divide-y divide-dashed divide-border-strong lg:flex-1">
        <section className="px-5 py-5 sm:px-6">
          <Heading>Up next</Heading>
          {next ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StateIcon state={next.state} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{next.label}</p>
                <p className="text-xs text-text-secondary">
                  {next.chapter.label}
                  {(next.state === 'due' || next.state === 'overdue') && <span className={next.state === 'overdue' ? 'text-danger' : 'text-warning'}> · {next.note}</span>}
                </p>
              </div>
              <Button size="xs" rightIcon={ArrowRight} onClick={() => onOpen(next.chapter.key, next.key)}>
                Open step
              </Button>
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-2.5 text-sm font-medium text-text">
              <CircleCheck className="size-5 text-success" aria-hidden="true" />
              Every setup step is done — this program is ready.
            </p>
          )}
        </section>

        <section className="px-5 py-5 sm:px-6">
          <Heading>Program details</Heading>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <div key={d.label} className="min-w-0">
                <dt className="text-xs font-medium text-text-secondary">{d.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium text-text" title={d.title}>
                  {d.value || d.value === 0 ? d.value : '—'}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid grid-cols-1 divide-dashed divide-border-strong max-lg:divide-y lg:grid-cols-2 lg:divide-x">
          <section className="px-5 py-5 sm:px-6">
            <Heading>Key dates</Heading>
            <ol className="relative mt-3">
              <span className="absolute bottom-5 left-[7px] top-5 w-px bg-border-strong" aria-hidden="true" />
              {timeline.map((t, i) => (
                <Fragment key={t.label}>
                  {showToday && i === firstFuture && (
                    <li className="relative flex h-6 items-center gap-2" aria-label="Today">
                      <span className="relative z-10 ml-[4px] size-[7px] rounded-full bg-primary" aria-hidden="true" />
                      <span className="h-px flex-1 bg-primary/30" aria-hidden="true" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary-text">Today</span>
                    </li>
                  )}
                  <li className={cn('relative flex h-10 items-center gap-3', t.past && 'opacity-55')}>
                    <span className="relative z-10 flex w-[15px] shrink-0 justify-center">
                      {t.past ? (
                        <span className="inline-flex size-[15px] items-center justify-center rounded-full bg-text-muted/20 text-text-secondary">
                          <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                        </span>
                      ) : t.key ? (
                        <span className="size-[11px] rounded-full bg-primary ring-4 ring-primary-soft" />
                      ) : (
                        <span className="size-[9px] rounded-full border-[1.5px] border-text-muted/50 bg-surface dark:bg-surface-secondary" />
                      )}
                    </span>
                    <span className="w-12 shrink-0 text-xs tabular-nums text-text-secondary">{shortDate(t.date)}</span>
                    <span className={cn('min-w-0 flex-1 truncate text-[13px] text-text', t.key && 'font-semibold')}>{t.label}</span>
                    <span className={cn('shrink-0 text-xs', t.key && !t.past ? 'font-semibold text-primary-text' : 'text-text-muted')}>{t.past ? 'Done' : relDayBoth(daysFromToday(t.date))}</span>
                  </li>
                </Fragment>
              ))}
            </ol>
          </section>

          <section className="px-5 py-5 sm:px-6">
            <Heading>Setup by chapter</Heading>
            <ul className="mt-3 flex flex-col">
              {chapters
                .filter((c) => c.key !== 'after')
                .map((c) => {
                  const Icon = CHAPTER_ICONS[c.key];
                  const doneN = c.steps.filter((s) => s.state === 'done').length;
                  const complete = doneN === c.steps.length;
                  const due = c.steps.find((s) => s.state === 'overdue' || s.state === 'due');
                  const allLocked = c.steps.every((s) => s.state === 'locked' || s.state === 'done') && !complete;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => onOpen(c.key, firstOpenStep(c))}
                        title={due ? `${due.label} · ${due.note}` : allLocked ? 'Unlocks later' : undefined}
                        className="-mx-2 flex h-10 w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-primary/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      >
                        <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-text">{c.label}</span>
                        <span className="flex items-center gap-1" aria-hidden="true">
                          {c.steps.map((s) => (
                            <span key={s.key} className={cn('size-2.5 rounded-full', DOT[s.state])} />
                          ))}
                        </span>
                        <span className={cn('w-8 text-right text-xs tabular-nums', complete ? 'font-semibold text-success' : 'text-text-secondary')}>
                          {doneN}/{c.steps.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
}
