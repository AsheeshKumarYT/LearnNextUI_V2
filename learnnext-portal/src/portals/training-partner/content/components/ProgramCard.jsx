import { Pencil } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatNumber';
import { IconButton } from '@/components/ui';
import { GridCard } from '@/components/lists/ResponsiveList';
import { AddContentButton } from './AddContentButton';
import { ProgramLogo, categoryTone } from './ProgramLogo';

/**
 * Card view's program card — the same build as every other list card (All Clients, Facilitators, Support): the logo,
 * the name, the sub-entity (entity on hover) and the category as a small dot pill, Edit top-right, then the fee and
 * Add content under a dashed line. The whole card opens the program. (The tall "showcase" card with a coloured logo
 * panel looked different from the rest of the app and was replaced, on phones and desktop alike.)
 */
export function ProgramCard({ program: p, onOpen, onEdit, onAddContent }) {
  const tone = categoryTone(p.category);
  return (
    <GridCard
      media={<ProgramLogo program={p} size="lg" />}
      title={p.name}
      subtitle={<span title={`${p.subName} · ${p.entityName}`}>{p.subName}</span>}
      badges={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-secondary">
          <span className={cn('size-1.5 shrink-0 rounded-full', tone.dot)} aria-hidden="true" />
          {p.category}
        </span>
      }
      onOpen={onOpen}
      actions={<IconButton icon={Pencil} label={`Edit ${p.name}`} size="sm" onClick={onEdit} />}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="whitespace-nowrap leading-tight">
            <span className="text-[15px] font-semibold tabular-nums text-text">{formatCurrency(p.fee, 'INR')}</span>
            <span className="text-xs text-text-muted"> per person</span>
          </p>
          {/* Above the card's stretched open-button, so it stays clickable */}
          <AddContentButton onClick={onAddContent} className="relative z-10" />
        </div>
      }
    />
  );
}
