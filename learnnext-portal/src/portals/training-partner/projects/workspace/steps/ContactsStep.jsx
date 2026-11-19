import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Pencil, User, UserPlus, Users } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useRetained } from '@/hooks/useRetained';
import { clientsApi, programWorkspaceApi } from '@/services/api';
import { Avatar, Badge, Button, Checkbox, DataTable, FormField, IconButton, Input, Modal, SearchableSelect } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { MobileNumber } from '@/shared/clients/components/clientColumns';
import { email as emailRule } from '@/utils/validation';

const EMPTY = { name: '', email: '', mobile: '', department: '', designation: '', main: false };
const fmtMobile = (m) => (m ? `+91 ${m.slice(0, 5)} ${m.slice(5)}` : null);

function errorsOf(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter their name';
  if (!v.email.trim()) e.email = 'Enter their email';
  else if (emailRule()(v.email.trim())) e.email = emailRule()(v.email.trim());
  if (!v.mobile) e.mobile = 'Enter their mobile number';
  else if (v.mobile.length !== 10) e.mobile = 'A mobile number has 10 digits';
  return e;
}

/** Add / edit a client contact. Errors show after the first try to save. */
function ContactModal({ open, contact, onClose, onSave }) {
  const editing = Boolean(contact?.id);
  const lookups = useMemo(() => clientsApi.spocLookups(), []);
  // The page remounts this (new key) each time it opens, so the form starts fresh
  const [v, setV] = useState(() => (contact ? { ...EMPTY, ...contact, department: contact.department ?? '', designation: contact.designation ?? '' } : EMPTY));
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);

  const errors = errorsOf(v);
  const err = (k) => (tried ? errors[k] : undefined);
  const set = (k, x) => setV((s) => ({ ...s, [k]: x }));

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => document.querySelector('#contact-form [aria-invalid="true"]')?.focus());
      return;
    }
    setSaving(true);
    try {
      await onSave(v);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      closeOnBackdrop={false}
      icon={UserPlus}
      title={editing ? 'Edit contact' : 'Add contact'}
      description={editing ? contact.name : 'Someone at the client you’ll work with on this program.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="contact-form" loading={saving}>
            {editing ? 'Save changes' : 'Add contact'}
          </Button>
        </>
      }
    >
      <form id="contact-form" noValidate onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" required error={err('name')} className="sm:col-span-2">
          <Input leftIcon={User} placeholder="Full name" value={v.name} maxLength={60} onChange={(e) => set('name', e.target.value.replace(/[^A-Za-z .'-]/g, ''))} />
        </FormField>
        <FormField label="Email" required error={err('email')}>
          <Input leftIcon={Mail} type="email" placeholder="name@company.com" value={v.email} onChange={(e) => set('email', e.target.value)} />
        </FormField>
        <FormField label="Mobile number" required error={err('mobile')}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-text-muted">+91</span>
            <Input type="tel" inputMode="numeric" placeholder="98765 43210" inputClassName="pl-11" value={v.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>
        </FormField>
        <FormField label="Department" optional>
          <SearchableSelect options={lookups.departments} value={v.department} onChange={(x) => set('department', x)} placeholder="Select department" searchPlaceholder="Search departments…" clearable />
        </FormField>
        <FormField label="Designation" optional>
          <SearchableSelect options={lookups.designations} value={v.designation} onChange={(x) => set('designation', x)} placeholder="Select designation" searchPlaceholder="Search designations…" clearable />
        </FormField>
        <div className="sm:col-span-2">
          <Checkbox label="Main contact" checked={v.main} disabled={editing && contact.main} onChange={(e) => set('main', e.target.checked)} />
        </div>
      </form>
    </Modal>
  );
}

/** Foundation › Client contacts: the people at the client for this program, with Add / Edit */
export function ContactsStep({ ws, slot, onChange }) {
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, contact = edit
  const [formKey, setFormKey] = useState(0);
  const shown = useRetained(editing);
  const open = (c) => {
    setFormKey((k) => k + 1);
    setEditing(c);
  };
  const add = () => open({});

  const save = async (v) => {
    const isEdit = Boolean(editing?.id);
    try {
      const next = await programWorkspaceApi.saveContact(ws.project.id, ws.program.id, { ...v, id: editing?.id });
      onChange(next);
      toast.success(isEdit ? 'Contact updated' : 'Contact added', { description: v.name.trim() });
      setEditing(null);
    } catch (e) {
      toast.error('Couldn’t save the contact', { description: e.message });
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Contact',
      primary: true,
      cell: (c) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={c.name} size="md" />
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-text">{c.name}</span>
              {c.main && <Badge tone="primary">Main contact</Badge>}
            </span>
            <span className="block truncate text-xs text-text-muted">{c.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'mobile', header: 'Mobile', hideBelow: 'lg', cell: (c) => (c.mobile ? <MobileNumber mobile={fmtMobile(c.mobile)} /> : '—') },
    { key: 'role', header: 'Role', hideBelow: 'md', cell: (c) => <span className="text-[13px] text-text-secondary">{[c.designation, c.department].filter(Boolean).join(' · ') || '—'}</span> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      width: 56,
      cell: (c) => <IconButton icon={Pencil} label={`Edit ${c.name}`} size="sm" variant="ghost" onClick={() => open(c)} />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {slot &&
        createPortal(
          <Button size="sm" leftIcon={UserPlus} onClick={add}>
            Add contact
          </Button>,
          slot,
        )}
      {ws.contacts.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={Users}
            title="No contacts yet"
            description="Add who you’ll work with at the client."
            action={
              <Button leftIcon={UserPlus} onClick={add}>
                Add contact
              </Button>
            }
          />
        </div>
      ) : (
        <DataTable embedded columns={columns} data={ws.contacts} pagination={false} mobileCards caption="Client contacts" rowHover={false} />
      )}
      <ContactModal key={formKey} open={editing !== null} contact={shown?.id ? shown : null} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}
