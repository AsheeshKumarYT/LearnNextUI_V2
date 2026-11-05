import { useEffect, useMemo, useState } from 'react';
import { Building2, CalendarDays, CircleCheck, Hash, Phone, SlidersHorizontal, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Button, DateRangePicker, Drawer, Input, MultiSelect, SegmentedControl } from '@/components/ui';
import { DATE_PRESETS, EMPTY_FILTERS, filterClients, presetRange } from './clientFilters';
import { FilterSection as Section } from './FilterSection';
import { CompanyNameField } from './CompanyNameField';

const STATUS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

/**
 * Filters panel. Edits a draft; nothing changes until "Show N clients", which previews the result count live.
 * `clients` = full list, `search` = the toolbar's quick search (kept, so the count matches what you'll see).
 */
export function ClientFiltersDrawer({ open, onClose, filters, onApply, clients, search }) {
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = filterClients(clients, draft, search).length;

  // People who created clients, A–Z, for the searchable picker
  const people = useMemo(() => [...new Set(clients.map((c) => c.createdBy))].sort().map((name) => ({ value: name, label: name })), [clients]);

  const pickPreset = (key) => set(key ? { rangeKey: key, range: key === 'custom' ? draft.range : presetRange(key) } : { rangeKey: null, range: null });
  const presetChips = [{ key: null, label: 'Any time' }, ...DATE_PRESETS, { key: 'custom', label: 'Custom' }];

  const chip = (selected) =>
    cn(
      'inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
      selected ? 'border-primary/40 bg-primary-soft text-primary-text' : 'border-border-strong text-text-secondary hover:border-text-muted/40 hover:text-text',
    );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter clients"
      description="By company, contact, creator or date"
      icon={SlidersHorizontal}
      // Soft tinted canvas so the section cards stand out
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_FILTERS, status: showStatus ? 'all' : draft.status })}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching clients' : `Show ${count} client${count === 1 ? '' : 's'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Status — phones only (the status pills cover it on larger screens, as on Facilitators and Support desk) */}
        {showStatus && (
          <Section icon={CircleCheck} tone="green" title="Status" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
            <SegmentedControl tabs={STATUS} value={draft.status} onChange={(status) => set({ status })} ariaLabel="Status" fullWidth />
          </Section>
        )}

        {/* Created — quick presets, Custom reveals the range picker */}
        <Section icon={CalendarDays} tone="blue" title="Created" onClear={draft.rangeKey ? () => pickPreset(null) : undefined}>
          <div className="flex flex-wrap gap-2">
            {presetChips.map((p) => (
              <button key={p.key ?? 'any'} type="button" aria-pressed={draft.rangeKey === p.key} onClick={() => pickPreset(p.key)} className={chip(draft.rangeKey === p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          {draft.rangeKey === 'custom' && (
            <div className="animate-fade-in">
              <DateRangePicker value={draft.range} onChange={(range) => set({ range, rangeKey: 'custom' })} placeholder="From – To" presets={[]} />
            </div>
          )}
        </Section>

        {/* Created by — searchable multi-select (scales to any number of people) */}
        <Section icon={UserRound} tone="violet" title="Created by" onClear={draft.createdBy.length ? () => set({ createdBy: [] }) : undefined}>
          <MultiSelect
            options={people}
            value={draft.createdBy}
            onChange={(createdBy) => set({ createdBy })}
            placeholder="Anyone"
            searchPlaceholder="Search people…"
          />
        </Section>

        {/* Company details — name suggests matching companies as you type */}
        <Section
          icon={Building2}
          tone="amber"
          title="Company details"
          onClear={draft.name || draft.code || draft.mobile ? () => set({ name: '', code: '', mobile: '' }) : undefined}
        >
          <CompanyNameField value={draft.name} onChange={(name) => set({ name })} clients={clients} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input leftIcon={Hash} placeholder="Company code" aria-label="Company code" value={draft.code} onChange={(e) => set({ code: e.target.value })} />
            <Input type="tel" leftIcon={Phone} placeholder="Mobile digits" aria-label="Mobile number" value={draft.mobile} onChange={(e) => set({ mobile: e.target.value })} />
          </div>
        </Section>
      </div>
    </Drawer>
  );
}
