import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Link2, PanelsTopLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { menusApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, IconButton, Input, Modal, SearchableSelect } from '@/components/ui';
import { menuIcon } from './menuIcons';
import { IconPicker } from './IconPicker';

const EMPTY = { module: 'Training Partner', name: '', parent: '', pageName: '', url: '', icon: '', priority: 1 };

/**
 * Add / edit a menu with the old form's fields: Module (only Admin for now, so it's preset), Menu name, Parent menu
 * (none = top level), Page name, Page URL, Icon and Priority. Built for ease:
 *  - Page name follows the menu name until you change it (they're usually the same).
 *  - Icons are a picker grid, not a text box — and required, since a menu item looks off without one.
 *  - Priority is set in a live preview of the menu: you see the item among its siblings (under its parent) exactly as it
 *    will appear, and move it up / down — no number to guess.
 * A menu with sub-menus stays top-level (no nesting deeper than one level). Closing with unsaved changes asks first.
 * `row` = the one being edited (null = new); `menus` = all menus (parents for the select, children for the rule).
 */
export function MenuModal({ open, row, menus, onClose, onSaved }) {
  const editing = Boolean(row);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(
    () =>
      row
        ? { module: row.module ?? 'Training Partner', name: row.name, parent: row.parent ?? '', pageName: row.pageName, url: row.url, icon: row.icon ?? '', priority: row.priority }
        : { ...EMPTY, priority: menusApi.siblings(null).length + 1 },
    [row],
  );

  const [form, setForm] = useState(initial);
  const [pageNameEdited, setPageNameEdited] = useState(false);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setPageNameEdited(Boolean(row) && row.pageName !== row.name);
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [open, initial, row]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);

  const hasChildren = editing && menus.some((m) => m.parent === row.id);
  // Siblings where it'll live (without itself), for the preview and the priority range
  const siblings = useMemo(() => (open ? menusApi.siblings(form.parent || null, row?.id) : []), [open, form.parent, row]);
  const maxPriority = siblings.length + 1;
  const priority = Math.min(form.priority, maxPriority);
  const parentMenu = menus.find((m) => m.id === form.parent);

  // Keep the item being placed in view inside the (scrolling) preview — on open and as it moves up / down
  const thisRef = useRef(null);
  useEffect(() => {
    const el = thisRef.current;
    const box = el?.closest('.overflow-y-auto');
    if (!el || !box) return;
    const top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop + 8) box.scrollTop = top - 8;
    else if (top + el.offsetHeight > box.scrollTop + box.clientHeight - 8) box.scrollTop = top + el.offsetHeight - box.clientHeight + 8;
  }, [open, priority, form.parent]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.module) e.module = 'Choose the module';
    if (!form.name.trim()) e.name = 'Enter the menu name';
    else if (menusApi.nameTaken(form.name, form.parent || null, row?.id)) e.name = form.parent ? 'This parent already has a menu with this name' : 'There is already a top-level menu with this name';
    if (!form.pageName.trim()) e.pageName = 'Enter the page name';
    if (!form.url.trim()) e.url = 'Enter the page URL';
    else if (/\s/.test(form.url.trim())) e.url = 'A URL can’t contain spaces';
    else if (menusApi.urlTaken(form.url, row?.id)) e.url = 'Another menu already opens this URL';
    if (!form.icon) e.icon = 'Choose an icon';
    return e;
  }, [form, row]);
  // "Required" shows only after Save is pressed — leaving an empty field (the name is focused on open) isn't a mistake.
  // Problems with what was typed (duplicate, spaces in the URL…) show as soon as the field is left.
  const err = (k) => (tried || (touched[k] && String(form[k] ?? '').trim()) ? errors[k] : undefined);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());

  const save = async () => {
    setTried(true);
    if (Object.keys(errors).length) return;
    setSaving(true);
    try {
      const data = { ...form, priority };
      const saved = editing ? await menusApi.update(row.id, data) : await menusApi.create(data, user?.name ?? 'You');
      toast.success(editing ? 'Menu updated' : 'Menu added', { description: `${saved.name} · ${saved.url}` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the menu' : 'Couldn’t add the menu', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const moduleOptions = useMemo(() => menusApi.modules().map((m) => ({ value: m, label: m })), []);
  // Parents: top-level menus only (one level of nesting), never itself
  const parentOptions = useMemo(
    () =>
      menus
        .filter((m) => !m.parent && m.id !== row?.id)
        .sort((a, b) => a.priority - b.priority)
        .map((m) => ({ value: m.id, label: m.name, icon: menuIcon(m.icon), description: m.url })),
    [menus, row],
  );

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="xl"
        icon={PanelsTopLeft}
        title={editing ? 'Edit menu' : 'Add menu'}
        description={editing ? `${row.name} · ${row.url}` : 'A page in the Training Partner menu, and where it sits.'}
        // Same soft wash as the other master modals, so the white fields stand out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={editing && !changed}>
              {editing ? 'Save changes' : 'Save menu'}
            </Button>
          </>
        }
      >
        <div className="grid gap-6 pt-2 lg:grid-cols-[minmax(0,1fr)_17rem]">
          {/* Fields */}
          <form
            className="grid grid-cols-1 content-start gap-x-4 gap-y-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <FormField label="Module" required error={err('module')}>
              <SearchableSelect
                options={moduleOptions}
                value={form.module}
                onChange={(module) => {
                  set({ module });
                  touch('module');
                }}
                placeholder="Select module"
                searchPlaceholder="Search modules…"
              />
            </FormField>
            <FormField label="Menu name" required error={err('name')}>
              <Input
                autoFocus
                placeholder="e.g. Facilitators"
                maxLength={40}
                value={form.name}
                onChange={(e) => set({ name: e.target.value, ...(pageNameEdited ? {} : { pageName: e.target.value }) })}
                onBlur={() => touch('name')}
              />
            </FormField>
            {/* Only says something when it can't be changed */}
            <FormField label="Parent menu" optional helper={hasChildren ? 'Has sub-menus, so it stays top-level.' : undefined}>
              <SearchableSelect
                options={parentOptions}
                value={form.parent}
                // A new parent = a new list of siblings: go to the end of it
                onChange={(parent) => set({ parent, priority: menusApi.siblings(parent || null, row?.id).length + 1 })}
                placeholder="None — top-level menu"
                searchPlaceholder="Search menus…"
                clearable
                disabled={hasChildren}
              />
            </FormField>
            {/* Fills itself from the menu name (no hint needed — you see it happen) */}
            <FormField label="Page name" required error={err('pageName')}>
              <Input
                placeholder="e.g. Facilitators"
                maxLength={60}
                value={form.pageName}
                onChange={(e) => {
                  setPageNameEdited(true);
                  set({ pageName: e.target.value });
                }}
                onBlur={() => touch('pageName')}
              />
            </FormField>
            <FormField label="Page URL" required error={err('url')}>
              <Input
                leftIcon={Link2}
                placeholder="/facilitators"
                maxLength={120}
                className="font-mono text-[13px]"
                value={form.url}
                onChange={(e) => set({ url: e.target.value })}
                onBlur={() => touch('url')}
              />
            </FormField>

            {/* Required (a menu item looks off without one): a select-like field that opens a searchable icon grid */}
            <FormField label="Icon" required error={err('icon')}>
              <IconPicker
                value={form.icon}
                invalid={Boolean(err('icon'))}
                onChange={(icon) => {
                  set({ icon });
                  touch('icon');
                }}
              />
            </FormField>
          </form>

          {/* Live preview — where it sits in the menu; priority = its place, moved up / down here */}
          <div className="flex flex-col">
            <p className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-text">
              Priority
              <span className="text-xs font-normal tabular-nums text-text-muted">
                {priority} of {maxPriority}
              </span>
            </p>
            {/* As tall as the fields (no empty space beside them); a long menu scrolls, keeping this item in view.
                Ways to move it: its ↑ ↓ buttons, the ↑ ↓ arrow keys (the box is focusable), or click a menu to take its place */}
            <div
              tabIndex={0}
              aria-label={`Priority — position ${priority} of ${maxPriority}. Use the up and down arrow keys to move it.`}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' && priority > 1) {
                  e.preventDefault();
                  set({ priority: priority - 1 });
                } else if (e.key === 'ArrowDown' && priority < maxPriority) {
                  e.preventDefault();
                  set({ priority: priority + 1 });
                }
              }}
              className="max-h-[13.5rem] overflow-y-auto rounded-xl border border-border bg-surface p-2 shadow-xs transition-shadow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus dark:bg-surface-secondary"
            >
              {parentMenu && <PreviewRow icon={parentMenu.icon} name={parentMenu.name} parent />}
              <ul className={cn('flex flex-col gap-0.5', parentMenu && 'ml-3 border-l border-border pl-2')}>
                {[...siblings.slice(0, priority - 1), null, ...siblings.slice(priority - 1)].map((m, i) =>
                  m ? (
                    <li key={m.id}>
                      {/* Click a menu to put this one in its place (it shifts by one) */}
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => set({ priority: i + 1 })}
                        title={`Move here (position ${i + 1})`}
                        className="block w-full rounded-lg text-left transition-colors hover:bg-surface-sunken"
                      >
                        <PreviewRow icon={m.icon} name={m.name} />
                      </button>
                    </li>
                  ) : (
                    <li key="this" ref={thisRef} className="flex scroll-my-2 items-center gap-1 rounded-lg bg-primary-soft py-1 pl-2 pr-1 text-primary-text ring-1 ring-primary/30">
                      {(() => {
                        const Icon = menuIcon(form.icon);
                        return <Icon className="size-3.5 shrink-0" aria-hidden="true" />;
                      })()}
                      <span className="min-w-0 flex-1 truncate pl-1 text-[13px] font-semibold">{form.name.trim() || 'New menu'}</span>
                      <IconButton icon={ArrowUp} label="Move up" size="sm" disabled={priority <= 1} onClick={() => set({ priority: priority - 1 })} className="size-6 text-primary-text" />
                      <IconButton
                        icon={ArrowDown}
                        label="Move down"
                        size="sm"
                        disabled={priority >= maxPriority}
                        onClick={() => set({ priority: priority + 1 })}
                        className="size-6 text-primary-text"
                      />
                    </li>
                  ),
                )}
              </ul>
            </div>
            <p className="mt-2 text-xs text-text-muted">Click a spot, or use the ↑ ↓ keys / buttons.</p>
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
        title={editing ? 'Discard your changes?' : 'Discard this menu?'}
        description={editing ? 'Your edits to this menu won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/** A quiet menu row in the preview (the parent shows an open chevron) */
function PreviewRow({ icon, name, parent }) {
  const Icon = menuIcon(icon);
  return (
    <div className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]', parent ? 'font-semibold text-text' : 'text-text-secondary')}>
      <Icon className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {parent && <ChevronDown className="size-3.5 text-text-muted" aria-hidden="true" />}
    </div>
  );
}
