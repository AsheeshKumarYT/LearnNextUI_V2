import { Building2, Check, ChevronRight, Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar, Button, Drawer, StatusBadge } from '@/components/ui';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { byStart, daysFromToday, longDate, personLabel, projectProgress, rangeLabel, readyCount, relDay, shortDate } from './projectMeta';

const WASH = { 'in-setup': 'from-info-main/[0.10]', live: 'from-chart-1/[0.10]', completed: 'from-success-main/[0.10]' };

/** How a program reads in the drawer: its node on the timeline and its pill */
function programLook(pg) {
  if (pg.status === 'completed') return { node: 'done', pill: 'Delivered', pillClass: 'bg-success-soft text-success', line: 'bg-success-main/50' };
  if (pg.status === 'in-progress') return { node: 'live', pill: 'Running', pillClass: 'bg-primary-soft text-primary-text', line: 'bg-chart-1/40' };
  const ready = `${readyCount(pg)}/4 ready`;
  if (pg.needsAction) return { node: 'attention', pill: `Starts ${relDay(daysFromToday(pg.start))} · ${ready}`, pillClass: 'bg-warning-soft text-warning', line: 'bg-border-strong' };
  return { node: 'upcoming', pill: ready, pillClass: 'bg-surface-sunken text-text-secondary', line: 'bg-border-strong' };
}

/** The timeline node (20px) */
function Node({ kind }) {
  if (kind === 'done') {
    return (
      <span className="relative inline-flex size-5 items-center justify-center rounded-full bg-success-main text-white">
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  }
  if (kind === 'live') {
    return (
      <span className="relative inline-flex size-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-chart-1/25 motion-safe:animate-ping" aria-hidden="true" />
        <span className="relative inline-flex size-5 items-center justify-center rounded-full bg-chart-1/15 ring-1 ring-chart-1/30">
          <span className="size-2 rounded-full bg-chart-1" />
        </span>
      </span>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="var(--color-surface)" stroke={kind === 'attention' ? 'var(--ln-warning-main)' : 'var(--ln-info-main)'} strokeWidth="2.5" />
    </svg>
  );
}

/**
 * A project, opened from its row: who it's for, its status / dates / owner, and its programs as a timeline — each one
 * opens its workspace. `project` stays rendered while the drawer animates closed (the page passes the retained one).
 */
export function ProjectDrawer({ open, project: p, onClose, userName, onAddProgram, onOpenClient, onOpenProgram }) {
  if (!p) return null;
  const progress = projectProgress(p);
  const programs = byStart(p.programs);
  return (
    <Drawer open={open} onClose={onClose} header={false} size="lg" labelledBy="project-drawer-title">
      <div className="relative flex min-h-full flex-col">
        {/* Close: a round button that stays at the top right while the panel scrolls */}
        <div className="pointer-events-none sticky top-0 z-10 -mb-[3.25rem] flex justify-end px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="pointer-events-auto mt-4 inline-flex size-9 items-center justify-center rounded-full bg-surface/80 text-text-muted shadow-xs ring-1 ring-border/70 backdrop-blur transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className={cn('bg-gradient-to-b to-transparent px-5 pb-6 pt-7 sm:px-7', WASH[p.stage])}>
          <div className="flex items-center gap-4 pr-10">
            <ClientLogo client={p.client} size="lg" />
            <div className="min-w-0">
              <h2 id="project-drawer-title" className="text-lg font-semibold leading-6 text-text">
                {p.name}
              </h2>
              <p className="mt-0.5 truncate text-[13px] text-text-secondary">{p.client.name}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button leftIcon={Plus} onClick={() => onAddProgram(p)}>
              Add program
            </Button>
            <Button variant="secondary" leftIcon={Building2} className="border-text-muted/40" onClick={() => onOpenClient(p)}>
              Open client
            </Button>
          </div>
        </div>

        <dl className="mx-5 grid grid-cols-3 divide-x divide-border border-y border-border py-4 sm:mx-7">
          <div className="min-w-0 pr-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Status</dt>
            <dd className="mt-1.5">
              <StatusBadge status={p.stage} />
            </dd>
          </div>
          <div className="min-w-0 px-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{p.stage === 'completed' ? 'Ran' : 'Runs'}</dt>
            <dd className="mt-1.5 truncate text-[13px] font-medium text-text" title={`${longDate(p.start)} – ${longDate(p.end)}`}>
              {rangeLabel(p.start, p.end)}
            </dd>
          </div>
          <div className="min-w-0 pl-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Owner</dt>
            <dd className="mt-1.5 flex min-w-0 items-center gap-2 text-[13px] font-medium text-text">
              <Avatar name={p.owner} size="xs" />
              <span className="truncate">{personLabel(p.owner, userName)}</span>
            </dd>
          </div>
        </dl>

        <section className="flex-1 px-5 py-6 sm:px-7" aria-labelledby="project-drawer-programs">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 id="project-drawer-programs" className="text-[15px] font-semibold text-text">
              Programs <span className="font-medium text-text-muted">{programs.length}</span>
            </h3>
            <span className="text-xs font-medium text-text-secondary">{progress.text}</span>
          </div>
          <ol className="flex flex-col">
            {programs.map((pg, i) => {
              const look = programLook(pg);
              const last = i === programs.length - 1;
              return (
                <li key={pg.id} className="relative flex gap-3 pb-2 last:pb-0">
                  <div className="relative flex w-5 shrink-0 justify-center pt-3.5">
                    <Node kind={look.node} />
                    {!last && <span className={cn('absolute bottom-[-0.875rem] top-[2.375rem] w-0.5 rounded-full', look.line)} aria-hidden="true" />}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenProgram(p, pg)}
                    className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-left transition-[background-color,border-color,box-shadow] hover:border-border-strong hover:bg-surface hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:hover:bg-surface-secondary"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-text-secondary">{shortDate(pg.start)}</span>
                        <span className={cn('rounded-full px-2 py-px text-[11px] font-semibold', look.pillClass)}>{look.pill}</span>
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-text transition-colors group-hover:text-primary-text">{pg.program}</span>
                      <span className="mt-0.5 block truncate text-xs text-text-muted">
                        {pg.cohort} · {pg.type} · {pg.facilitator ? pg.facilitator.name : <em>No facilitator yet</em>}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary-text" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="border-t border-border px-5 py-4 text-xs text-text-muted sm:px-7">
          <span className="font-mono">{p.code}</span> · Created {longDate(p.createdAt)} by {personLabel(p.createdBy, userName)}
        </footer>
      </div>
    </Drawer>
  );
}
