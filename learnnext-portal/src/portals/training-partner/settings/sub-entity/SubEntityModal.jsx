import { useEffect, useMemo, useState } from 'react';
import { Network } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { subEntitiesApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, SearchableSelect, Switch } from '@/components/ui';
import { LogoPicker } from '@/shared/clients/components/clientFormFields';

const EMPTY = { entity: '', name: '', logo: '', status: 'active' };

/**
 * Add / edit a sub-entity in a small modal (same look as the entity modal): the entity it sits under, its name (unique
 * within that entity) and an optional logo; Status when editing. Closing with unsaved changes asks first.
 * `sub` = the one being edited (null = new); `entities` = all entities, for the list. `onSaved(sub)` after a save.
 */
export function SubEntityModal({ open, sub, entities, onClose, onSaved }) {
  const editing = Boolean(sub);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (sub ? { ...EMPTY, ...structuredClone(sub) } : EMPTY), [sub]);

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
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => {
    const e = {};
    if (!form.entity) e.entity = 'Choose the entity it sits under';
    if (!form.name.trim()) e.name = 'Enter the sub-entity name';
    else if (subEntitiesApi.nameTaken(form.entity, form.name, sub?.id)) e.name = 'This entity already has a sub-entity with this name';
    return e;
  }, [form, sub]);
  const err = (k) => (tried || touched[k] ? errors[k] : undefined);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());

  const save = async () => {
    setTried(true);
    if (Object.keys(errors).length) return;
    setSaving(true);
    try {
      const saved = editing ? await subEntitiesApi.update(sub.id, form) : await subEntitiesApi.create(form, user?.name ?? 'You');
      toast.success(editing ? 'Sub-entity updated' : 'Sub-entity added', { description: saved.name });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the sub-entity' : 'Couldn’t add the sub-entity', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const entityOptions = useMemo(
    () =>
      [...entities].sort((a, b) => a.name.localeCompare(b.name)).map((e) => ({ value: e.id, label: e.name, description: e.status === 'inactive' ? `${e.invoicePrefix} · Inactive` : e.invoicePrefix })),
    [entities],
  );

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="md"
        icon={Network}
        title={editing ? 'Edit sub-entity' : 'Add sub-entity'}
        description={editing ? sub.name : 'A unit under one of your entities.'}
        // Same soft wash as the entity modal, so the white fields stand out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Save sub-entity'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5 pt-2">
          <FormField label="Entity" required error={err('entity')}>
            <SearchableSelect
              options={entityOptions}
              value={form.entity}
              onChange={(entity) => {
                set({ entity });
                setTouched((t) => ({ ...t, entity: true }));
              }}
              placeholder="Select entity"
              searchPlaceholder="Search entities…"
            />
          </FormField>
          <FormField label="Sub-entity name" required error={err('name')}>
            <Input placeholder="e.g. BYLD Learning" value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, name: true }))} />
          </FormField>
          <FormField label="Logo" optional>
            <LogoPicker value={form.logo} onChange={(logo) => set({ logo })} onError={(m) => toast.error(m)} hint="PNG, JPG or SVG · up to 2 MB" />
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
        title={editing ? 'Discard your changes?' : 'Discard this sub-entity?'}
        description={editing ? 'Your edits to this sub-entity won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
