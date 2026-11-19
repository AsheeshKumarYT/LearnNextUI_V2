import { useEffect, useMemo, useState } from 'react';
import { Building2, Calendar, CircleCheck, Handshake, Layers, SlidersHorizontal, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PROGRAM_TYPES } from '@/services/api';
import { Button, DateRangePicker, Drawer, MultiSelect } from '@/components/ui';
import { FilterSection as Section } from '../../clients/components/FilterSection';
import { EMPTY_FILTERS, RUN_PRESETS, filterProjects, presetRange } from './projectFilters';
import { STAGES, STAGE_LABEL } from './projectMeta';

const chip = (selected) =>
  cn(
    'inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
    selected ? 'border-primary/40 bg-primary-soft text-primary-text' : 'border-border-strong text-text-secondary hover:border-text-muted/40 hover:text-text',
  );
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/**
 * Filter projects. Edits a draft; nothing changes until "Show N projects", which counts live over the list as the
 * pills and search already narrow it (`base`). `projects` = every project (for the client / owner / delivery choices).
 */
export function ProjectFiltersDrawer({ open, onClose, filters, onApply, projects, base }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = filterProjects(base, draft).length;

  const clients = useMemo(() => {
    const map = new Map(projects.map((p) => [p.client.id, p.client.name]));
    return [...map].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
  }, [projects]);
  const owners = useMemo(() => [...new Set(projects.map((p) => p.owner))].sort().map((o) => ({ value: o, label: o })), [projects]);
  const units = useMemo(() => [...new Set(projects.flatMap((p) => p.programs.map((g) => g.subEntity)))].sort(), [projects]);

  const pickRuns = (key) => set(key ? { runsKey: key, range: key === 'custom' ? (draft.runsKey === 'custom' ? draft.range : null) : presetRange(key) } : { runsKey: null, range: null });
  const runChips = [{ key: null, label: 'Any time' }, ...RUN_PRESETS, { key: 'custom', label: 'Custom' }];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter projects"
      description="By status, client, owner, programs or dates"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft(EMPTY_FILTERS)}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching projects' : `Show ${count} project${count === 1 ? '' : 's'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Section icon={CircleCheck} tone="green" title="Status" onClear={draft.stages.length ? () => set({ stages: [] }) : undefined}>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button key={s} type="button" aria-pressed={draft.stages.includes(s)} onClick={() => set({ stages: toggle(draft.stages, s) })} className={chip(draft.stages.includes(s))}>
                {STAGE_LABEL[s]}
              </button>
            ))}
          </div>
        </Section>

        <Section icon={Calendar} tone="blue" title="Runs" onClear={draft.runsKey ? () => pickRuns(null) : undefined}>
          <div className="flex flex-wrap gap-2">
            {runChips.map((p) => (
              <button key={p.key ?? 'any'} type="button" aria-pressed={draft.runsKey === p.key} onClick={() => pickRuns(p.key)} className={chip(draft.runsKey === p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          {draft.runsKey === 'custom' && (
            <div className="animate-fade-in">
              <DateRangePicker value={draft.range} onChange={(range) => set({ range, runsKey: 'custom' })} placeholder="From – To" presets={[]} />
            </div>
          )}
        </Section>

        <Section icon={Building2} tone="amber" title="Client" onClear={draft.clients.length ? () => set({ clients: [] }) : undefined}>
          <MultiSelect options={clients} value={draft.clients} onChange={(v) => set({ clients: v })} placeholder="Any client" searchPlaceholder="Search clients…" />
        </Section>

        <Section icon={UserRound} tone="violet" title="Owner" onClear={draft.owners.length ? () => set({ owners: [] }) : undefined}>
          <MultiSelect options={owners} value={draft.owners} onChange={(v) => set({ owners: v })} placeholder="Anyone" searchPlaceholder="Search people…" />
        </Section>

        <Section icon={Layers} tone="green" title="Program type" onClear={draft.types.length ? () => set({ types: [] }) : undefined}>
          <div className="flex flex-wrap gap-2">
            {PROGRAM_TYPES.map((t) => (
              <button key={t} type="button" aria-pressed={draft.types.includes(t)} onClick={() => set({ types: toggle(draft.types, t) })} className={chip(draft.types.includes(t))}>
                {t}
              </button>
            ))}
          </div>
        </Section>

        <Section icon={Handshake} tone="blue" title="Delivered by" onClear={draft.units.length ? () => set({ units: [] }) : undefined}>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <button key={u} type="button" aria-pressed={draft.units.includes(u)} onClick={() => set({ units: toggle(draft.units, u) })} className={chip(draft.units.includes(u))}>
                {u}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </Drawer>
  );
}
