import { DatabaseZap } from 'lucide-react';
import { formatRelative } from '@/utils/formatDate';

/**
 * A quiet strip under the toolbar of a read-only master: the data comes from the CRM portal, so it can't be
 * added or edited here — with when it last synced. `noun` = what the list holds, e.g. "countries".
 * Phones: one short line ("Read-only · synced from CRM · 22 Oct") — the full sentence wrapped to three lines there.
 */
export function CrmSyncNote({ noun, syncedAt }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border-strong bg-chart-1/[0.035] px-3 py-2.5 text-xs sm:px-5" role="note">
      <span className="inline-flex min-w-0 items-center gap-2 text-text-secondary">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary-text" aria-hidden="true">
          <DatabaseZap className="size-3.5" />
        </span>
        <span className="max-sm:hidden">
          <span className="font-semibold text-text">Synced from the CRM portal.</span> Read-only here — {noun} are added and edited in the CRM.
        </span>
        <span className="truncate sm:hidden">
          <span className="font-semibold text-text">Read-only</span> · synced from CRM{syncedAt && ` · ${formatRelative(syncedAt)}`}
        </span>
      </span>
      {syncedAt && <span className="text-text-muted max-sm:hidden sm:ml-auto">Last synced {formatRelative(syncedAt)}</span>}
    </div>
  );
}
