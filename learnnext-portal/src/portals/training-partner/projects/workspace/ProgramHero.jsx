import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLogoColor } from '@/hooks/useLogoColor';
import { Button, Card } from '@/components/ui';
import { ClientLogo, monogramColor } from '@/shared/clients/components/ClientLogo';
import { HeroMobileActions, SectionTabs } from '@/shared/clients/detail/ClientHero';
import { PROGRAM_STATUS } from '../components/projectMeta';

/**
 * A program's hero — the client page's hero pattern: logo + program name, one quiet meta line (cohort chip · type ·
 * client · project · status) and the actions, with the section tabs joined to its bottom edge (sticky).
 * Returns two siblings — render it straight in the page's column.
 */
export function ProgramHero({ ws, tabs, tab, onTab, onBack, onContinue }) {
  const { project, program: pg } = ws;
  const client = project.client;
  const imageColor = useLogoColor(client.logo);
  const tintColor = client.logo ? imageColor : monogramColor(client.code);
  const status = PROGRAM_STATUS[pg.status];
  const meta = [
    { text: pg.type, className: 'hidden sm:inline-flex' },
    { text: client.name },
    { text: project.name },
  ];

  return (
    <>
      <Card tint="primary" tintColor={tintColor} padding="none" className="overflow-hidden rounded-b-none border-b-0">
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <ClientLogo client={client} size="lg" className="size-14 rounded-2xl text-lg sm:size-16" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-6 text-text max-sm:pr-8 sm:text-2xl sm:leading-8">{pg.program}</h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-text-secondary">
                <span className="inline-flex h-6 items-center rounded-md bg-surface-sunken px-2 text-xs font-semibold text-text-secondary ring-1 ring-inset ring-border-strong">{pg.cohort}</span>
                {meta.map((m) => (
                  <span key={m.text} className={cn('inline-flex items-center gap-x-2.5', m.className)}>
                    <span className="text-text-muted/60" aria-hidden="true">
                      ·
                    </span>
                    {m.text}
                  </span>
                ))}
                <span className="inline-flex items-center gap-x-2.5">
                  <span className="text-text-muted/60" aria-hidden="true">
                    ·
                  </span>
                  <span className={cn('inline-flex items-center gap-1.5 font-medium', status.text)}>
                    <span className={cn('size-1.5 rounded-full', status.dot)} aria-hidden="true" />
                    {status.label}
                  </span>
                </span>
              </p>
            </div>
          </div>
          <HeroMobileActions onBack={onBack} backLabel="Back to project" actions={onContinue ? [{ icon: ArrowRight, label: 'Continue setup', onClick: onContinue, primary: true }] : []} />
          <div className="flex shrink-0 gap-2 max-sm:hidden">
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={onBack}>
              Back to project
            </Button>
            {onContinue && (
              <Button rightIcon={ArrowRight} onClick={onContinue}>
                Continue setup
              </Button>
            )}
          </div>
        </div>
      </Card>
      <SectionTabs tabs={tabs} value={tab} onChange={onTab} ariaLabel="Program sections" idBase="program" />
    </>
  );
}
