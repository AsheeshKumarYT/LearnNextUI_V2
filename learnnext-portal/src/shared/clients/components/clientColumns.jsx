import { Link } from 'react-router-dom';
import { ArrowRight, Pencil, Phone } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { Avatar, IconButton, StatusBadge } from '@/components/ui';
import { ClientLogo } from './ClientLogo';

/** Company code as a quiet monospace chip — easy to scan and to read out on a call */
export function CodeChip({ code }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md bg-surface-sunken px-2 font-mono text-xs font-semibold tracking-wide text-text-secondary ring-1 ring-inset ring-border-strong">
      {code}
    </span>
  );
}

/** Mobile number as plain text with a phone icon */
export function MobileNumber({ mobile }) {
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums text-text">
      <Phone className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      {mobile}
    </span>
  );
}

/** Column set for DataTable (shape documented in src/components/ui/DataTable.jsx). `onEdit(client)` powers the edit button. */
export function clientColumns({ onEdit }) {
  return [
    {
      key: 'name',
      header: 'Company',
      primary: true,
      sortable: true,
      hideable: false,
      cell: (c) => (
        <div className="relative flex min-w-0 items-center gap-3">
          {/* Row hover (row-hover: off while on the edit button): a slim accent bar grows on the left edge and the name turns blue */}
          <span
            className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
            aria-hidden="true"
          />
          <ClientLogo client={c} />
          <div className="min-w-0">
            {/* The name is a real link (keyboard / open in new tab); the whole row is clickable too */}
            <Link
              to={`/clients/${c.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title={c.name}
            >
              {c.name}
            </Link>
            <p className="truncate text-xs text-text-muted">
              {c.industry} · {c.city}
            </p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: 'Code', sortable: true, cell: (c) => <CodeChip code={c.code} /> },
    { key: 'mobile', header: 'Mobile', hideBelow: 'lg', cell: (c) => <MobileNumber mobile={c.mobile} /> },
    {
      key: 'createdBy',
      header: 'Created by',
      sortable: true,
      hideBelow: 'xl',
      cell: (c) => (
        <span className="inline-flex min-w-0 items-center gap-2">
          <Avatar name={c.createdBy} size="xs" />
          <span className="truncate text-[13px]">{c.createdBy}</span>
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created on',
      sortable: true,
      // Least important columns drop out first as the table narrows, so Edit never gets pushed out of view
      hideBelow: '2xl',
      accessor: (c) => new Date(c.createdAt),
      cell: (c) => (
        <span className="text-[13px] tabular-nums" title={formatRelative(c.createdAt)}>
          {formatDate(c.createdAt)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, cell: (c) => <StatusBadge status={c.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      hideable: false,
      width: 88,
      cell: (c) => (
        <span className="inline-flex items-center gap-1">
          <span data-row-action onClick={(e) => e.stopPropagation()}>
            <IconButton icon={Pencil} label={`Edit ${c.name}`} size="sm" variant="ghost" onClick={() => onEdit(c)} />
          </span>
          {/* "Go inside" cue — slides in on row hover */}
          <span
            className="inline-flex size-7 -translate-x-1.5 items-center justify-center rounded-full bg-primary-soft text-primary-text opacity-0 transition-[opacity,transform] duration-300 ease-out row-hover:translate-x-0 row-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowRight className="size-3.5" />
          </span>
        </span>
      ),
    },
  ];
}
