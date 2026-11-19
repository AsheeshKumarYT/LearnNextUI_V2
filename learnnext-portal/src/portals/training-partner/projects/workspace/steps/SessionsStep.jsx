import { useState } from 'react';
import { ChevronRight, Link as LinkIcon, MapPin, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, startOfDay } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useRetained } from '@/hooks/useRetained';
import { programWorkspaceApi } from '@/services/api';
import { Button, DatePicker, Dropdown, FormField, Input, Modal, Select, Switch, TimePicker } from '@/components/ui';
import { AddContentButton } from '../../../content/components/AddContentButton';
import { shortDate } from '../../components/projectMeta';
import { LIVE_TYPES, STEP_TYPES, lengthLabel, moduleIcon, stepIssues, stepMeta } from '../workspaceMeta';

const LENGTHS = [15, 30, 45, 60, 90, 120, 180, 240, 360, 480].map((m) => ({ value: String(m), label: lengthLabel(m) }));
const OPEN_DAYS = [3, 5, 7, 10, 14].map((d) => ({ value: String(d), label: `${d} days` }));
const PLATFORMS = ['Zoom', 'Microsoft Teams', 'Google Meet'];
const ASSESSMENTS = ['Behavioural assessment', 'Pre-program knowledge check', 'Leadership style survey', 'Post-program knowledge check'];
const ATTEMPTS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }));

/** The dates a module allows: Pre = before the start, During = the program's dates, Post = after the end */
function moduleRange(moduleName, pg) {
  const start = startOfDay(pg.start);
  const end = startOfDay(pg.end);
  const key = (moduleName ?? '').toLowerCase();
  if (key === 'pre') return { max: addDays(start, -1), fallback: addDays(start, -3) };
  if (key === 'during') return { min: start, max: end, fallback: start };
  if (key === 'post') return { min: addDays(end, 1), fallback: addDays(end, 1) };
  return { fallback: start };
}
const clampDate = (d, r) => {
  if (!d) return r.fallback;
  if (r.min && d < r.min) return r.min;
  if (r.max && d > r.max) return r.max;
  return d;
};

/** Add / edit a journey step. `draft` = { type, module } for a new one, or the step to edit. */
function StepModal({ open, draft, ws, onClose, onSaved, onOpen }) {
  const toast = useToast();
  const pg = ws.program;
  const editing = Boolean(draft?.id);
  const type = draft?.type ?? 'self';
  const T = STEP_TYPES[type];
  const moduleName = (id) => ws.modules.find((m) => m.id === id)?.name;

  const [v, setV] = useState(() => {
    if (editing) {
      return {
        ...draft,
        date: new Date(draft.date),
        minutes: String(draft.minutes),
        closesAfter: String(draft.closesAfter ?? 7),
        assessment: draft.assessment ?? { passScore: 70, attempts: 2, reports: true, shuffle: true, showScore: true },
      };
    }
    const range = moduleRange(moduleName(draft?.module), pg);
    return {
      type,
      name: type === 'assessment' ? ASSESSMENTS[0] : `New ${T.label.toLowerCase()}`,
      module: draft?.module ?? ws.modules[0]?.id,
      date: range.fallback,
      time: null,
      minutes: String(T.minutes),
      platform: 'Zoom',
      link: '',
      venueSet: false,
      closesAfter: '7',
      assessment: { passScore: 70, attempts: 2, reports: true, shuffle: true, showScore: true },
    };
  });
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(null); // 'save' | 'remove'
  const range = moduleRange(moduleName(v.module), pg);
  const set = (k, x) => setV((s) => ({ ...s, [k]: x }));
  const setA = (k, x) => setV((s) => ({ ...s, assessment: { ...s.assessment, [k]: x } }));
  const errors = { ...(!v.name.trim() && { name: 'Give the step a name' }), ...(!v.date && { date: 'Pick a date' }) };
  const err = (k) => (tried ? errors[k] : undefined);

  const save = async (e) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(errors).length) return;
    setBusy('save');
    const minutes = Number(v.minutes);
    const step = {
      ...(editing && { id: draft.id }),
      type,
      name: v.name.trim(),
      module: v.module,
      date: v.date,
      time: LIVE_TYPES.includes(type) ? v.time : null,
      minutes: type === 'feedback' ? T.minutes : minutes,
      ...(type === 'virtual' && { platform: v.platform, link: v.link.trim() || null }),
      ...(type === 'inperson' && { venueSet: Boolean(v.venueSet) }),
      ...(type === 'feedback' && { closesAfter: Number(v.closesAfter) }),
      ...(type === 'assessment' && { assessment: { ...v.assessment, name: v.name.trim(), timeLimit: minutes, passScore: Number(v.assessment.passScore), attempts: Number(v.assessment.attempts) } }),
    };
    try {
      const next = await programWorkspaceApi.saveJourneyStep(ws.project.id, pg.id, step);
      onSaved(next);
      toast.success(editing ? 'Step updated' : 'Step added', { description: step.name });
    } catch (x) {
      toast.error('Couldn’t save the step', { description: x.message });
      setBusy(null);
    }
  };

  const remove = async () => {
    setBusy('remove');
    try {
      const next = await programWorkspaceApi.removeJourneyStep(ws.project.id, pg.id, draft.id);
      onSaved(next);
      toast.success('Step removed', { description: draft.name });
    } catch (x) {
      toast.error('Couldn’t remove the step', { description: x.message });
      setBusy(null);
    }
  };

  const createLink = () => set('link', `https://meet.learnnext.in/${Math.random().toString(36).slice(2, 10)}`);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      closeOnBackdrop={false}
      icon={T.icon}
      title={editing ? 'Edit step' : `Add ${T.label.toLowerCase()}`}
      description={T.label}
      footer={
        <>
          {editing && (
            <Button variant="ghost" leftIcon={Trash2} onClick={remove} loading={busy === 'remove'} disabled={busy === 'save'} className="text-danger hover:bg-danger-soft hover:text-danger sm:mr-auto">
              Remove
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} disabled={Boolean(busy)}>
            Cancel
          </Button>
          <Button type="submit" form="journey-step-form" loading={busy === 'save'} disabled={busy === 'remove'}>
            {editing ? 'Save changes' : 'Add step'}
          </Button>
        </>
      }
    >
      <form id="journey-step-form" noValidate onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" required error={err('name')} className="sm:col-span-2">
          {type === 'assessment' ? (
            <Select options={ASSESSMENTS} value={v.name} onChange={(e) => set('name', e.target.value)} />
          ) : (
            <Input value={v.name} maxLength={60} onChange={(e) => set('name', e.target.value)} />
          )}
        </FormField>
        <FormField label="Module">
          <Select
            options={ws.modules.map((m) => ({ value: m.id, label: m.name }))}
            value={v.module}
            onChange={(e) => {
              const id = e.target.value;
              setV((s) => ({ ...s, module: id, date: clampDate(s.date, moduleRange(moduleName(id), pg)) }));
            }}
          />
        </FormField>
        <FormField label={type === 'feedback' || type === 'assessment' ? 'Opens on' : 'Date'} required error={err('date')}>
          <DatePicker value={v.date} onChange={(d) => set('date', d)} minDate={range.min} maxDate={range.max} clearable={false} />
        </FormField>

        {LIVE_TYPES.includes(type) && (
          <>
            <FormField label="Start time">
              <TimePicker value={v.time} onChange={(t) => set('time', t)} step={15} min="07:00" max="21:00" placeholder="Select time" />
            </FormField>
            <FormField label="Length">
              <Select options={LENGTHS} value={v.minutes} onChange={(e) => set('minutes', e.target.value)} />
            </FormField>
          </>
        )}
        {(type === 'self' || type === 'assessment') && (
          <FormField label={type === 'assessment' ? 'Time limit' : 'Length'}>
            <Select options={LENGTHS} value={v.minutes} onChange={(e) => set('minutes', e.target.value)} />
          </FormField>
        )}
        {type === 'feedback' && (
          <FormField label="Stays open for">
            <Select options={OPEN_DAYS} value={v.closesAfter} onChange={(e) => set('closesAfter', e.target.value)} />
          </FormField>
        )}

        {type === 'virtual' && (
          <>
            <FormField label="Platform">
              <Select options={PLATFORMS} value={v.platform} onChange={(e) => set('platform', e.target.value)} />
            </FormField>
            <FormField label="Meeting link" className="sm:col-span-2">
              <div className="flex gap-2">
                <Input leftIcon={LinkIcon} placeholder="Paste a link or create one" value={v.link ?? ''} onChange={(e) => set('link', e.target.value)} className="flex-1" />
                <Button variant="secondary" onClick={createLink}>
                  Create link
                </Button>
              </div>
            </FormField>
          </>
        )}

        {type === 'inperson' && (
          <FormField label="Where">
            <Button
              variant="link"
              leftIcon={MapPin}
              className="h-10 justify-start sm:h-9"
              onClick={() => {
                onClose();
                onOpen('logistics', 'venue');
              }}
            >
              {v.venueSet ? 'Venue is set' : 'Set on the Venue step'}
            </Button>
          </FormField>
        )}

        {type === 'assessment' && (
          <>
            <FormField label="Pass score (%)">
              <Input type="number" min={0} max={100} value={v.assessment.passScore} onChange={(e) => setA('passScore', Math.max(0, Math.min(100, Number(e.target.value) || 0)))} />
            </FormField>
            <FormField label="Attempts allowed">
              <Select options={ATTEMPTS} value={String(v.assessment.attempts)} onChange={(e) => setA('attempts', e.target.value)} />
            </FormField>
            <div className="divide-y divide-border rounded-xl border border-border-strong sm:col-span-2">
              <Switch className="px-4 py-3" label="Participants can download their report" checked={v.assessment.reports} onChange={(x) => setA('reports', x)} />
              <Switch className="px-4 py-3" label="Shuffle questions and answers" checked={v.assessment.shuffle} onChange={(x) => setA('shuffle', x)} />
              <Switch className="px-4 py-3" label="Show the score when finished" checked={v.assessment.showScore} onChange={(x) => setA('showScore', x)} />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

/** Learning journey › Sessions and schedule: the journey's steps by module, each opening its edit dialog */
export function SessionsStep({ ws, onChange, onOpen }) {
  const [draft, setDraft] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const shown = useRetained(draft);
  const openModal = (d) => {
    setFormKey((k) => k + 1);
    setDraft(d);
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
      {ws.modules.map((m) => {
        const steps = ws.journey.filter((s) => s.module === m.id);
        const Icon = moduleIcon(m.name);
        return (
          <section key={m.id} className="rounded-xl border border-border-strong bg-surface/70 dark:bg-surface-sunken/40">
            <div className="flex min-h-12 items-center gap-2.5 border-b border-border px-4 py-2">
              <Icon className="size-4 text-text-muted" aria-hidden="true" />
              <h3 className="text-[13px] font-semibold text-text">{m.name}</h3>
              <span className="text-xs text-text-muted">{steps.length}</span>
              <div className="ml-auto">
                <Dropdown
                  items={Object.entries(STEP_TYPES).map(([type, t]) => ({ label: t.label, icon: t.icon, onSelect: () => openModal({ type, module: m.id }) }))}
                  trigger={<AddContentButton label="Add step" />}
                />
              </div>
            </div>
            {steps.length === 0 ? (
              <p className="px-4 py-4 text-[13px] text-text-muted">No steps yet</p>
            ) : (
              <ul className="divide-y divide-border">
                {steps.map((s) => {
                  const T = STEP_TYPES[s.type];
                  const issues = stepIssues(s);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => openModal(s)}
                        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
                      >
                        <span className="w-12 shrink-0">
                          <span className="block text-[13px] font-semibold tabular-nums text-text">{shortDate(s.date)}</span>
                          <span className="block text-xs text-text-muted">{new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-text transition-colors group-hover:text-primary-text">{s.name}</span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                            <T.icon className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{stepMeta(s)}</span>
                          </span>
                        </span>
                        {issues.length > 0 && (
                          <span className={cn('hidden shrink-0 text-xs font-medium text-warning sm:inline')}>
                            {issues[0]}
                            {issues.length > 1 && <span className="ml-1 text-text-muted">+{issues.length - 1}</span>}
                          </span>
                        )}
                        <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}

      <StepModal
        key={formKey}
        open={draft !== null}
        draft={shown}
        ws={ws}
        onClose={() => setDraft(null)}
        onOpen={onOpen}
        onSaved={(next) => {
          onChange(next);
          setDraft(null);
        }}
      />
    </div>
  );
}
