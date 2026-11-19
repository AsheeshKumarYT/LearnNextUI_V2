import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Check, DatabaseZap, FolderKanban, Info, Library, ListChecks, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { setLeaveGuard } from '@/utils/leaveGuard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { projectsApi } from '@/services/api';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { CrmBanner, HowStep, ProjectStep, ScheduleStep, StartStep } from './components/AddProjectSteps';

const STEPS = [
  { key: 'start', label: 'Opportunity', description: 'Opportunity ID or from scratch', icon: Sparkles },
  { key: 'project', label: 'Project', description: 'Name and type', icon: FolderKanban },
  { key: 'program', label: 'How to start', description: 'Copy a batch or start empty', icon: Library },
  { key: 'schedule', label: 'Dates and name', description: 'First day and batch name', icon: Calendar },
];
// The steps a CRM fetch fills in (marked in the steps list, with a banner on the step)
const CRM_STEPS = { project: 'Project', schedule: 'Dates and name' };

const INITIAL = {
  start: null, // 'yes' (fetch an opportunity) | 'no' (from scratch)
  oppInput: '',
  opp: null, // the fetched opportunity
  clientId: '',
  program: '',
  programType: '',
  entity: '',
  subEntity: '',
  name: '',
  projectType: 'Standard Program',
  how: null, // 'copy' | 'empty'
  copyFrom: '',
  firstDay: null,
  cohort: '',
  participants: null,
};

function errorsFor(key, v) {
  const e = {};
  if (key === 'start') {
    if (!v.start) e.start = 'Choose one to continue';
    else if (v.start === 'yes' && !v.opp) e.opp = 'Fetch the opportunity first — or start from scratch';
    else if (v.start === 'no') {
      if (!v.clientId) e.clientId = 'Choose the client';
      if (!v.program) e.program = 'Choose the program';
      if (!v.subEntity) e.subEntity = 'Choose who delivers it';
    }
  }
  if (key === 'project' && v.name.trim().length < 3) e.name = 'Give the project a name (3+ characters)';
  if (key === 'program') {
    if (!v.how) e.how = 'Choose how you want to start';
    else if (v.how === 'copy' && !v.copyFrom) e.copyFrom = 'Choose the batch to copy';
  }
  if (key === 'schedule') {
    if (!v.firstDay) e.firstDay = 'Pick the first day';
    if (!v.cohort.trim()) e.cohort = 'Name the batch';
  }
  return e;
}

/**
 * Add project — Opportunity → Project → How to start → Dates and name. With a won opportunity from the CRM portal,
 * the later steps come pre-filled. Errors show once Continue is pressed on a step, then follow the values live.
 * Create makes the project (with its first program) and opens it in the list.
 */
export default function AddProject() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const lookups = useMemo(() => projectsApi.formLookups(), []);

  const [values, setValues] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [attempted, setAttempted] = useState(() => new Set());
  const [oppError, setOppError] = useState(null);
  const [looking, setLooking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaveTo, setLeaveTo] = useState('/projects');

  const key = STEPS[step].key;
  const last = step === STEPS.length - 1;
  const errors = errorsFor(key, values);
  const err = (k) => (attempted.has(key) ? errors[k] : undefined);
  const client = lookups.clients.find((c) => c.id === values.clientId);
  const earlier = useMemo(() => (values.clientId ? projectsApi.earlierPrograms(values.clientId) : []), [values.clientId]);
  const crmFilled = Boolean(values.opp);
  // Steps reached before (and not open now) count as done; you can open any of them again
  const stateOf = (i) => (i === step ? 'current' : i <= furthest ? 'done' : 'upcoming');

  const set = (k, x) => {
    if (k === 'oppInput') setOppError(null);
    setValues((s) => {
      const next = { ...s, [k]: x };
      // Picking a program also sets its type
      if (k === 'program') next.programType = lookups.programs.find((p) => p.name === x)?.type ?? '';
      if (k === 'subEntity') next.entity = lookups.deliveredBy.find((d) => d.subEntity === x)?.entity ?? '';
      // Another client: its earlier batches differ
      if (k === 'clientId' && x !== s.clientId) next.copyFrom = '';
      return next;
    });
  };

  const goTo = (i) => {
    setStep(i);
    setFurthest((f) => Math.max(f, i));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchOpp = async () => {
    const digits = values.oppInput.replace(/\D/g, '');
    if (digits.length !== 4) {
      setOppError('An opportunity ID has 4 digits, e.g. OPP-3664.');
      return;
    }
    setOppError(null);
    setLooking(true);
    try {
      const o = await projectsApi.lookupOpportunity(digits);
      setValues((s) => ({
        ...s,
        opp: o,
        clientId: o.client.id,
        name: o.projectName,
        projectType: o.projectType,
        program: o.program,
        programType: o.programType,
        entity: o.entity,
        subEntity: o.subEntity,
        firstDay: new Date(o.start),
        participants: o.participants,
        how: null,
        copyFrom: '',
      }));
    } catch (e) {
      setOppError(e.message);
    } finally {
      setLooking(false);
    }
  };
  // Change: forget the fetched opportunity and everything it filled in
  const changeOpp = () => {
    setValues({ ...INITIAL, start: 'yes' });
    setOppError(null);
  };

  const advance = () => {
    if (Object.keys(errors).length) {
      setAttempted((a) => new Set(a).add(key));
      requestAnimationFrame(() => document.querySelector('#add-project [aria-invalid="true"]')?.focus());
      return;
    }
    if (!last) return goTo(step + 1);
    // An earlier step may have changed since (e.g. another client clears the batch to copy) — open the first one with a gap
    const bad = STEPS.findIndex((s) => Object.keys(errorsFor(s.key, values)).length);
    if (bad >= 0) {
      setAttempted((a) => new Set(a).add(STEPS[bad].key));
      goTo(bad);
      return;
    }
    create();
  };

  const create = async () => {
    setSaving(true);
    try {
      const v = values;
      const p = await projectsApi.create(
        {
          clientId: v.clientId,
          name: v.name,
          projectType: v.projectType,
          program: v.program,
          programType: v.programType,
          entity: v.entity,
          subEntity: v.subEntity,
          start: v.firstDay,
          cohort: v.cohort,
          oppId: v.opp?.oppId ?? null,
          participants: v.participants,
          copyFrom: v.how === 'copy' ? v.copyFrom : null,
        },
        user?.name ?? 'You',
      );
      toast.success('Project created', { description: `${p.name} · ${p.code}`, afterLoad: true });
      navigate(`/projects?q=${encodeURIComponent(p.code)}`);
    } catch (e) {
      toast.error('Couldn’t create the project', { description: e.message });
      setSaving(false);
    }
  };

  const changed = JSON.stringify(values) !== JSON.stringify(INITIAL);
  const leave = (to = '/projects') => {
    if (!changed) return navigate(to);
    setLeaveTo(to);
    setConfirmLeave(true);
  };
  // Links outside the form (breadcrumbs, sidebar, search) ask too
  useEffect(() => setLeaveGuard((to) => (changed && !saving ? (leave(to), true) : false)));

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      <div className="grid grid-cols-1 gap-6 lg:flex-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card
          tint="primary"
          subtleTint
          padding="none"
          className="hidden flex-col px-5 py-6 xl:sticky xl:top-[calc(var(--app-header-h)+2rem)] xl:flex xl:min-h-[calc(100dvh-6.75rem)] xl:self-start xl:transition-[top] xl:duration-300 xl:ease-out"
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
            <ListChecks className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[15px] font-semibold text-text">New project</p>
          <p className="mt-1 text-[13px] text-text-secondary">{crmFilled ? `Pre-filled from OPP-${values.opp.oppId} — just review.` : 'Four quick steps.'}</p>

          <ol className="mt-7 flex flex-col">
            {STEPS.map((s, i) => {
              const state = stateOf(i);
              const canOpen = i <= furthest;
              const Icon = s.icon;
              return (
                <li key={s.key} className="relative pb-3.5 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className={cn('absolute -bottom-[5px] left-[21px] top-[45px] w-0.5 rounded-full', stateOf(i + 1) !== 'upcoming' ? 'bg-primary' : 'bg-border-strong')} aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    onClick={() => canOpen && goTo(i)}
                    disabled={!canOpen}
                    aria-current={state === 'current' ? 'step' : undefined}
                    className={cn(
                      'relative z-10 flex w-full items-start gap-3 rounded-xl p-1.5 pr-3 text-left transition-colors disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      state === 'current' && 'bg-surface shadow-xs ring-1 ring-border-strong dark:bg-surface-sunken',
                      state === 'done' && 'hover:bg-surface/70',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-[3px] inline-flex size-8 shrink-0 items-center justify-center rounded-full',
                        state === 'done' && 'bg-primary text-primary-fg',
                        state === 'current' && 'bg-primary-soft text-primary-text ring-2 ring-primary',
                        state === 'upcoming' && 'bg-surface text-text-secondary ring-1 ring-border-strong dark:bg-surface-sunken',
                      )}
                    >
                      {state === 'done' ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : <Icon className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm font-semibold', state === 'upcoming' ? 'text-text-secondary' : 'text-text')}>{s.label}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-text-muted" title={s.description}>
                        {s.description}
                      </span>
                    </span>
                    {crmFilled && CRM_STEPS[s.key] && (
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-chart-1/10 text-chart-1" title="Pre-filled from CRM portal">
                        <DatabaseZap className="size-3" aria-hidden="true" />
                        <span className="sr-only">Pre-filled from CRM portal</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-auto flex items-start gap-2 rounded-xl bg-surface/60 px-3 py-2.5 text-xs text-text-secondary dark:bg-surface-sunken/60">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary-text" aria-hidden="true" />
            <span>
              Fields marked <span className="font-semibold text-danger">*</span> are required. You can go back to any finished step.
            </span>
          </p>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <Card padding="sm" tint="primary" subtleTint className="xl:hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text">{STEPS[step].label}</span>
              <span className="tabular-nums text-text-secondary">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.key} className={i <= step ? 'h-1.5 flex-1 rounded-full bg-primary' : 'h-1.5 flex-1 rounded-full bg-text-muted/20'} />
              ))}
            </div>
          </Card>

          <div
            id="add-project"
            key={key}
            className="flex flex-1 animate-fade-in flex-col gap-5 [&>*:last-child]:flex-1 [&>*:last-child]:rounded-b-none [&>*:last-child]:border-b-0 [&>*:last-child]:shadow-[0_-4px_16px_-8px_rgb(var(--ln-shadow-color)/0.2)]"
          >
            {crmFilled && CRM_STEPS[key] && <CrmBanner what={CRM_STEPS[key]} opp={values.opp.oppId} clientName={values.opp.client.name} />}
            {key === 'start' && <StartStep v={values} set={set} err={err} lookups={lookups} oppError={oppError} looking={looking} onFetch={fetchOpp} onChange={changeOpp} />}
            {key === 'project' && <ProjectStep v={values} set={set} err={err} clientName={client?.name} types={lookups.programTypes} />}
            {key === 'program' && <HowStep v={values} set={set} err={err} clientName={client?.name} earlier={earlier} />}
            {key === 'schedule' && <ScheduleStep v={values} set={set} err={err} />}
          </div>

          <Card padding="none" className="-mt-5 flex items-center justify-between gap-3 rounded-t-none border-t border-dashed border-t-border-strong px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-1">
              {step > 0 && (
                <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => goTo(step - 1)} disabled={saving}>
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={() => leave()} disabled={saving}>
                Cancel
              </Button>
            </div>
            {last ? (
              <Button leftIcon={Check} onClick={advance} loading={saving}>
                Create project
              </Button>
            ) : (
              <Button rightIcon={ArrowRight} onClick={advance} disabled={looking}>
                Continue
              </Button>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onConfirm={() => navigate(leaveTo)}
        title="Discard this project?"
        description="The details you’ve entered won’t be saved."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </div>
  );
}
