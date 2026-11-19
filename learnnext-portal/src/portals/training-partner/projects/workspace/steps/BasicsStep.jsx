import { useState } from 'react';
import { Check, DatabaseZap, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/hooks/useToast';
import { Button, Input, SegmentedControl, Select } from '@/components/ui';
import { rangeLabel } from '../../components/projectMeta';
import { Panel } from './Panel';

const ACCESS = [3, 6, 12].map((m) => ({ value: String(m), label: `${m} months` }));
const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

/** One "Yours to set" row: label (+ help) on the left, its control on the right */
function Row({ label, help, children }) {
  return (
    <div className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text">{label}</p>
        {help && <p className="mt-0.5 text-xs text-text-muted">{help}</p>}
      </div>
      <div className="w-full shrink-0 sm:w-60">{children}</div>
    </div>
  );
}

/**
 * Foundation › Program basics: what came from the CRM (read only, with a "Check for changes"), and what's yours to set —
 * batch name, client sign-off, learner access. Changes show a Save bar (kept on this page for now).
 */
export function BasicsStep({ ws }) {
  const toast = useToast();
  const { program: pg, project, basics } = ws;
  const initial = { cohort: pg.cohort, signOff: basics.signOff ? 'yes' : 'no', accessMonths: String(basics.accessMonths) };
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(initial);
  const [checking, setChecking] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const check = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      toast.success('Up to date with the CRM', { description: `Nothing has changed on OPP-${pg.oppId}.` });
    }, 900);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
        <Panel
          icon={DatabaseZap}
          title="From the CRM"
          extra={
            <>
              <span className="font-mono text-xs text-text-secondary">OPP-{pg.oppId}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-px text-[11px] font-semibold text-success">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                Verified
              </span>
            </>
          }
          action={
            <Button variant="ghost" size="xs" leftIcon={RefreshCw} onClick={check} disabled={checking} className={cn(checking && '[&_svg]:animate-spin')}>
              Check for changes
            </Button>
          }
        >
          <p className="text-[13px] leading-6 text-text-secondary">
            <span className="font-semibold text-text">{project.client.name}</span> bought <span className="font-semibold text-text">{basics.seats} seats</span> of{' '}
            <span className="font-semibold text-text">{pg.program}</span>, delivered by <span className="font-semibold text-text">{pg.subEntity}</span> and sold by{' '}
            <span className="font-semibold text-text">{basics.bdOwner}</span>.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Part of {project.name} · {pg.type}
          </p>
        </Panel>

        <Panel icon={SlidersHorizontal} title="Yours to set" bodyClassName="divide-y divide-border">
          <Row label="Batch name">
            <Input value={form.cohort} maxLength={40} onChange={(e) => set('cohort', e.target.value)} invalid={!form.cohort.trim()} aria-label="Batch name" />
          </Row>
          <Row label="Program dates">
            <p className="flex h-9 items-center rounded-control bg-surface-sunken px-3 text-[13px] text-text-secondary">{rangeLabel(pg.start, pg.end, true)}</p>
          </Row>
          <Row
            label="Client signs off the learning journey"
            help={basics.spoc ? `Sent to ${basics.spoc} before launch; we track the reply` : 'Sent to the client’s contact before launch'}
          >
            <SegmentedControl tabs={YES_NO} value={form.signOff} onChange={(v) => set('signOff', v)} ariaLabel="Client signs off the learning journey" fullWidth />
          </Row>
          <Row label="Learner access after the program">
            <Select options={ACCESS} value={form.accessMonths} onChange={(e) => set('accessMonths', e.target.value)} aria-label="Learner access after the program" />
          </Row>
        </Panel>
      </div>

      {dirty && (
        <div className="sticky bottom-0 z-10 mt-auto flex animate-fade-in items-center justify-between gap-3 border-t border-border bg-surface/90 px-5 py-3 backdrop-blur sm:px-6 dark:bg-surface-secondary/90">
          <p className="text-[13px] font-medium text-text">You have unsaved changes</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setForm(saved)}>
              Discard
            </Button>
            <Button
              size="sm"
              disabled={!form.cohort.trim()}
              onClick={() => {
                setSaved(form);
                toast.success('Program basics saved', { description: `${pg.program} · ${form.cohort.trim()}` });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
