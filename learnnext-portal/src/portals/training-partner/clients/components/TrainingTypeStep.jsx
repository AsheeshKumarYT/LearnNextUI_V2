import { Building2, Check, DatabaseZap, UserRound, UsersRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FormCard } from '@/shared/clients/components/clientFormFields';

const OPTIONS = [
  {
    value: 'company',
    icon: Building2,
    title: 'Company',
    text: 'An organisation and its teams',
    needs: ['Company type, industry & contacts', 'Communication & office address', 'Billing addresses, GST & TDS'],
    tile: 'bg-chart-1/12 text-chart-1',
    crm: true, // details come from the CRM portal
  },
  {
    value: 'individual',
    icon: UserRound,
    title: 'Individual',
    text: 'One person, billed directly',
    needs: ['Name, email, mobile & Govt. ID', 'Communication address', 'GST & TDS (if applicable)'],
    tile: 'bg-chart-4/12 text-chart-4',
  },
];

/** Step 1 — two choice cards with what each needs; picking one moves on */
export function TrainingTypeStep({ value, onChange, error }) {
  return (
    // The card fills the page height, so the two choices sit centred in it rather than leaving a gap below
    <FormCard icon={UsersRound} tone="primary" title="Who is the training for?" description="This decides which details we ask for next." className="flex flex-col">
      <div className="flex flex-1 flex-col justify-center lg:pb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Training for">
          {OPTIONS.map((o) => {
            const on = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange(o.value)}
                className={cn(
                  'flex flex-col rounded-xl border p-5 text-left transition-[border-color,box-shadow,background-color] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
                  on ? 'border-primary/60 bg-primary-soft/50 shadow-raised' : 'border-border-strong bg-surface/60 hover:border-primary/40 hover:shadow-card dark:bg-surface-sunken/40',
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={cn('inline-flex size-12 items-center justify-center rounded-xl', o.tile)}>
                    <o.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="flex items-center gap-2.5">
                    {o.crm && (
                      // Highlight: company details are fetched from the CRM portal, not typed in (same height as the other card)
                      <span
                        title="Pick the company — details, addresses, GST, documents & logo are fetched for you."
                        className="inline-flex items-center gap-1.5 rounded-full border border-chart-1/25 bg-gradient-to-r from-chart-1/[0.10] to-chart-4/[0.06] px-2.5 py-1 text-[11px] font-semibold text-chart-1"
                      >
                        <DatabaseZap className="size-3.5" aria-hidden="true" />
                        Auto-filled from CRM
                      </span>
                    )}
                    <span
                      className={cn('inline-flex size-5 items-center justify-center rounded-full border-2', on ? 'border-primary bg-primary text-primary-fg' : 'border-border-strong')}
                      aria-hidden="true"
                    >
                      {on && <Check className="size-3" strokeWidth={3} />}
                    </span>
                  </span>
                </span>
                <span className="mt-4 text-base font-semibold text-text">{o.title}</span>
                <span className="mt-0.5 text-sm text-text-secondary">{o.text}</span>
                <span className="mt-4 flex flex-col gap-2 border-t border-dashed border-border-strong pt-4">
                  {o.needs.map((n) => (
                    <span key={n} className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <Check className="size-3.5 shrink-0 text-success" aria-hidden="true" />
                      {n}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        {error && <p className="mt-3 text-xs font-medium text-danger">{error}</p>}
      </div>
    </FormCard>
  );
}
