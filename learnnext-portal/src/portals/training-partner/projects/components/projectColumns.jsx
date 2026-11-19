import { Archive, Building2, Link2, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/formatDate';
import { Avatar, Dropdown, IconButton, StatusBadge, Tooltip } from '@/components/ui';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { byStart, dateTimeLabel, personLabel, programStatusText, projectProgress, shortDate } from './projectMeta';

// A program's dot on the row's timeline: delivered = solid green, running = solid blue with a halo, upcoming = hollow
// ring, needs action = solid amber with a breathing halo
const dotClass = (pg) =>
  pg.status === 'completed'
    ? 'border-success-main bg-success-main'
    : pg.status === 'in-progress'
      ? 'border-chart-1 bg-chart-1 ring-[3px] ring-chart-1/15'
      : pg.needsAction
        ? 'border-warning-main bg-warning-main ring-[3px] ring-warning-main/20 motion-safe:animate-pulse'
        : 'border-info bg-surface';

/** The Programs cell: a dot per program in date order (3 + "+N" when there are more than 4) and a short summary */
export function ProgramsCell({ project }) {
  const list = byStart(project.programs);
  const nextIdx = list.findIndex((g) => g.status !== 'completed');
  let shown = list;
  let rest = [];
  if (list.length > 4) {
    // A window of 3 starting one before the first program that isn't delivered yet
    const from = Math.max(0, Math.min((nextIdx < 0 ? list.length : nextIdx) - 1, list.length - 3));
    shown = list.slice(from, from + 3);
    rest = list.filter((g) => !shown.includes(g));
  }
  const next = nextIdx >= 0 ? list[nextIdx] : null;
  const n = list.length;

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* A fixed width keeps the summaries lined up in the table; phone cards (narrow cells) let it shrink to its dots */}
      <ol aria-label="Programs, in date order" className="flex shrink-0 items-center md:w-[5.75rem]">
        {shown.map((g, i) => (
          <li key={g.id} className="flex items-center">
            {i > 0 && <span className={cn('h-px w-3', shown[i - 1].status === 'completed' ? 'bg-success-main/60' : 'bg-border-strong')} aria-hidden="true" />}
            <Tooltip content={`${g.program} · ${programStatusText(g)}`}>
              <span tabIndex={0} className={cn('block size-3 rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', dotClass(g))}>
                <span className="sr-only">{`${g.program} · ${programStatusText(g)}`}</span>
              </span>
            </Tooltip>
          </li>
        ))}
        {rest.length > 0 && (
          <li className="ml-1.5 flex items-center">
            <Tooltip content={`${rest.length} more: ${rest.map((g) => g.program).join(', ')}`}>
              <span
                tabIndex={0}
                className="inline-flex h-[18px] items-center rounded-full bg-surface-sunken px-1.5 text-[10px] font-semibold text-text-secondary ring-1 ring-inset ring-border-strong"
              >
                +{rest.length}
              </span>
            </Tooltip>
          </li>
        )}
      </ol>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text">
          {n} program{n === 1 ? '' : 's'}
        </p>
        <p className="max-w-[12rem] truncate text-xs text-text-muted">{!next ? 'All delivered' : next.status === 'in-progress' ? 'Running now' : `Next · ${shortDate(next.start)}`}</p>
      </div>
    </div>
  );
}

/** The row's "…" menu */
const menuItems = (p, actions) => [
  { label: 'Add a program', icon: Plus, onSelect: () => actions.onAddProgram(p) },
  { label: 'Open client', icon: Building2, onSelect: () => actions.onOpenClient(p) },
  { label: 'Copy link', icon: Link2, onSelect: () => actions.onCopyLink(p) },
  { type: 'separator' },
  { label: 'Archive', icon: Archive, danger: true, onSelect: () => actions.onArchive(p) },
];

/** Column set for the projects DataTable. `userName` shows as "You"; actions = { onAddProgram, onOpenClient, onCopyLink, onArchive } */
export function projectColumns({ userName, ...actions }) {
  return [
    {
      key: 'name',
      header: 'Project',
      primary: true,
      sortable: true,
      hideable: false,
      cell: (p) => (
        <div className="relative flex min-w-0 items-center gap-3">
          <span
            className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
            aria-hidden="true"
          />
          <ClientLogo client={p.client} size="md" />
          <div className="min-w-0">
            <p className="max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={p.name}>
              {p.name}
            </p>
            <p className="truncate text-xs text-text-muted">{p.client.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'programs', header: 'Programs', sortable: true, accessor: (p) => p.programs.length, cell: (p) => <ProgramsCell project={p} /> },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      hideBelow: 'lg',
      accessor: (p) => projectProgress(p).pct,
      cell: (p) => {
        const pr = projectProgress(p);
        return (
          <span className="text-sm font-semibold tabular-nums text-text" title={`${pr.text} · ${pr.sub}`}>
            {pr.pct}%
          </span>
        );
      },
    },
    { key: 'stage', header: 'Status', sortable: true, accessor: (p) => ['in-setup', 'live', 'completed'].indexOf(p.stage), cell: (p) => <StatusBadge status={p.stage} /> },
    {
      key: 'owner',
      header: 'Owner',
      sortable: true,
      hideBelow: 'xl',
      cell: (p) => (
        <span className="inline-flex min-w-0 items-center gap-2">
          <Avatar name={p.owner} size="xs" />
          <span className="truncate text-[13px]">{personLabel(p.owner, userName)}</span>
        </span>
      ),
    },
    {
      key: 'modifiedAt',
      header: 'Last updated',
      sortable: true,
      hideBelow: 'xl',
      accessor: (p) => new Date(p.modifiedAt),
      cell: (p) => (
        <span className="text-[13px] tabular-nums text-text-secondary" title={dateTimeLabel(p.modifiedAt)}>
          {formatRelative(p.modifiedAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      hideable: false,
      width: 56,
      cell: (p) => (
        <span data-row-action onClick={(e) => e.stopPropagation()} className="inline-flex">
          <Dropdown items={menuItems(p, actions)} trigger={<IconButton icon={MoreHorizontal} label={`Actions for ${p.name}`} size="sm" variant="ghost" />} />
        </span>
      ),
    },
  ];
}
