import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Download, Eye, Layers, Shuffle, ShieldCheck, UploadCloud, Users, UserRoundCog } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { programsApi } from '@/services/api';
import { Button, Card, Select } from '@/components/ui';
import { EmptyState, ErrorState, Skeleton } from '@/components/feedback';
import { TabHeader } from '@/shared/clients/detail/TabHeader';
import { FILE_KINDS, KIND_ORDER, plural, useContentStages } from './contentStages';
import { StageDot } from './UploadContentTab';

// Who the permissions are for, and what they can do with an element's files
const AUDIENCES = [
  { value: 'trainer', label: 'Trainers', icon: UserRoundCog },
  { value: 'participant', label: 'Participants', icon: Users },
];
const LEVELS = [
  { value: 'read', label: 'View only', icon: Eye, hint: 'Can open it in the app, can’t download' },
  { value: 'download', label: 'Download only', icon: Download, hint: 'Can download the files' },
  { value: 'both', label: 'View & download', icon: Layers, hint: 'Can open it and download it' },
];
const LEVEL_BY_VALUE = Object.fromEntries(LEVELS.map((l) => [l.value, l]));
const LEVEL_OPTIONS = LEVELS.map(({ value, label }) => ({ value, label }));
const MIXED = 'mixed';
// The shared grid: what it is, then one column per audience (lg+); everything stacks below that
const COLS = 'lg:grid lg:grid-cols-[minmax(0,1fr)_13.5rem_13.5rem] lg:items-center lg:gap-x-5';

/**
 * Content Permissions (program page) — picked from previews: "Two aligned columns". Trainers and Participants side by
 * side under column headings; each module (Pre-program / During / Post-program) is one row with a dropdown per
 * audience (View only · Download only · View & download) that sets every element in it. "Customise per element" opens
 * the module's elements as rows (kind icon, name, what's in it) with their own two dropdowns in the same columns; a
 * module whose elements differ reads "Mixed" and opens by itself. Changes are drafts (owned by the page, so they
 * survive switching tabs): a changed dropdown gets a dot and a save bar (n changes · Discard · Save permissions)
 * appears until saved. On smaller screens each dropdown carries its audience label. `onOpenUpload` → Upload Content.
 */
export function ContentPermissionsTab({ program, draft, setDraft, onOpenUpload }) {
  const toast = useToast();
  const { user } = useAuth();
  const { data, loading, error, reload, setData } = useAsync(() => programsApi.content(program.id), [program.id]);
  const { stages } = useContentStages(program.id); // one row per module of this program
  const [expanded, setExpanded] = useState({}); // { [stage]: bool } — unset follows "is it mixed?"
  const [saving, setSaving] = useState(false);
  useEffect(() => setExpanded({}), [program.id]);

  const saved = useMemo(() => {
    const map = {};
    if (data) Object.values(data).forEach((list) => list.forEach((e) => (map[e.id] = e.permissions)));
    return map;
  }, [data]);
  // Drop drafts for elements deleted meanwhile (and ones now equal to what's saved)
  useEffect(() => {
    if (!data) return;
    setDraft((d) => {
      let dropped = false;
      const next = {};
      for (const [id, aud] of Object.entries(d)) {
        const kept = saved[id] ? Object.fromEntries(Object.entries(aud).filter(([a, lvl]) => saved[id][a] !== lvl)) : {};
        if (Object.keys(kept).length) next[id] = kept;
        if (Object.keys(kept).length !== Object.keys(aud).length) dropped = true;
      }
      return dropped ? next : d;
    });
  }, [data, saved, setDraft]);

  const value = (id, aud) => draft[id]?.[aud] ?? saved[id]?.[aud];
  const isChanged = (id, aud) => draft[id]?.[aud] !== undefined;
  const changedCount = Object.values(draft).reduce((n, d) => n + Object.keys(d).length, 0);
  const total = data && stages ? stages.reduce((n, s) => n + (data[s.key]?.length ?? 0), 0) : 0;

  // Set one element for one audience; setting it back to the saved value drops it from the draft
  const setCell = (id, aud, level) =>
    setDraft((d) => {
      const next = { ...d, [id]: { ...d[id] } };
      if (saved[id]?.[aud] === level) delete next[id][aud];
      else next[id][aud] = level;
      if (!Object.keys(next[id]).length) delete next[id];
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      const fresh = await programsApi.savePermissions(program.id, draft, user?.name ?? 'You');
      const n = Object.keys(draft).filter((elId) => saved[elId]).length; // elements that still exist
      setData(fresh);
      setDraft({});
      toast.success('Permissions saved', { description: `${plural(n, 'element')} updated` });
    } catch (e) {
      toast.error('Couldn’t save the permissions', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card tint="success" subtleTint flatOnMobile padding="none" className="flex flex-col">
      <TabHeader icon={ShieldCheck} tone="success" title="Content Permissions" description="Choose what trainers and participants can do with the content." hideTitleOnMobile />

      {error && !data ? (
        <ErrorState compact title="Couldn’t load the content" description={error.message} onRetry={reload} />
      ) : (loading && !data) || !stages ? (
        <div className="space-y-3 px-5 pb-6 sm:px-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No content yet"
          description="Add elements under Upload Content first — their permissions are set here."
          action={
            <Button variant="secondary" leftIcon={UploadCloud} onClick={onOpenUpload}>
              Go to Upload Content
            </Button>
          }
          className="flex-1 border-t border-border"
        />
      ) : (
        <div className="flex flex-1 flex-col">
          {/* Column headings (lg+) */}
          <div className={cn('hidden border-y border-border-strong bg-surface-sunken/40 px-5 py-2.5 sm:px-6', COLS)}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Module</span>
            {AUDIENCES.map((a) => (
              <span key={a.value} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                <a.icon className="size-3.5" aria-hidden="true" />
                {a.label}
              </span>
            ))}
          </div>

          <div className="divide-y divide-border-strong border-t border-border-strong max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:divide-y-0 max-sm:border-t-0 max-sm:px-3 lg:border-t-0">
            {stages.map((s, i) => {
              const items = data[s.key] ?? [];
              const levelFor = (aud) => {
                const set = [...new Set(items.map((e) => value(e.id, aud)))];
                return set.length > 1 ? MIXED : set[0];
              };
              const mixed = AUDIENCES.some((a) => levelFor(a.value) === MIXED);
              const open = items.length > 0 && (expanded[s.key] ?? mixed);
              return (
                <ModuleRow
                  key={s.key}
                  stage={s}
                  n={i + 1}
                  items={items}
                  levelFor={levelFor}
                  open={open}
                  onToggle={() => setExpanded((x) => ({ ...x, [s.key]: !open }))}
                  onSetAll={(aud, level) => items.forEach((e) => setCell(e.id, aud, level))}
                  value={value}
                  isChanged={isChanged}
                  onSet={setCell}
                />
              );
            })}
          </div>

          {/* Save bar — only while there are unsaved changes */}
          {changedCount > 0 && (
            <div className="sticky bottom-4 z-10 max-md:bottom-[calc(5.125rem+env(safe-area-inset-bottom))] mx-5 mb-6 mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-border-strong bg-elevated/95 px-4 py-3 shadow-raised backdrop-blur animate-fade-in sm:mx-6">
              <span className="inline-flex items-center gap-2 text-[13px] text-text-secondary">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-semibold tabular-nums text-text">{plural(changedCount, 'change')}</span> not saved yet
              </span>
              <span className="ml-auto flex gap-2">
                <Button variant="ghost" onClick={() => setDraft({})} disabled={saving}>
                  Discard
                </Button>
                <Button onClick={save} loading={saving}>
                  Save permissions
                </Button>
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/** One module: name + count + the Customise toggle, a dropdown per audience that sets every element, then the elements when open */
function ModuleRow({ stage: s, n, items, levelFor, open, onToggle, onSetAll, value, isChanged, onSet }) {
  const empty = items.length === 0;
  const anyChanged = items.some((e) => AUDIENCES.some((a) => isChanged(e.id, a.value)));
  return (
    <section aria-label={s.label} className="px-5 py-4 max-sm:rounded-card max-sm:border max-sm:border-border-strong max-sm:bg-surface/70 max-sm:p-4 max-sm:shadow-xs sm:px-6 dark:max-sm:bg-surface-secondary/60">
      <div className={cn('flex flex-col gap-3', COLS)}>
        <div className="flex min-w-0 items-start gap-3 max-sm:items-center">
          <StageDot stage={s} n={n} soft />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-text">
              {s.label}
              {anyChanged && <span className="size-1.5 rounded-full bg-primary" title="Changed — not saved yet" aria-hidden="true" />}
            </p>
            <p className="text-xs tabular-nums text-text-muted">{empty ? 'No elements yet' : plural(items.length, 'element')}</p>
            {!empty && (
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="mt-2 inline-flex h-6 items-center gap-1 rounded-full bg-primary-soft/60 max-sm:hidden px-2.5 text-xs font-medium text-primary-text ring-1 ring-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {open ? 'Hide elements' : 'Customise per element'}
                <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* Phones: the per-element toggle sits on the right of the header instead of under the name */}
          {!empty && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="ml-auto inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-primary-text ring-1 ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:hidden"
            >
              {open ? 'Hide' : 'Customise'}
              <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
            </button>
          )}
        </div>

        {!empty && (
          <AudienceSelects
            name={s.label}
            what="every element in"
            levelFor={levelFor}
            onChange={(aud, level) => level !== MIXED && onSetAll(aud, level)}
            className="max-sm:border-t max-sm:border-dashed max-sm:border-border-strong max-sm:pt-3 sm:pl-11 lg:contents lg:pl-0"
          />
        )}
      </div>

      {/* The module's elements: a soft guide line from the module's number, then one row each (same columns) */}
      {open && (
        <ul className="relative mt-3 animate-fade-in before:absolute before:bottom-3 before:left-4 before:top-0 before:w-px before:bg-border-strong max-sm:before:left-0.5">
          {items.map((e) => (
            <ElementRow key={e.id} element={e} value={value} isChanged={isChanged} onSet={onSet} />
          ))}
        </ul>
      )}
    </section>
  );
}

/** One element under its module: kind icon, name, what's in it — and its two dropdowns in the module's columns */
function ElementRow({ element: e, value, isChanged, onSet }) {
  const byKind = KIND_ORDER.map((k) => [k, e.files.filter((f) => f.kind === k).length]).filter(([, n]) => n);
  const K = FILE_KINDS[byKind[0]?.[0] ?? 'document'];
  const summary = byKind.map(([k, n]) => `${n} ${(n === 1 ? FILE_KINDS[k].label : FILE_KINDS[k].plural).toLowerCase()}`).join(' · ');
  return (
    <li className={cn('flex flex-col gap-2.5 py-2.5 pl-11 max-sm:pl-4', COLS)}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-lg', K.tile)} aria-hidden="true">
          <K.icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-text" title={e.name}>
            {e.name}
          </p>
          <p className="truncate text-xs text-text-muted">{summary || 'No files'}</p>
        </div>
      </div>
      <AudienceSelects
        name={e.name}
        what=""
        levelFor={(aud) => value(e.id, aud)}
        changed={(aud) => isChanged(e.id, aud)}
        onChange={(aud, level) => onSet(e.id, aud, level)}
        className="lg:contents"
        small
      />
    </li>
  );
}

/**
 * The two dropdowns (Trainers, Participants). On lg they drop into the row's grid columns (`lg:contents`); below that
 * they sit side by side (stacked on phones), each with its audience label. A changed one gets a dot on its corner.
 */
function AudienceSelects({ name, what, levelFor, changed, onChange, className, small }) {
  return (
    <div className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3', className)}>
      {AUDIENCES.map((a) => {
        const level = levelFor(a.value);
        const mixed = level === MIXED;
        const dirty = changed?.(a.value);
        return (
          <label key={a.value} className="relative flex min-w-0 flex-col gap-1 max-sm:flex-row max-sm:items-center max-sm:justify-between max-sm:gap-3">
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary lg:hidden', small && 'text-[11px]')}>
              <a.icon className="size-3.5 text-text-muted" aria-hidden="true" />
              {a.label}
            </span>
            <div className="min-w-0 max-sm:w-[60%]">
            <Select
              size="sm"
              leftIcon={mixed ? Shuffle : LEVEL_BY_VALUE[level]?.icon}
              aria-label={`What ${a.label.toLowerCase()} can do with ${what ? `${what} ` : ''}${name}`}
              title={mixed ? 'Its elements differ — pick one to set them all' : LEVEL_BY_VALUE[level]?.hint}
              value={level}
              onChange={(ev) => onChange(a.value, ev.target.value)}
              options={mixed ? [{ value: MIXED, label: 'Mixed', disabled: true }, ...LEVEL_OPTIONS] : LEVEL_OPTIONS}
            />
            </div>
            {dirty && (
              <span
                className="absolute -right-1 bottom-6 size-2 rounded-full bg-primary ring-2 ring-surface lg:-top-1 lg:bottom-auto"
                title="Changed — not saved yet"
                aria-hidden="true"
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
