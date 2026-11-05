import { Building, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui';
import { AddressFields, FormCard } from './clientFormFields';

/** Step 3 — communication address card, then an office address card unless it's the same */
export function AddressStep({ v, setValues, errors, blur, geo }) {
  return (
    <>
      <FormCard icon={Mail} tone="info" title="Communication address" description="Where we send letters and certificates.">
        <AddressFields prefix="comm" value={v.comm} onChange={(comm) => setValues((x) => ({ ...x, comm }))} errors={errors} onBlur={blur} geo={geo} />
        {/* flex: the checkbox's inline label would otherwise sit on a text line and leave extra space below it */}
        <div className="mt-5 flex items-center rounded-xl border border-border-strong bg-surface/60 px-4 py-3 dark:bg-surface-sunken/50">
          <Checkbox label="Office address is the same as the communication address" checked={v.officeSame} onChange={(e) => setValues((x) => ({ ...x, officeSame: e.target.checked }))} />
        </div>
      </FormCard>

      {/* No wrapper around the card: the last card must be a direct child so it can join the action bar (AddClient) */}
      {!v.officeSame && (
        <FormCard icon={Building} tone="warning" title="Office address" description="Where the client’s team works." className="animate-fade-in">
          <AddressFields prefix="office" value={v.office} onChange={(office) => setValues((x) => ({ ...x, office }))} errors={errors} onBlur={blur} geo={geo} />
        </FormCard>
      )}
    </>
  );
}
