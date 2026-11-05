import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { programsApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, Textarea } from '@/components/ui';
import { plural, smartTitle, stageIn } from './contentStages';
import { ElementUploader, revokeNew } from './ElementUploader';

const EMPTY = { name: '', description: '', files: [] };

/**
 * Add an element to one of the program's buckets: Element name, Description, then its files on three shelves —
 * Documents, Videos (uploaded or a pasted link), Links — each item named (see ElementUploader). Name, description, at
 * least one item and a name for every item are required.
 * Closing with unsaved changes asks first. `onSaved(element)` after a save.
 * Pass `element` to edit it instead: the same form, filled in — rename, rewrite, remove files or add more; "Save changes"
 * works once something has changed.
 */
export function ElementModal({ open, stages, stage, program, element, onClose, onSaved }) {
  const toast = useToast();
  const { user } = useAuth();
  const s = stageIn(stages, stage);
  const editing = Boolean(element);
  const [initial, setInitial] = useState(EMPTY);
  const [form, setForm] = useState(EMPTY);
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens (filled in when editing)
  useEffect(() => {
    if (open) {
      // Files saved before naming existed get a suggested name, so every row starts named
      const start = element ? { name: element.name, description: element.description, files: element.files.map((f) => ({ ...f, title: f.title ?? smartTitle(f) })) } : EMPTY;
      setInitial(start);
      setForm(start);
      setTried(false);
      setSaving(false);
    }
  }, [open, element]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = {
    name: !form.name.trim() ? 'Enter the element name' : undefined,
    description: !form.description.trim() ? 'Add a short description' : undefined,
    files: !form.files.length
      ? 'Add at least one document, video or link'
      : form.files.some((f) => !f.title?.trim())
        ? 'Give every file and link a name'
        : undefined,
  };
  const err = (k) => (tried ? errors[k] : undefined);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const save = async (e) => {
    e.preventDefault();
    setTried(true);
    if (Object.values(errors).some(Boolean)) return;
    setSaving(true);
    try {
      const by = user?.name ?? 'You';
      const saved = editing ? await programsApi.updateElement(program.id, stage, element.id, form, by) : await programsApi.addElement(program.id, stage, form, by);
      toast.success(editing ? 'Element updated' : 'Element added', { description: `${saved.name} · ${plural(saved.files.length, 'file')} in ${s.label}` });
      onSaved?.(saved);
      onClose();
    } catch (er) {
      toast.error(editing ? 'Couldn’t save the element' : 'Couldn’t add the element', { description: er.message });
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
        size="lg"
        icon={s.icon}
        title={editing ? 'Edit element' : 'Add element'}
        description={`${s.label} · ${program.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="element-form" loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Add element'}
            </Button>
          </>
        }
        // The entity modal's soft wash over the whole panel, so the white fields and the uploader stand out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
      >
        <form id="element-form" onSubmit={save} noValidate className="flex flex-col gap-5">
          <FormField label="Element name" required error={err('name')}>
            <Input placeholder="e.g. Welcome kit" autoComplete="off" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </FormField>
          <FormField label="Description" required error={err('description')}>
            <Textarea rows={2} placeholder="What it is and when participants use it" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </FormField>
          <ElementUploader value={form.files} onChange={(files) => set({ files })} error={err('files')} tried={tried} onError={(m) => toast.error(m)} />
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          revokeNew(form.files);
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this element?'}
        description={editing ? 'Your edits to this element won’t be saved.' : 'The name, description and files you’ve added won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
