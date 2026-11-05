import { useEffect, useMemo, useState } from 'react';
import { Blocks } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { modulesApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, Switch } from '@/components/ui';

const EMPTY = { name: '', enabled: true };

/**
 * Add / edit a module in a small modal (same look as the other master modals): the old form's Module name (unique in
 * any case) and Enable status as a switch (on for new modules). Closing with unsaved changes asks first.
 * `row` = the one being edited (null = new). `onSaved(row)` after a save.
 */
export function ModuleModal({ open, row, onClose, onSaved }) {
  const editing = Boolean(row);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (row ? { name: row.name, enabled: row.enabled } : EMPTY), [row]);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setTouched(false);
      setTried(false);
      setSaving(false);
    }
  }, [open, initial]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const changed = form.name.trim() !== initial.name.trim() || form.enabled !== initial.enabled;
  const error = !form.name.trim() ? 'Enter the module name' : modulesApi.nameTaken(form.name, row?.id) ? 'A module with this name already exists' : undefined;
  // "Required" only after Save; a duplicate name shows as soon as the field is left
  const shownError = tried || (touched && form.name.trim()) ? error : undefined;

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());

  const save = async () => {
    setTried(true);
    if (error) return;
    setSaving(true);
    try {
      const saved = editing ? await modulesApi.update(row.id, form) : await modulesApi.create(form, user?.name ?? 'You');
      toast.success(editing ? 'Module updated' : 'Module added', { description: `${saved.name} · ${saved.enabled ? 'Enabled' : 'Disabled'}` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the module' : 'Couldn’t add the module', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="sm"
        icon={Blocks}
        title={editing ? 'Edit module' : 'Add module'}
        description={editing ? row.name : 'A phase like Pre, During or Post.'}
        // Same soft wash as the other master modals, so the white field stands out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Save module'}
            </Button>
          </>
        }
      >
        <form
          className="flex flex-col gap-5 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <FormField label="Module name" required error={shownError}>
            <Input autoFocus placeholder="e.g. Pre" maxLength={40} value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={() => setTouched(true)} />
          </FormField>
          <FormField label="Enable status" helper={form.enabled ? 'Shown wherever modules are picked.' : 'Hidden from module pickers until enabled.'}>
            <div className="flex h-9 items-center">
              <Switch checked={form.enabled} onChange={(enabled) => set({ enabled })} label={form.enabled ? 'Enabled' : 'Disabled'} />
            </div>
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this module?'}
        description={editing ? 'Your edits to this module won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
