import { AlertCircle, Calendar, Check, Copy, DatabaseZap, FilePlus, FolderKanban, Hash, Info, PenLine, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { startOfDay } from '@/utils/formatDate';
import { Button, Card, CardHeader, DatePicker, FormField, Input, SearchableSelect, Select } from '@/components/ui';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { shortDate } from './projectMeta';

/** A step's error under a control that isn't a FormField (radio tiles, chips) */
export function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="flex items-start gap-1.5 text-xs text-danger" role="alert">
      <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

/** One choice in a radio-tile group: icon tile, title (+ optional tag), a line of text and a round check */
function RadioTile({ checked, onSelect, icon: Icon, iconClass, title, text, tag, disabled, invalid }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        checked ? 'border-primary/50 bg-primary-soft/60' : 'border-border-strong bg-surface hover:border-text-muted/40 hover:shadow-xs dark:bg-surface-secondary',
        invalid && !checked && 'border-danger/60',
        disabled && 'cursor-not-allowed opacity-55 hover:border-border-strong hover:shadow-none',
      )}
    >
      <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl', iconClass)}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">{title}</span>
          {tag && <span className="rounded-full bg-chart-1/10 px-1.5 py-px text-[10px] font-semibold text-chart-1">{tag}</span>}
        </span>
        <span className="mt-0.5 block text-[13px] text-text-secondary">{text}</span>
      </span>
      <span
        className={cn('inline-flex size-5 shrink-0 items-center justify-center rounded-full', checked ? 'bg-primary text-primary-fg' : 'bg-surface ring-1 ring-inset ring-border-strong dark:bg-surface-sunken')}
        aria-hidden="true"
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

/** "Pre-filled from CRM portal" banner above a step's card */
export function CrmBanner({ what, opp, clientName }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-chart-1/20 bg-gradient-to-r from-chart-1/[0.08] to-transparent px-4 py-3 sm:px-5">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-1/12 text-chart-1">
        <DatabaseZap className="size-4" aria-hidden="true" />
      </span>
      <p className="min-w-0 flex-1 text-[13px] text-text-secondary">
        <span className="font-semibold text-text">{what} pre-filled from CRM portal</span> · OPP-{opp} · {clientName} · review and edit anything that’s changed.
      </p>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
        Synced
      </span>
    </div>
  );
}

/** Step 1 — do you have an opportunity ID? Yes: fetch it from the CRM. No: client, program and who delivers it. */
export function StartStep({ v, set, err, lookups, oppError, looking, onFetch, onChange }) {
  const opp = v.opp;
  return (
    <Card tint="primary" faintTint>
      <CardHeader icon={Sparkles} iconTone="primary" title="Do you have an opportunity ID?" description="With a won opportunity from the CRM portal, the details fill themselves in." />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div role="radiogroup" aria-label="Do you have an opportunity ID?" className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <RadioTile
              checked={v.start === 'yes'}
              onSelect={() => set('start', 'yes')}
              icon={DatabaseZap}
              iconClass="bg-chart-1/12 text-chart-1"
              title="Yes, I have one"
              tag="Fastest"
              text="Fetch it from the CRM portal"
              invalid={Boolean(err('start'))}
            />
            <RadioTile
              checked={v.start === 'no'}
              onSelect={() => set('start', 'no')}
              icon={PenLine}
              iconClass="bg-chart-4/12 text-chart-4"
              title="No, start from scratch"
              text="Enter the details yourself"
              invalid={Boolean(err('start'))}
            />
          </div>
          <FieldError>{err('start')}</FieldError>
        </div>

        {v.start === 'yes' &&
          (opp ? (
            <div className="flex max-w-md animate-fade-in items-start gap-3.5 rounded-xl border border-border-strong bg-surface/70 p-4 dark:bg-surface-sunken/60">
              <ClientLogo client={opp.client} size="md" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-text">{opp.client.name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-px text-[11px] font-semibold text-success">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    OPP-{opp.oppId}
                  </span>
                </p>
                <p className="mt-1 text-[13px] font-medium text-text">{opp.program}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {opp.programType} · {opp.subEntity} · from {shortDate(opp.start)} · {opp.participants} people
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onChange}>
                Change
              </Button>
            </div>
          ) : (
            <div className="max-w-md animate-fade-in">
              <FormField label="Opportunity ID" required error={oppError ?? err('opp')} helper="Demo: any 4 digits — ones ending in 0 aren’t found.">
                <div className="flex gap-2">
                  <Input
                    leftIcon={Hash}
                    placeholder="e.g. OPP-3664"
                    inputMode="numeric"
                    value={v.oppInput}
                    onChange={(e) => set('oppInput', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onFetch();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={onFetch} loading={looking}>
                    Fetch
                  </Button>
                </div>
              </FormField>
            </div>
          ))}

        {v.start === 'no' && (
          <div className="grid max-w-2xl animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Client" required error={err('clientId')}>
              <SearchableSelect
                options={lookups.clients.map((c) => ({ value: c.id, label: c.name, description: c.code }))}
                value={v.clientId}
                onChange={(id) => set('clientId', id)}
                placeholder="Choose a client"
                searchPlaceholder="Search clients…"
              />
            </FormField>
            <FormField label="Program" required error={err('program')}>
              <SearchableSelect
                options={lookups.programs.map((p) => ({ value: p.name, label: p.name, description: p.type }))}
                value={v.program}
                onChange={(name) => set('program', name)}
                placeholder="Choose a program"
                searchPlaceholder="Search programs…"
              />
            </FormField>
            <FormField label="Delivered by" required error={err('subEntity')} className="sm:col-span-2">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Delivered by">
                {lookups.deliveredBy.map((d) => {
                  const on = v.subEntity === d.subEntity;
                  return (
                    <button
                      key={d.subEntity}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-invalid={Boolean(err('subEntity')) || undefined}
                      title={d.entity}
                      onClick={() => set('subEntity', d.subEntity)}
                      className={cn(
                        'inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                        on ? 'border-primary/40 bg-primary-soft text-primary-text' : 'border-border-strong text-text-secondary hover:border-text-muted/40 hover:text-text',
                        !on && err('subEntity') && 'border-danger/60',
                      )}
                    >
                      {d.subEntity}
                    </button>
                  );
                })}
              </div>
            </FormField>
          </div>
        )}
      </div>
    </Card>
  );
}

/** Step 2 — the project's name and type */
export function ProjectStep({ v, set, err, clientName, types }) {
  return (
    <Card tint="info" faintTint>
      <CardHeader icon={FolderKanban} iconTone="info" title="Name the project" description={`It groups the programs you run for ${clientName ?? 'this client'}.`} />
      <div className="grid max-w-md gap-5">
        <FormField label="Project name" required error={err('name')}>
          <Input placeholder="e.g. 2027 Manager Development" maxLength={80} value={v.name} onChange={(e) => set('name', e.target.value)} />
        </FormField>
        <FormField label="Project type" required helper="Coaching, ICF and Assessment Center setups are coming soon.">
          <Select options={types} value={v.projectType} onChange={(e) => set('projectType', e.target.value)} />
        </FormField>
      </div>
    </Card>
  );
}

/** Step 3 — copy an earlier batch of this client, or start empty */
export function HowStep({ v, set, err, clientName, earlier }) {
  const none = earlier.length === 0;
  return (
    <Card tint="violet" faintTint>
      <CardHeader icon={FilePlus} iconTone="violet" title="How do you want to start?" description={`Copy a batch you already ran for ${clientName ?? 'this client'}, or start from scratch.`} />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div role="radiogroup" aria-label="How do you want to start?" className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <RadioTile
              checked={v.how === 'copy'}
              onSelect={() => set('how', 'copy')}
              icon={Copy}
              iconClass="bg-success-main/12 text-success"
              title="Copy an earlier program"
              text={none ? 'No earlier batches yet' : 'Reuse a batch — fastest'}
              disabled={none}
              invalid={Boolean(err('how'))}
            />
            <RadioTile
              checked={v.how === 'empty'}
              onSelect={() => set('how', 'empty')}
              icon={FilePlus}
              iconClass="bg-chart-4/12 text-chart-4"
              title="Start empty"
              text="Add each session yourself"
              invalid={Boolean(err('how'))}
            />
          </div>
          <FieldError>{err('how')}</FieldError>
        </div>

        {v.how === 'copy' && (
          <div className="flex max-w-2xl animate-fade-in flex-col gap-2">
            <p className="text-[13px] font-medium text-text">Copy which program?</p>
            <div role="radiogroup" aria-label="Copy which program?" className="flex flex-col gap-2">
              {earlier.map((g) => {
                const on = v.copyFrom === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-invalid={Boolean(err('copyFrom')) || undefined}
                    onClick={() => set('copyFrom', g.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      on ? 'border-primary/50 bg-primary-soft/60' : 'border-border-strong bg-surface hover:border-text-muted/40 dark:bg-surface-secondary',
                      !on && err('copyFrom') && 'border-danger/60',
                    )}
                  >
                    <span className={cn('inline-flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset', on ? 'ring-primary' : 'ring-border-strong')} aria-hidden="true">
                      {on && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-text">
                        {g.program} · {g.cohort}
                      </span>
                      <span className="block truncate text-xs text-text-muted">{g.projectName}</span>
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-text-secondary">{shortDate(g.start)}</span>
                  </button>
                );
              })}
            </div>
            {err('copyFrom') ? (
              <FieldError>{err('copyFrom')}</FieldError>
            ) : (
              <p className="text-xs text-text-muted">Sessions, content, assessments, facilitator and venue come across — participants and the agreement don’t.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/** Step 4 — the first day and the batch name */
export function ScheduleStep({ v, set, err }) {
  return (
    <Card tint="success" faintTint>
      <CardHeader icon={Calendar} iconTone="success" title="When does it start?" description="And what do you call this batch?" />
      <div className="flex flex-col gap-5">
        <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First day" required error={err('firstDay')} helper="When pre-work opens">
            <DatePicker value={v.firstDay} onChange={(d) => set('firstDay', d)} minDate={startOfDay(new Date())} placeholder="Pick a date" />
          </FormField>
          <FormField label="Batch name" required error={err('cohort')} helper="Shown next to the program name">
            <Input placeholder="e.g. Cohort B" maxLength={40} value={v.cohort} onChange={(e) => set('cohort', e.target.value)} />
          </FormField>
        </div>
        <p className="flex items-start gap-2 text-xs text-text-muted">
          <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          After you create it, the program opens with every setup step listed — nothing is locked.
        </p>
      </div>
    </Card>
  );
}
