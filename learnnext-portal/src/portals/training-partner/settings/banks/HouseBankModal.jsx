import { useEffect, useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { houseBanksApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, SearchableSelect, Switch } from '@/components/ui';
import { DocUpload } from '@/shared/clients/components/clientFormFields';

const EMPTY = { entity: '', bank: '', accountNo: '', ifsc: '', holder: '', branchCode: '', branchName: '', cheque: null, primary: false };
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const last4 = (n = '') => `•••• ${n.slice(-4)}`;

/** { field: message } plus which are "missing value" messages (shown only after Save; the rest show on leaving a field) */
function validate(f, accountTaken) {
  const e = {};
  const missing = new Set();
  const need = (k, m) => {
    e[k] = m;
    missing.add(k);
  };
  if (!f.entity) need('entity', 'Choose the entity');
  if (!f.bank) need('bank', 'Choose the bank');
  if (!f.accountNo) need('accountNo', 'Enter the account number');
  else if (!/^\d{9,18}$/.test(f.accountNo)) e.accountNo = 'Account number is 9–18 digits';
  else if (f.bank && accountTaken(f.bank, f.accountNo)) e.accountNo = 'This account is already added for that bank';
  if (!f.ifsc) need('ifsc', 'Enter the IFSC code');
  else if (!IFSC.test(f.ifsc)) e.ifsc = 'IFSC is 11 characters, e.g. HDFC0000572';
  if (!f.holder.trim()) need('holder', 'Enter the account holder’s name');
  if (!f.branchCode.trim()) need('branchCode', 'Enter the branch code');
  if (!f.branchName.trim()) need('branchName', 'Enter the branch name');
  if (!f.cheque) need('cheque', 'Upload a cancelled cheque or passbook page');
  return { errors: e, missing };
}

/**
 * Add / edit a house bank account (picked from the user's design): Entity, Bank · Account no., IFSC code · Account
 * holder name · Branch code, Branch name · Cancelled cheque / passbook upload · Primary account switch. Holder name
 * starts as the entity's name. One primary per entity — switching it on here makes the entity's other account
 * secondary (said under the switch). Only enabled banks are offered. Closing with unsaved changes asks first.
 */
export function HouseBankModal({ open, account, accounts, onClose, onSaved }) {
  const editing = Boolean(account);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (account ? { ...EMPTY, ...structuredClone(account) } : EMPTY), [account]);
  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial);
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [open, initial]);

  const lookups = useMemo(() => houseBanksApi.lookups(account?.bank), [account, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const entityName = (id) => lookups.entities.find((x) => x.value === id)?.label ?? '';
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const { errors, missing } = useMemo(() => validate(form, (b, n) => houseBanksApi.accountTaken(b, n, account?.id)), [form, account]);
  const err = (k) => (tried || (touched[k] && !missing.has(k)) ? errors[k] : undefined);
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  // The entity's current primary (if another account) — named under the Primary switch
  const currentPrimary = form.entity ? accounts.find((a) => a.entity === form.entity && a.primary && a.id !== account?.id) : null;

  const pickEntity = (entity) => {
    // Holder name follows the entity until someone types their own
    const holderWasDefault = !form.holder || form.holder === entityName(form.entity);
    const hasPrimary = accounts.some((a) => a.entity === entity && a.primary && a.id !== account?.id);
    set({ entity, holder: holderWasDefault ? entityName(entity) : form.holder, ...(editing ? {} : { primary: !hasPrimary }) });
  };

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const save = async () => {
    setTried(true);
    const n = Object.keys(errors).length;
    if (n) {
      toast.error('Check the highlighted fields', { description: `${n} ${n === 1 ? 'field needs' : 'fields need'} a fix.` });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, holder: form.holder.trim(), branchCode: form.branchCode.trim(), branchName: form.branchName.trim() };
      const saved = editing ? await houseBanksApi.update(account.id, payload) : await houseBanksApi.create(payload, user?.name ?? 'You');
      toast.success(editing ? 'Account updated' : 'Account added', { description: `${saved.bankName} ${last4(saved.accountNo)} · ${saved.entityName}` });
      onSaved?.();
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the account' : 'Couldn’t add the account', { description: e.message });
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="lg"
        icon={CreditCard}
        title={editing ? 'Edit house bank account' : 'Add house bank account'}
        description={editing ? `${account.bankName} ${last4(account.accountNo)}` : 'An account an entity receives payments in.'}
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            {(!editing || changed) && (
              <Button onClick={save} loading={saving}>
                {editing ? 'Save changes' : 'Save account'}
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <FormField label="Entity" required error={err('entity')}>
            <SearchableSelect options={lookups.entities} value={form.entity} onChange={pickEntity} placeholder="Select entity" searchPlaceholder="Search entities…" />
          </FormField>
          <FormField label="Bank" required error={err('bank')}>
            <SearchableSelect options={lookups.banks} value={form.bank} onChange={(bank) => set({ bank })} placeholder="Select bank" searchPlaceholder="Search banks…" />
          </FormField>
          <FormField label="Account no." required error={err('accountNo')}>
            <Input inputMode="numeric" maxLength={18} placeholder="e.g. 166801068001" value={form.accountNo} onChange={(e) => set({ accountNo: e.target.value.replace(/\D/g, '') })} onBlur={blur('accountNo')} />
          </FormField>
          <FormField label="IFSC code" required error={err('ifsc')}>
            <Input maxLength={11} placeholder="e.g. HSBC0110002" className="uppercase" value={form.ifsc} onChange={(e) => set({ ifsc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} onBlur={blur('ifsc')} />
          </FormField>
          <FormField label="Account holder name" required error={err('holder')} className="sm:col-span-2">
            <Input maxLength={120} placeholder="As printed on the cheque" value={form.holder} onChange={(e) => set({ holder: e.target.value })} onBlur={blur('holder')} />
          </FormField>
          <FormField label="Branch code" required error={err('branchCode')}>
            <Input maxLength={20} placeholder="e.g. 166" value={form.branchCode} onChange={(e) => set({ branchCode: e.target.value.toUpperCase() })} onBlur={blur('branchCode')} />
          </FormField>
          <FormField label="Branch name" required error={err('branchName')}>
            <Input maxLength={120} placeholder="e.g. Barakhamba Road, New Delhi" value={form.branchName} onChange={(e) => set({ branchName: e.target.value })} onBlur={blur('branchName')} />
          </FormField>
          <div className="sm:col-span-2">
            <DocUpload value={form.cheque} onChange={(cheque) => set({ cheque })} label="Cancelled cheque / passbook" required error={err('cheque')} onError={(m) => toast.error(m)} />
          </div>
          <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface/60 px-4 py-3 sm:col-span-2 dark:bg-surface-secondary/40">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-text">Primary account</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {form.primary && currentPrimary
                  ? `Replaces ${currentPrimary.bankName} ${last4(currentPrimary.accountNo)} as this entity’s primary account.`
                  : 'The account payments go to by default. One per entity.'}
              </p>
            </div>
            <Switch checked={form.primary} onChange={(primary) => set({ primary })} aria-label="Primary account" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this account?'}
        description={editing ? 'Your edits to this account won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
