import { ArrowLeft, Pencil } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLogoColor } from '@/hooks/useLogoColor';
import { formatCurrency } from '@/utils/formatNumber';
import { Button, Card } from '@/components/ui';
import { HeroMobileActions, SectionTabs } from '@/shared/clients/detail/ClientHero';
import { ProgramLogo, categoryTone } from './ProgramLogo';

/**
 * Program page hero — the client page's hero for a program: a card with the logo, name and one quiet line
 * (● category · sub-entity · fee per person), All programs + Edit on the right, and the section tabs joined to its
 * bottom edge (the same sticky SectionTabs as the client page). Returns siblings: render it straight in the page column.
 */
export function ProgramHero({ program: p, tabs, tab, onTab, onBack, onEdit }) {
  // The wash from the top-left follows the logo's main colour (blue while it's read, or for a colourless logo)
  const logoColor = useLogoColor(p.logo);
  return (
    <>
      <Card tint="primary" tintColor={logoColor} padding="none" className="overflow-hidden rounded-b-none border-b-0">
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <ProgramLogo program={p} size="lg" className="sm:size-16" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-6 text-text max-sm:pr-8 sm:text-2xl sm:leading-8">{p.name}</h1>
              {/* One quiet line, one kind of separator: ● category · sub-entity (entity on hover) · fee */}
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-text-secondary">
                <span className="inline-flex items-center gap-1.5 font-medium text-text">
                  <span className={cn('size-1.5 rounded-full', categoryTone(p.category).dot)} aria-hidden="true" />
                  {p.category}
                </span>
                <span className="text-text-muted/60" aria-hidden="true">
                  ·
                </span>
                <span title={p.entityName}>{p.subName}</span>
                <span className="text-text-muted/60" aria-hidden="true">
                  ·
                </span>
                <span>
                  <span className="font-semibold tabular-nums text-text">{formatCurrency(p.fee, 'INR')}</span> per person
                </span>
              </p>
            </div>
          </div>
          <HeroMobileActions onBack={onBack} backLabel="All programs" actions={[{ icon: Pencil, label: 'Edit program', onClick: onEdit, primary: true }]} />
          <div className="flex shrink-0 gap-2 max-sm:hidden [&>*]:flex-1 sm:[&>*]:flex-none">
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={onBack}>
              All programs
            </Button>
            <Button leftIcon={Pencil} onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      </Card>
      <SectionTabs tabs={tabs} value={tab} onChange={onTab} ariaLabel="Program sections" idBase="program" />
    </>
  );
}
