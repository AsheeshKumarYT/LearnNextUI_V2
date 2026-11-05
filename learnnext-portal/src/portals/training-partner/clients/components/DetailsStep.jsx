import { BriefcaseBusiness, Building2, CircleCheck, ImagePlus, Phone, UserRound } from 'lucide-react';
import { FormField, Input, RadioGroup, SearchableSelect, Select, Switch } from '@/components/ui';
import { CompanyCombobox, DocUpload, FormCard, LogoPicker, PrefixInput } from '@/shared/clients/components/clientFormFields';

const toOptions = (list) => list.map((x) => ({ value: x, label: x }));
const GRID = 'grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2';

/** Read-only code that fills in automatically */
function CodeField({ label, value }) {
  return (
    <FormField label={label} helper="Generated automatically">
      <Input value={value} readOnly inputClassName="cursor-default bg-surface-sunken font-mono font-semibold tracking-wide text-text-secondary" />
    </FormField>
  );
}

/**
 * Step 2 — details in three cards: who (company / participant), contact (or identity & role), and logo.
 * `v` values · `set(key, value)` · `err(key)` message · `blur(key)` marks touched.
 * `onCrmPick` (new clients) auto-fills from the CRM portal · `status` / `onStatusChange` (editing) adds an Active switch.
 */
export function DetailsStep({ v, set, err, blur, lookups, onLogoError, onCrmPick, status, onStatusChange }) {
  const company = v.trainingFor === 'company';
  const isExisting = company && lookups.existingClients.some((n) => n.toLowerCase() === v.companyName.trim().toLowerCase());
  const text = (key) => ({ value: v[key], onChange: (e) => set(key, e.target.value), onBlur: () => blur(key) });
  const mobile = (
    <FormField label="Mobile number" required error={err('mobile')}>
      <PrefixInput prefix="+91" type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210" value={v.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('mobile')} />
    </FormField>
  );

  return (
    <>
      {company ? (
        <>
          <FormCard icon={Building2} tone="primary" title="Company details" description="How the company appears across LearnNext.">
            <div className={GRID}>
              <FormField
                label="Company name"
                required
                helper={onCrmPick ? 'Pick from the CRM portal to auto-fill all steps' : undefined}
                error={err('companyName') || (isExisting ? 'This company is already in All Clients' : undefined)}
              >
                <CompanyCombobox
                  value={v.companyName}
                  onChange={(x) => set('companyName', x)}
                  // A CRM company that isn't a client yet → fetch its full profile and fill every step
                  onPick={(name, isNew) => !isNew && !lookups.existingClients.some((n) => n.toLowerCase() === name.toLowerCase()) && onCrmPick?.(name)}
                  onBlur={() => blur('companyName')}
                  options={lookups.companyDirectory}
                  taken={lookups.existingClients}
                  listLabel={onCrmPick ? 'CRM portal · picks auto-fill every step' : undefined}
                />
              </FormField>
              <CodeField label="Company code" value={v.code} />
              <FormField label="Company type" required error={err('companyType')}>
                <Select options={lookups.companyTypes} placeholder="Select" {...text('companyType')} />
              </FormField>
              <FormField label="Industry" required error={err('industry')}>
                <SearchableSelect options={toOptions(lookups.industries)} value={v.industry} onChange={(x) => set('industry', x)} placeholder="Select" searchPlaceholder="Search…" />
              </FormField>
              <FormField label="Website" optional error={err('website')}>
                <Input placeholder="company.com" inputMode="url" {...text('website')} />
              </FormField>
              <FormField label="Special Economic Zone" required error={err('sez')}>
                {/* A Yes/No answer → radio buttons (segmented toggles are for switching views) */}
                <RadioGroup
                  name="sez"
                  label="Special Economic Zone"
                  orientation="horizontal"
                  value={v.sez}
                  onChange={(x) => set('sez', x)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  className="h-10 items-center"
                />
              </FormField>
              {/* In an SEZ: its SEZ number and the supporting document are both needed */}
              {v.sez === 'yes' && (
                <>
                  <FormField label="SEZ number" required error={err('sezNo')} helper="As printed on the SEZ approval letter" className="animate-fade-in">
                    <Input placeholder="e.g. SEZ/MUM/2019/0423" autoComplete="off" value={v.sezNo} onChange={(e) => set('sezNo', e.target.value.toUpperCase())} onBlur={() => blur('sezNo')} />
                  </FormField>
                  <FormField label="SEZ document" required error={err('sezDoc')} className="animate-fade-in">
                    <DocUpload value={v.sezDoc} onChange={(f) => set('sezDoc', f)} label="SEZ approval letter" onError={onLogoError} />
                  </FormField>
                </>
              )}
            </div>
          </FormCard>

          <FormCard icon={Phone} tone="success" title="Contact" description="Numbers we can reach the company on.">
            <div className={GRID}>
              {mobile}
              <FormField label="Phone number" optional error={err('stdCode') ? 'Enter the STD code too' : err('phone')}>
                <div className="flex gap-2">
                  <Input inputMode="numeric" maxLength={5} placeholder="STD" aria-label="STD code" className="w-20 shrink-0" invalid={!!err('stdCode')} value={v.stdCode} onChange={(e) => set('stdCode', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('stdCode')} />
                  <Input inputMode="numeric" maxLength={8} placeholder="Number" aria-label="Phone number" value={v.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('phone')} />
                </div>
              </FormField>
            </div>
          </FormCard>
        </>
      ) : (
        <>
          <FormCard icon={UserRound} tone="primary" title="Participant details" description="The person who will attend the training.">
            <div className={GRID}>
              <FormField label="Participant name" required error={err('participantName')}>
                <Input placeholder="Full name" autoFocus autoComplete="name" {...text('participantName')} />
              </FormField>
              <CodeField label="Participant ID" value={v.code} />
              <FormField label="Email" required error={err('email')}>
                <Input type="email" placeholder="name@example.com" autoComplete="email" {...text('email')} />
              </FormField>
              {mobile}
            </div>
          </FormCard>

          <FormCard icon={BriefcaseBusiness} tone="info" title="Identity & role" description="Optional — helps with records and certificates.">
            <div className={GRID}>
              <FormField label="Govt. ID" optional>
                <div>
                  <Input placeholder="Aadhaar, PAN or passport" {...text('govtId')} />
                  <DocUpload value={v.govtIdDoc} onChange={(f) => set('govtIdDoc', f)} label="ID proof" onError={onLogoError} />
                </div>
              </FormField>
              <div className="flex flex-col gap-5">
                <FormField label="Department" optional>
                  <SearchableSelect options={toOptions(lookups.participantDepartments)} value={v.department} onChange={(x) => set('department', x)} placeholder="Select" searchPlaceholder="Search…" clearable />
                </FormField>
                <FormField label="Designation" optional>
                  <SearchableSelect options={toOptions(lookups.designations)} value={v.designation} onChange={(x) => set('designation', x)} placeholder="Select" searchPlaceholder="Search…" clearable />
                </FormField>
              </div>
            </div>
          </FormCard>
        </>
      )}

      {status && (
        <FormCard icon={CircleCheck} tone="success" title="Status" description="Inactive clients stay on file but don’t appear in new schedules.">
          <div className="rounded-xl border border-border-strong bg-surface/60 px-4 py-3.5 dark:bg-surface-sunken/50">
            <Switch
              checked={status === 'active'}
              onChange={(on) => onStatusChange(on ? 'active' : 'inactive')}
              label={status === 'active' ? 'Active client' : 'Inactive client'}
              description={status === 'active' ? 'Turn off to mark this client inactive.' : 'Turn on to make this client active again.'}
            />
          </div>
        </FormCard>
      )}

      <FormCard icon={ImagePlus} tone="violet" title={company ? 'Company logo' : 'Photo or logo'} description="Shown next to the client across LearnNext.">
        <LogoPicker value={v.logo} onChange={(x) => set('logo', x)} onError={onLogoError} label={company ? 'Upload logo' : 'Upload image'} />
      </FormCard>
    </>
  );
}
