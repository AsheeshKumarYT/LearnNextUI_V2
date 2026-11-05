import { useState } from 'react';
import { ChevronDown, Eye, FileText, Pencil, Plus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatNumber';
import { useLogoColor } from '@/hooks/useLogoColor';
import { Button, IconButton } from '@/components/ui';
import { ProgramLogo, categoryTone } from './ProgramLogo';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';

export const DETAIL_TITLE_ID = 'program-detail-title';
const HISTORY_PAGE = 6;

const rupees = (n) => formatCurrency(n, 'INR');

// What each kind of history entry says and its dot colour (soft)
const CHANGE = {
  created: { dot: 'bg-chart-1', title: () => 'Program created' },
  name: { dot: 'bg-chart-4', title: () => 'Renamed', detail: (h) => `${h.from} → ${h.to}` },
  category: { dot: 'bg-chart-4', title: () => 'Category changed', detail: (h) => `${h.from} → ${h.to}` },
  logo: { dot: 'bg-chart-4', title: () => 'Logo updated' },
  mapping: { dot: 'bg-chart-4', title: () => 'Entity mapping changed', detail: (h) => `${h.from} → ${h.to}` },
  fee: { dot: 'bg-chart-3', title: () => 'Fee per person changed', detail: (h) => `${rupees(h.from)} → ${rupees(h.to)}` },
  overview: { dot: 'bg-chart-4', title: () => 'Executive overview replaced', detail: (h) => h.to },
  element: { dot: 'bg-success-main', title: () => 'Content element added', detail: (h) => `${h.to} · ${h.note}` },
  permissions: { dot: 'bg-chart-1', title: () => 'Content permissions updated', detail: (h) => h.to },
  'element-edited': { dot: 'bg-chart-4', title: () => 'Content element edited', detail: (h) => `${h.to} · ${h.note}` },
  'element-moved': { dot: 'bg-chart-4', title: () => 'Content element moved', detail: (h) => `${h.to} · ${h.note}` },
  'element-removed': { dot: 'bg-text-muted', title: () => 'Content element removed', detail: (h) => `${h.to} · ${h.note}` },
};
/** One history entry in words: { title, detail } (detail may be undefined) */
export function describeChange(h) {
  const c = CHANGE[h.kind] ?? CHANGE.created;
  return { title: c.title(h), detail: c.detail?.(h) };
}

/**
 * Drawer body for one program — picked from previews: "Tidy hero + detail rows". A header washed in the logo's colour
 * (logo, name, "● category · fee per person", then Add content + Edit side by side); one list of details with labels
 * on the left and values on the right (no icon boxes); the executive overview as a file row with View; then the history
 * of changes as a calm timeline (title + detail on the left, when on the right), newest first. Sections are split by
 * thin lines, nothing boxed.
 */
export function ProgramDetails({ program: p, onClose, onAddContent, onEdit }) {
  const [preview, setPreview] = useState(false);
  const [shown, setShown] = useState(HISTORY_PAGE);
  const tone = categoryTone(p.category);
  const logoColor = useLogoColor(p.logo) ?? 'var(--color-chart-1)';
  const mix = (pct) => `color-mix(in srgb, ${logoColor} ${pct}%, transparent)`;

  return (
    <div className="flex min-h-full flex-col">
      {/* Close stays put while the details scroll */}
      <div className="sticky top-0 z-10 flex h-0 justify-end px-3.5 sm:px-4.5">
        <IconButton icon={X} label="Close" size="sm" tooltip={false} onClick={onClose} className="mt-4 rounded-full bg-surface/80 shadow-xs ring-1 ring-border/70 backdrop-blur" />
      </div>

      {/* Header: a soft wash in the logo's colour */}
      <header className="px-5 pb-5 pt-6 sm:px-6" style={{ backgroundImage: `linear-gradient(to bottom, ${mix(10)}, ${mix(3)} 70%, transparent)` }}>
        <div className="flex items-center gap-4 pr-10">
          <ProgramLogo program={p} size="lg" />
          <div className="min-w-0">
            <h2 id={DETAIL_TITLE_ID} className="text-[17px] font-semibold leading-6 text-text">
              {p.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[13px] text-text-secondary">
              <span className={cn('size-1.5 rounded-full', tone.dot)} aria-hidden="true" />
              {p.category}
              <span className="text-text-muted/60" aria-hidden="true">
                ·
              </span>
              <span>
                <span className="font-semibold tabular-nums text-text">{rupees(p.fee)}</span> per person
              </span>
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button leftIcon={Plus} onClick={onAddContent}>
            Add content
          </Button>
          {/* A firmer border than the default secondary, so it holds its own next to the filled button on the tinted header */}
          <Button variant="secondary" leftIcon={Pencil} onClick={onEdit} className="border-text-muted/40">
            Edit program
          </Button>
        </div>
      </header>

      <div className="divide-y divide-border-strong/70 px-5 sm:px-6">
        {/* Details: label left, value right */}
        <section className="py-5" aria-labelledby="program-details-label">
          <SectionLabel id="program-details-label">Details</SectionLabel>
          <dl className="mt-3 space-y-2.5 text-[13px]">
            <Row label="Entity">{p.entityName}</Row>
            <Row label="Sub-entity">{p.subName}</Row>
            <Row label="Created">
              {p.createdBy} <span className="font-normal text-text-muted">· {formatDate(p.createdAt)}</span>
            </Row>
          </dl>
        </section>

        {/* Executive overview: one file row with a View button */}
        <section className="py-5" aria-labelledby="program-overview-label">
          <SectionLabel id="program-overview-label">Executive overview</SectionLabel>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-soft/70 text-danger" aria-hidden="true">
              <FileText className="size-[18px]" />
            </span>
            <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-text" title={p.overview.name}>
              {p.overview.name}
            </p>
            {/* The app's secondary button, with the same firmer border as Edit program above */}
            <Button variant="secondary" size="sm" leftIcon={Eye} onClick={() => setPreview(true)} aria-label={`View ${p.overview.name}`} className="shrink-0 border-text-muted/40">
              View
            </Button>
          </div>
        </section>

        {/* History of changes */}
        <section className="py-5" aria-labelledby="program-history-list">
          <SectionLabel id="program-history-list" count={p.history.length}>
            History
          </SectionLabel>
          <ol className="relative mt-4">
            <span className="absolute bottom-2 left-[3.5px] top-2 w-px bg-border-strong" aria-hidden="true" />
            {p.history.slice(0, shown).map((h) => {
              const { title, detail } = describeChange(h);
              return (
                <li key={h.id} className="relative flex gap-3.5 pb-4 last:pb-0">
                  <span className={cn('relative mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-elevated', (CHANGE[h.kind] ?? CHANGE.created).dot)} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <p className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-text">{title}</p>
                      <span className="shrink-0 text-xs tabular-nums text-text-muted" title={formatDate(h.at)}>
                        {formatRelative(h.at)}
                      </span>
                    </div>
                    {detail && (
                      <p className="truncate text-[13px] leading-5 text-text-secondary" title={detail}>
                        {detail}
                      </p>
                    )}
                    <p className="text-xs text-text-muted">by {h.by}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {p.history.length > shown && (
            <Button variant="ghost" size="sm" rightIcon={ChevronDown} className="mt-3" onClick={() => setShown((n) => n + HISTORY_PAGE)}>
              Show older changes
            </Button>
          )}
        </section>
      </div>

      <FilePreviewModal file={preview ? p.overview : null} onClose={() => setPreview(false)} />
    </div>
  );
}

/** A detail row: muted label on the left, the value on the right */
function Row({ label, children }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 shrink-0 text-text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 font-medium text-text">{children}</dd>
    </div>
  );
}

function SectionLabel({ id, count, children }) {
  return (
    <h3 id={id} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
      {children} {count != null && <span className="ml-1 font-medium tabular-nums">{count}</span>}
    </h3>
  );
}
