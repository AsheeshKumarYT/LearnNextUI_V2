import { useEffect, useMemo, useState } from 'react';
import { FolderTree } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { programCategoriesApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal } from '@/components/ui';

const EMPTY = { name: '' };

/**
 * Add / edit a program category in a small modal (same look as the other master modals): just the category name,
 * unique in any case. Renaming moves the category's programs with it (the note says so). Closing with unsaved changes
 * asks first. `row` = the one being edited (null = new). `onSaved(row)` after a save.
 */
export function ProgramCategoryModal({ open, row, onClose, onSaved }) {
  const editing = Boolean(row);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (row ? { name: row.name } : EMPTY), [row]);

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

  const changed = form.name.trim() !== initial.name.trim();
  const error = !form.name.trim()
    ? 'Enter the category name'
    : programCategoriesApi.nameTaken(form.name, row?.id)
      ? 'A category with this name already exists'
      : undefined;
  // "Required" only after Save; a duplicate name shows as soon as the field is left
  const shownError = tried || (touched && form.name.trim()) ? error : undefined;

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());

  const save = async () => {
    setTried(true);
    if (error) return;
    setSaving(true);
    try {
      const saved = editing ? await programCategoriesApi.update(row.id, form) : await programCategoriesApi.create(form, user?.name ?? 'You');
      toast.success(editing ? 'Category updated' : 'Category added', { description: saved.name });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the category' : 'Couldn’t add the category', { description: e.message });
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
        icon={FolderTree}
        title={editing ? 'Edit category' : 'Add program category'}
        description={editing ? row.name : 'A group programs can be filed under.'}
        // Same soft wash as the other master modals, so the white field stands out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Save category'}
            </Button>
          </>
        }
      >
        <form
          className="pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <FormField
            label="Category name"
            required
            error={shownError}
            helper={editing && row.programs > 0 ? `Its ${row.programs} ${row.programs === 1 ? 'program moves' : 'programs move'} with it when renamed.` : undefined}
          >
            <Input
              autoFocus
              placeholder="e.g. Leadership"
              maxLength={60}
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              onBlur={() => setTouched(true)}
            />
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
        title={editing ? 'Discard your changes?' : 'Discard this category?'}
        description={editing ? 'Your edits to this category won’t be saved.' : 'The name you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
