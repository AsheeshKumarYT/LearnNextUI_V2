import { useState } from 'react';
import { Copy, Eye, FileText, Pencil, Percent, Plus, ReceiptText, Trash2 } from 'lucide-react';
import { uid } from '@/utils/helpers';
import { Button, ConfirmDialog, FormField, IconButton, Input } from '@/components/ui';
import { AddressFields, DocUpload, FormCard } from './clientFormFields';
import { EMPTY_BILLING, billingErrors } from './clientForm';
import { TdsSection } from './TdsSection';
import { FilePreviewModal } from './FilePreview';

const addressText = (a) => [a.line1, a.line2].filter(Boolean).join(', ');
const placeText = (a) => [a.city, a.state, a.pin].filter(Boolean).join(', ') + (a.country && a.country !== 'India' ? `, ${a.country}` : '');

/**
 * Step 4 — billing, as cards.
 * Company: billing addresses (one per GST registration) · Individual: GST No. + certificate · Both: Lower TDS.
 */
export function BillingStep({ v, set, setValues, err, blur, geo, onFileError }) {
  const company = v.trainingFor === 'company';
  return (
    <>
      {company ? (
        <FormCard icon={ReceiptText} tone="warning" title="Billing addresses" description="Add one for each GST registration the company is billed under.">
          <BillingAddresses v={v} setValues={setValues} geo={geo} onFileError={onFileError} />
        </FormCard>
      ) : (
        <FormCard icon={ReceiptText} tone="warning" title="GST" description="Only if the participant is GST registered.">
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <FormField label="GST No." optional error={err('gstNo')}>
              <div>
                <Input placeholder="15-character GSTIN" maxLength={15} value={v.gstNo} onChange={(e) => set('gstNo', e.target.value.toUpperCase())} onBlur={() => blur('gstNo')} />
                <DocUpload value={v.gstDoc} onChange={(f) => set('gstDoc', f)} label="GST certificate" onError={onFileError} />
              </div>
            </FormField>
          </div>
        </FormCard>
      )}

      <FormCard icon={Percent} tone="violet" title="Lower TDS" description="Only if a lower TDS certificate applies.">
        <TdsSection v={v} set={set} err={err} blur={blur} onFileError={onFileError} />
      </FormCard>
    </>
  );
}

/** Company billing addresses: add/edit panel (address + GST No. + certificate, all required) and saved addresses as cards */
function BillingAddresses({ v, setValues, geo, onFileError }) {
  const list = v.billing;
  const [draft, setDraft] = useState(() => (list.length ? null : { ...EMPTY_BILLING }));
  const [showErrors, setShowErrors] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  const errors = draft ? billingErrors(draft) : {};
  const shown = showErrors ? errors : {};
  const open = (b = { ...EMPTY_BILLING }) => {
    setDraft(b);
    setShowErrors(false);
  };
  const copyComm = () => setDraft((d) => ({ ...d, ...v.comm }));

  const saveDraft = () => {
    if (Object.keys(errors).length) {
      setShowErrors(true);
      requestAnimationFrame(() => document.querySelector('#billing-panel [aria-invalid="true"]')?.focus());
      return;
    }
    setValues((x) => ({
      ...x,
      billing: draft.id ? x.billing.map((b) => (b.id === draft.id ? draft : b)) : [...x.billing, { ...draft, id: uid('bill') }],
    }));
    setDraft(null);
  };

  return (
    <section className="flex flex-col gap-4">

      {/* Saved addresses */}
      {list.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((b, i) => (
            <li key={b.id} className="flex flex-col rounded-xl border border-border-strong bg-surface/70 p-4 shadow-xs dark:bg-surface-sunken/50">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Billing address {i + 1}</p>
                <div className="-mr-1.5 -mt-1.5 flex">
                  <IconButton icon={Pencil} label="Edit billing address" size="xs" onClick={() => open(b)} />
                  <IconButton icon={Trash2} label="Delete billing address" size="xs" onClick={() => setRemoving(b)} className="hover:text-danger" />
                </div>
              </div>
              <p className="mt-1.5 text-[13px] font-medium text-text">{addressText(b)}</p>
              <p className="text-[13px] text-text-secondary">{placeText(b)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-border-strong pt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-sunken px-2 py-1 font-mono font-semibold text-text-secondary">
                  <ReceiptText className="size-3.5" aria-hidden="true" />
                  {b.gstNo}
                </span>
                {/* GST certificate — opens the full preview */}
                <button
                  type="button"
                  onClick={() => setPreviewing(b.gstDoc)}
                  title={`View ${b.gstDoc?.name}`}
                  className="group inline-flex min-w-0 items-center gap-1 rounded text-text-muted hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <FileText className="size-3.5 shrink-0 group-hover:hidden" aria-hidden="true" />
                  <Eye className="hidden size-3.5 shrink-0 group-hover:block" aria-hidden="true" />
                  <span className="truncate group-hover:underline">{b.gstDoc?.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / edit panel */}
      {draft ? (
        <div id="billing-panel" className="animate-fade-in rounded-xl border border-border-strong bg-surface/70 p-4 sm:p-5 dark:bg-surface-sunken/50">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text">{draft.id ? 'Edit billing address' : list.length ? 'Another billing address' : 'Billing address'}</h3>
            <Button variant="ghost" size="xs" leftIcon={Copy} onClick={copyComm}>
              Use communication address
            </Button>
          </div>
          <AddressFields prefix="bill" value={draft} onChange={(a) => setDraft((d) => ({ ...d, ...a }))} errors={shown} geo={geo} />
          <div className="mt-5 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <FormField label="Company GST No." required error={shown['bill.gstNo']}>
              <div>
                <Input placeholder="15-character GSTIN" maxLength={15} className="uppercase" value={draft.gstNo} onChange={(e) => setDraft((d) => ({ ...d, gstNo: e.target.value.toUpperCase() }))} />
                <DocUpload value={draft.gstDoc} onChange={(f) => setDraft((d) => ({ ...d, gstDoc: f }))} label="GST certificate" required error={shown['bill.gstDoc']} onError={onFileError} />
              </div>
            </FormField>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            {(list.length > 0 || draft.id) && (
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            )}
            <Button variant="secondary" onClick={saveDraft}>
              {draft.id ? 'Update address' : 'Save address'}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => open()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-3 text-[13px] font-semibold text-primary-text transition-colors hover:border-primary/50 hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add another billing address
        </button>
      )}

      <FilePreviewModal file={previewing} onClose={() => setPreviewing(null)} />

      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          setValues((x) => ({ ...x, billing: x.billing.filter((b) => b.id !== removing.id) }));
          setRemoving(null);
        }}
        title="Delete this billing address?"
        description={removing ? `${addressText(removing)} · ${removing.gstNo}` : ''}
        confirmLabel="Delete"
      />
    </section>
  );
}
