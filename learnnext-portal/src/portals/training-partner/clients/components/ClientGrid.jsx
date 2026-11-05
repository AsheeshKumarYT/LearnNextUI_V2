import { Link } from 'react-router-dom';
import { CalendarDays, Pencil } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { Avatar, IconButton, StatusBadge } from '@/components/ui';
import { Skeleton } from '@/components/feedback';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { CodeChip, MobileNumber } from '@/shared/clients/components/clientColumns';

/** Grid view: one card per client — logo first, then the facts in the same order as the list columns. The whole card opens the client. */
export function ClientGrid({ clients, loading, onEdit }) {
  if (loading) {
    return (
      <ul className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:grid-cols-3" aria-label="Loading clients">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="rounded-card border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-14 rounded-2xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="mt-5 h-3 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:grid-cols-3">
      {clients.map((c) => (
        <li
          key={c.id}
          className="group relative flex min-w-0 flex-col rounded-card border border-border-strong bg-surface/70 p-4 shadow-xs transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-chart-1/30 hover:shadow-raised focus-within:ring-2 focus-within:ring-focus dark:bg-surface-secondary/60"
        >
          <div className="flex min-w-0 items-start gap-3">
            <ClientLogo client={c} size="lg" />
            <div className="min-w-0 flex-1">
              {/* Stretched link: its ::after covers the card, so a tap anywhere opens the client */}
              <Link to={`/clients/${c.id}`} className="block truncate text-sm font-semibold text-text transition-colors group-hover:text-primary-text after:absolute after:inset-0 after:rounded-card focus-visible:outline-none" title={c.name}>
                {c.name}
              </Link>
              <p className="mt-0.5 truncate text-xs text-text-muted">
                {c.industry} · {c.city}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CodeChip code={c.code} />
                <StatusBadge status={c.status} />
              </div>
            </div>
            <IconButton icon={Pencil} label={`Edit ${c.name}`} size="sm" onClick={() => onEdit(c)} className="relative z-10 -mr-1 -mt-1" />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-dashed border-border-strong pt-3.5 text-[13px]">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt className="sr-only">Mobile</dt>
              <dd className="min-w-0 truncate">
                <MobileNumber mobile={c.mobile} />
              </dd>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt className="sr-only">Created by</dt>
              <dd className="flex min-w-0 items-center gap-2 text-text-secondary">
                <Avatar name={c.createdBy} size="xs" />
                <span className="truncate">{c.createdBy}</span>
              </dd>
              <dt className="sr-only">Created on</dt>
              <dd className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-text-muted">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {formatDate(c.createdAt)}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
