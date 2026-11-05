import { useEffect, useState } from 'react';
import { Building2, Check, DatabaseZap, FileCheck2, Loader2, MapPinned, ReceiptText } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui';

/** What gets pulled from the CRM portal, in the order it "arrives" */
export const CRM_STAGES = [
  { label: 'Company profile', detail: 'Type, industry, website & contacts', icon: Building2 },
  { label: 'Addresses', detail: 'Communication & office', icon: MapPinned },
  { label: 'Billing & GST', detail: 'Billing addresses and GST numbers', icon: ReceiptText },
  { label: 'Documents & logo', detail: 'GST & TDS certificates, logo', icon: FileCheck2 },
];
export const CRM_STAGE_MS = 450;

/** Live "Fetching from CRM portal" card: each stage ticks off in turn with a progress bar */
export function CrmFetchCard({ name }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, CRM_STAGES.length - 1)), CRM_STAGE_MS);
    return () => clearInterval(t);
  }, []);
  const pct = Math.round(((stage + 0.5) / CRM_STAGES.length) * 100);

  return (
    <Card tint="primary" subtleTint aria-live="polite" aria-busy="true" className="animate-fade-in">
      <div className="flex items-center gap-3.5">
        <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
          <span className="absolute inset-0 rounded-xl ring-2 ring-chart-1/25 motion-safe:animate-ping" aria-hidden="true" />
          <DatabaseZap className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-text">Fetching from CRM portal…</p>
          <p className="truncate text-[13px] text-text-secondary">
            Pulling everything we have on <span className="font-medium text-text">{name}</span>
          </p>
        </div>
        <span className="text-xs font-semibold tabular-nums text-primary-text">{pct}%</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-text-muted/15" aria-hidden="true">
        <div className="h-full rounded-full bg-gradient-to-r from-chart-1 to-chart-4 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>

      <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CRM_STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'current' : 'waiting';
          return (
            <li
              key={s.label}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-300',
                state === 'waiting' ? 'border-border-strong bg-surface/40 dark:bg-surface-sunken/30' : 'border-border-strong bg-surface/80 shadow-xs dark:bg-surface-sunken/60',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300',
                  state === 'done' ? 'bg-success-main/12 text-success' : state === 'current' ? 'bg-chart-1/10 text-chart-1' : 'bg-text-muted/10 text-text-muted',
                )}
              >
                {state === 'done' ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : state === 'current' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <s.icon className="size-4" aria-hidden="true" />}
              </span>
              <span className="min-w-0">
                <span className={cn('block text-[13px] font-semibold', state === 'waiting' ? 'text-text-secondary' : 'text-text')}>{s.label}</span>
                <span className="block truncate text-xs text-text-muted">{s.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/** Slim strip on each step once the CRM data is in */
export function CrmBanner({ name, step }) {
  return (
    <div className="flex animate-fade-in items-center gap-3 rounded-card border border-chart-1/20 bg-gradient-to-r from-chart-1/[0.08] via-chart-4/[0.04] to-transparent px-4 py-3">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
        <DatabaseZap className="size-4" aria-hidden="true" />
      </span>
      <p className="min-w-0 flex-1 text-[13px] text-text-secondary">
        <span className="font-semibold text-text">{step} pre-filled from CRM portal</span>
        <span className="hidden sm:inline"> · {name} · review and edit anything that’s changed.</span>
      </p>
      <span className="hidden shrink-0 items-center gap-1 rounded-full bg-success-main/12 px-2 py-0.5 text-[11px] font-semibold text-success sm:inline-flex">
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
        Synced
      </span>
    </div>
  );
}
