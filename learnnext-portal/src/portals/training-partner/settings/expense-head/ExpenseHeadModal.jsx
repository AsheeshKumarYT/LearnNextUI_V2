import { useEffect, useMemo, useState } from 'react';
import { ReceiptText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { expenseHeadsApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, SearchableSelect, Switch, Textarea } from '@/components/ui';

const EMPTY = { head: '', entity: '', sub: '', glCode: '', comment: '', status: 'active' };

/**
 * Add / edit an expense head in a small modal (same look as the entity modals), with the old form's fields: Expense head,
 * Entity, Sub-entity (only that entity's, so it resets when the entity changes), GL code and an optional comment;
 * Status when editing. A head + sub-entity pair is unique. Closing with unsaved changes asks first.
 * `row` = the one being edited (null = new); `entities` / `subs` = for the lists. `onSaved(row)` after a save.
 */
export function ExpenseHeadModal({ open, row, entities, subs, onClose, onSaved }) {
  const editing = Boolean(row);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (row ? { ...EMPTY, ...structuredClone(row) } : EMPTY), [row]);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [open, initial]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => {
    const e = {};
    if (!form.head) e.head = 'Choose the expense head';
    if (!form.entity) e.entity = 'Choose the entity';
    if (!form.sub) e.sub = 'Choose the sub-entity';
    else if (form.head && expenseHeadsApi.taken(form.head, form.sub, row?.id)) e.sub = 'This sub-entity already has this expense head';
    if (!form.glCode.trim()) e.glCode = 'Enter the GL code';
    return e;
  }, [form, row]);
  const err = (k) => (tried || touched[k] ? errors[k] : undefined);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());

  const save = async () => {
    setTried(true);
    if (Object.keys(errors).length) return;
    setSaving(true);
    try {
      const saved = editing ? await expenseHeadsApi.update(row.id, form) : await expenseHeadsApi.create(form, user?.name ?? 'You');
      toast.success(editing ? 'Expense head updated' : 'Expense head added', { description: `${saved.head} · GL ${saved.glCode}` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the expense head' : 'Couldn’t add the expense head', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const headOptions = useMemo(() => expenseHeadsApi.types().map((h) => ({ value: h, label: h })), []);
  const entityOptions = useMemo(() => [...entities].sort((a, b) => a.name.localeCompare(b.name)).map((e) => ({ value: e.id, label: e.name, description: e.invoicePrefix })), [entities]);
  const subOptions = useMemo(
    () =>
      subs
        .filter((s) => s.entity === form.entity)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => ({ value: s.id, label: s.name, description: s.status === 'inactive' ? 'Inactive' : undefined })),
    [subs, form.entity],
  );

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="md"
        icon={ReceiptText}
        title={editing ? 'Edit expense head' : 'Add expense head'}
        description={editing ? `${row.head} · GL ${row.glCode}` : 'The GL code an expense books to, per sub-entity.'}
        // Same soft wash as the entity modals, so the white fields stand out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Save expense head'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 pt-2 sm:grid-cols-2">
          <FormField label="Expense head" required error={err('head')} className="sm:col-span-2">
            <SearchableSelect
              options={headOptions}
              value={form.head}
              onChange={(head) => {
                set({ head });
                touch('head');
              }}
              placeholder="Select expense head"
              searchPlaceholder="Search expense heads…"
            />
          </FormField>
          <FormField label="Entity" required error={err('entity')}>
            <SearchableSelect
              options={entityOptions}
              value={form.entity}
              onChange={(entity) => {
                // A sub-entity belongs to one entity, so changing the entity clears it
                set({ entity, sub: entity === form.entity ? form.sub : '' });
                touch('entity');
              }}
              placeholder="Select entity"
              searchPlaceholder="Search entities…"
            />
          </FormField>
          <FormField label="Sub-entity" required error={err('sub')}>
            <SearchableSelect
              options={subOptions}
              value={form.sub}
              onChange={(sub) => {
                set({ sub });
                touch('sub');
              }}
              placeholder={!form.entity ? 'Pick an entity first' : subOptions.length ? 'Select sub-entity' : 'No sub-entities yet'}
              searchPlaceholder="Search sub-entities…"
              disabled={!form.entity || !subOptions.length}
            />
          </FormField>
          <FormField label="GL code" required error={err('glCode')} className="sm:col-span-2">
            <Input placeholder="e.g. 41130015" maxLength={20} value={form.glCode} onChange={(e) => set({ glCode: e.target.value.toUpperCase().replace(/\s/g, '') })} onBlur={() => touch('glCode')} />
          </FormField>
          <FormField label="Comment" optional className="sm:col-span-2">
            <Textarea rows={3} maxLength={250} showCount placeholder="Anything finance should know about this head" value={form.comment} onChange={(e) => set({ comment: e.target.value })} />
          </FormField>
          {editing && (
            <FormField label="Status">
              <div className="flex h-10 items-center sm:h-9">
                <Switch checked={form.status === 'active'} onChange={(on) => set({ status: on ? 'active' : 'inactive' })} label={form.status === 'active' ? 'Active' : 'Inactive'} />
              </div>
            </FormField>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this expense head?'}
        description={editing ? 'Your edits to this expense head won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
