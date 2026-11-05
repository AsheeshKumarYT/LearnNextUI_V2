import { DatePicker, FormField, Input, Switch } from '@/components/ui';
import { DocUpload, PrefixInput } from './clientFormFields';

/** "Do you have Lower TDS details?" — rate, amount, section, validity and certificate appear when switched on */
export function TdsSection({ v, set, err, blur, onFileError }) {
  return (
    <div className="rounded-xl border border-border-strong bg-surface/60 dark:bg-surface-sunken/50">
      <div className="px-4 py-3.5">
        <Switch checked={v.lowerTds} onChange={(on) => set('lowerTds', on)} label="Do you have Lower TDS details?" description="Turn on if the client has a lower TDS certificate." />
      </div>
      {v.lowerTds && (
        <div className="grid animate-fade-in grid-cols-1 gap-x-5 gap-y-5 border-t border-border px-4 py-5 sm:grid-cols-3">
          <FormField label="Lower TDS rate" required error={err('tdsRate')}>
            <Input
              inputMode="decimal"
              placeholder="e.g. 2"
              rightSlot={<span className="mr-2 text-[13px] font-semibold text-text-muted">%</span>}
              value={v.tdsRate}
              onChange={(e) => set('tdsRate', e.target.value.replace(/[^\d.]/g, ''))}
              onBlur={() => blur('tdsRate')}
            />
          </FormField>
          <FormField label="Amount" required error={err('tdsAmount')}>
            <PrefixInput
              prefix="₹"
              inputMode="decimal"
              placeholder="e.g. 500000"
              value={v.tdsAmount}
              onChange={(e) => set('tdsAmount', e.target.value.replace(/[^\d.]/g, ''))}
              onBlur={() => blur('tdsAmount')}
              inputClassName="pl-11"
            />
          </FormField>
          <FormField label="Section" required error={err('tdsSection')}>
            <Input placeholder="e.g. 194J" maxLength={10} value={v.tdsSection} onChange={(e) => set('tdsSection', e.target.value.toUpperCase())} onBlur={() => blur('tdsSection')} />
          </FormField>
          <FormField label="Valid from" required error={err('tdsFrom')}>
            <DatePicker value={v.tdsFrom} onChange={(d) => set('tdsFrom', d)} placeholder="Choose a date" />
          </FormField>
          <FormField label="Valid to" required error={err('tdsTo')}>
            <DatePicker value={v.tdsTo} onChange={(d) => set('tdsTo', d)} placeholder="Choose a date" minDate={v.tdsFrom ?? undefined} />
          </FormField>
          <FormField label="Lower TDS certificate" required className="sm:col-span-3">
            <DocUpload value={v.tdsCert} onChange={(f) => set('tdsCert', f)} label="lower TDS certificate" required error={err('tdsCert')} onError={onFileError} />
          </FormField>
        </div>
      )}
    </div>
  );
}
