import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronDown, ChevronRight, ExternalLink, FileText, FolderOpen, Library, Link2, PlayCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/hooks/useToast';
import { useRetained } from '@/hooks/useRetained';
import { programWorkspaceApi } from '@/services/api';
import { Button, Modal, Switch } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { shortDate } from '../../components/projectMeta';
import { LIVE_TYPES, STEP_TYPES, moduleStage } from '../workspaceMeta';

const CONTENT_TYPES = ['self', 'virtual', 'inperson'];
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
// File-type count chips: documents violet, videos red, links blue
const KIND_CHIP = {
  document: { label: (n) => plural(n, 'doc'), className: 'bg-chart-4/10 text-chart-4' },
  video: { label: (n) => plural(n, 'video'), className: 'bg-danger-soft text-danger' },
  url: { label: (n) => plural(n, 'link'), className: 'bg-chart-1/10 text-chart-1' },
};
const KIND_ICON = { document: FileText, video: PlayCircle, url: Link2 };

/** One Manage Content element to give to participants / put in the trainer e-kit */
function ElementCard({ el, live, items, ekit, onToggle, onPreview }) {
  const [open, setOpen] = useState(false);
  const given = items.includes(el.id);
  const inKit = ekit.includes(el.id);
  const counts = el.files.reduce((acc, f) => ({ ...acc, [f.kind]: (acc[f.kind] ?? 0) + 1 }), {});
  return (
    <li className={cn('rounded-xl border px-4 py-3.5 transition-colors', given || inKit ? 'border-primary/40 bg-primary-soft/40' : 'border-border-strong bg-surface dark:bg-surface-secondary')}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-text">{el.name}</p>
          {el.description && <p className="mt-0.5 text-xs text-text-muted">{el.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {Object.entries(counts).map(([kind, n]) => (
              <span key={kind} className={cn('rounded-full px-2 py-px text-[11px] font-semibold', KIND_CHIP[kind]?.className)}>
                {KIND_CHIP[kind]?.label(n) ?? n}
              </span>
            ))}
            {el.files.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="inline-flex items-center gap-0.5 rounded px-1 text-[11px] font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Files
                <ChevronDown className={cn('size-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Switch size="sm" label="Give to participants" checked={given} onChange={() => onToggle('items', el.id)} />
          {live && <Switch size="sm" label="Add to trainer e-kit" checked={inKit} onChange={() => onToggle('ekit', el.id)} />}
        </div>
      </div>
      {open && (
        <ul className="mt-3 flex animate-fade-in flex-col gap-1 border-t border-border pt-3">
          {el.files.map((f) => {
            const Icon = KIND_ICON[f.kind] ?? FileText;
            const link = f.kind === 'url';
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => (link ? window.open(f.url, '_blank', 'noopener,noreferrer') : onPreview(f))}
                  className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs text-text-secondary hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{f.title ?? f.name}</span>
                  {link && <ExternalLink className="size-3 shrink-0" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

/** Pick which Manage Content elements a journey step gives to participants and puts in the trainer e-kit */
function ContentModal({ open, step, ws, onClose, onSaved }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState(() => step?.items ?? []);
  const [ekit, setEkit] = useState(() => step?.ekit ?? []);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  if (!step) return null;
  const moduleName = ws.modules.find((m) => m.id === step.module)?.name ?? 'this module';
  const stage = moduleStage(moduleName);
  const elements = (stage && ws.library?.stages[stage]) || [];
  const live = LIVE_TYPES.includes(step.type);
  const toggle = (which, id) => (which === 'items' ? setItems : setEkit)((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const save = async () => {
    setSaving(true);
    try {
      const next = await programWorkspaceApi.saveStepContent(ws.project.id, ws.program.id, step.id, { items, ekit: live ? ekit : [] });
      onSaved(next);
      toast.success('Content saved', { description: step.name });
    } catch (e) {
      toast.error('Couldn’t save the content', { description: e.message });
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon={Library}
      title="Content and kits"
      description={`${step.name} · ${STEP_TYPES[step.type].label} · ${moduleName}`}
      footer={
        <>
          <p className="basis-full text-xs text-text-muted sm:mr-auto sm:basis-auto">
            {plural(items.length, 'element')} for participants{live ? ` · ${ekit.length} in the trainer e-kit` : ''}
          </p>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      {ws.library && (
        <p className="mb-4 flex flex-wrap items-center gap-x-2 text-[13px] text-text-secondary">
          <span>
            From <span className="font-semibold text-text">{ws.library.programName}</span> in Manage Content
          </span>
          <button type="button" onClick={() => navigate(`/content/${ws.library.programId}`)} className="font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Open in Manage Content
          </button>
        </p>
      )}
      {elements.length === 0 ? (
        <EmptyState compact icon={FolderOpen} title={`Nothing in ${moduleName} yet`} description="Add elements to the program in Manage Content, then pick them here." />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {elements.map((el) => (
            <ElementCard key={el.id} el={el} live={live} items={items} ekit={ekit} onToggle={toggle} onPreview={setPreview} />
          ))}
        </ul>
      )}
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </Modal>
  );
}

/** Learning journey › Content and kits: each learning step's materials (and e-kit for live sessions) from Manage Content */
export function ContentStep({ ws, slot, onChange }) {
  const navigate = useNavigate();
  const [stepId, setStepId] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const current = ws.journey.find((s) => s.id === stepId) ?? null;
  const shown = useRetained(current);
  const steps = ws.journey.filter((s) => CONTENT_TYPES.includes(s.type));
  const moduleName = (id) => ws.modules.find((m) => m.id === id)?.name ?? '—';

  return (
    <div className="flex flex-col">
      {slot &&
        createPortal(
          <Button size="sm" variant="secondary" leftIcon={FolderOpen} onClick={() => navigate(ws.library ? `/content/${ws.library.programId}` : '/content')}>
            Manage Content
          </Button>,
          slot,
        )}
      {steps.length === 0 ? (
        <EmptyState icon={Library} title="No learning steps yet" description="Add self-learning modules or sessions in Sessions and schedule first." />
      ) : (
        <ul className="divide-y divide-border">
          {steps.map((s) => {
            const T = STEP_TYPES[s.type];
            const live = LIVE_TYPES.includes(s.type);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setFormKey((k) => k + 1);
                    setStepId(s.id);
                  }}
                  className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:px-6"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
                    <T.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-text group-hover:text-primary-text">{s.name}</span>
                    <span className="block text-xs text-text-muted">
                      {moduleName(s.module)} · {shortDate(s.date)}
                    </span>
                  </span>
                  <span className="hidden shrink-0 flex-col items-end gap-0.5 text-xs sm:flex">
                    <span className={cn('inline-flex items-center gap-1', s.items.length ? 'text-text-secondary' : 'font-medium text-warning')}>
                      <FileText className="size-3.5" aria-hidden="true" />
                      {s.items.length ? plural(s.items.length, 'material') : 'No material'}
                    </span>
                    {live && (
                      <span className={cn('inline-flex items-center gap-1', s.ekit.length ? 'text-text-secondary' : 'font-medium text-warning')}>
                        <Briefcase className="size-3.5" aria-hidden="true" />
                        {s.ekit.length ? `${s.ekit.length} e-kit` : 'No e-kit'}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <ContentModal
        key={formKey}
        open={current !== null}
        step={current ?? shown}
        ws={ws}
        onClose={() => setStepId(null)}
        onSaved={(next) => {
          onChange(next);
          setStepId(null);
        }}
      />
    </div>
  );
}
