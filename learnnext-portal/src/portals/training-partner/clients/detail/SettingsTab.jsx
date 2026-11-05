import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { BellRing, Boxes, CircleCheck, RotateCcw, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { clientsApi } from '@/services/api';
import { Button, Card, Switch } from '@/components/ui';
import { TabHeader } from '@/shared/clients/detail/TabHeader';

// The products a client can be given access to
const PRODUCTS = [
  { key: 'prism', label: 'Prism' },
  { key: 'praxn', label: 'Praxn' },
];

/** Settings & Configuration — the only editable tab. Edits a draft; Save stores it (and logs it in Activity History). */
export function SettingsTab({ client, onSaved }) {
  const toast = useToast();
  const { user } = useAuth();
  const initial = { status: client.status, ...client.settings };
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const assessments = useMemo(() => clientsApi.prismAssessments(), []);
  const chosen = draft.prismAssessments ?? [];
  // Turning a product on; Prism starts with every assessment on the first time (turn off the ones they shouldn't get)
  const setProduct = (key, on) =>
    set({
      products: { ...draft.products, [key]: on },
      ...(key === 'prism' && on && !chosen.length && { prismAssessments: assessments.map((a) => a.id) }),
    });
  const toggleAssessment = (id, on) => set({ prismAssessments: on ? [...chosen, id] : chosen.filter((x) => x !== id) });

  const save = async () => {
    setSaving(true);
    try {
      await clientsApi.updateSettings(client.id, draft, user?.name ?? 'You');
      toast.success('Settings saved', { description: client.name });
      onSaved();
    } catch (e) {
      toast.error('Couldn’t save the settings', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card tint="success" subtleTint padding="none">
          <TabHeader icon={CircleCheck} tone="success" title="Client status" description="Inactive clients stay on file but don’t appear in new schedules" />
          <Body>
            <Row>
              <Switch
                checked={draft.status === 'active'}
                onChange={(on) => set({ status: on ? 'active' : 'inactive' })}
                label={draft.status === 'active' ? 'Active client' : 'Inactive client'}
                description={draft.status === 'active' ? 'Turn off to mark this client inactive.' : 'Turn on to make this client active again.'}
              />
            </Row>
          </Body>
        </Card>

        <Card tint="violet" subtleTint padding="none">
          <TabHeader icon={Boxes} tone="violet" title="Product access" description="Which products this client can use" />
          <Body className="flex flex-col gap-3">
            {PRODUCTS.map((p) => {
              const on = Boolean(draft.products?.[p.key]);
              const prism = p.key === 'prism';
              return (
                <Row key={p.key}>
                  <Switch
                    checked={on}
                    onChange={(v) => setProduct(p.key, v)}
                    label={p.label}
                    description={
                      !on
                        ? `Turn on to give this client access to ${p.label}.`
                        : prism
                          ? `${chosen.length} of ${assessments.length} assessments on.`
                          : `${client.name} has access to ${p.label}.`
                    }
                  />
                  {/* Prism: which of its assessments this client gets — one switch each */}
                  {prism && on && (
                    <div className="mt-3.5 animate-fade-in border-t border-dashed border-border-strong pt-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Assessments</p>
                        <span className="flex gap-3 text-xs font-medium">
                          <button type="button" onClick={() => set({ prismAssessments: assessments.map((a) => a.id) })} disabled={chosen.length === assessments.length} className="text-primary-text hover:underline disabled:pointer-events-none disabled:text-text-muted">
                            All
                          </button>
                          <button type="button" onClick={() => set({ prismAssessments: [] })} disabled={!chosen.length} className="text-primary-text hover:underline disabled:pointer-events-none disabled:text-text-muted">
                            None
                          </button>
                        </span>
                      </div>
                      <ul className="divide-y divide-border">
                        {assessments.map((a) => (
                          <li key={a.id} className="py-2">
                            <Switch size="sm" checked={chosen.includes(a.id)} onChange={(v) => toggleAssessment(a.id, v)} label={a.name} description={a.hint} />
                          </li>
                        ))}
                      </ul>
                      {!chosen.length && <p className="mt-1 text-xs text-warning">No assessments on — the client won’t see anything in Prism.</p>}
                    </div>
                  )}
                </Row>
              );
            })}
          </Body>
        </Card>
        <Card tint="primary" subtleTint padding="none" className="lg:col-span-2">
          <TabHeader icon={BellRing} tone="primary" title="Access & communication" description="Who can sign in and who hears from us" />
          <Body className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Row>
              <Switch checked={draft.portalAccess} onChange={(on) => set({ portalAccess: on })} label="Client portal access" description="SPOCs can sign in to see projects and reports." />
            </Row>
            <Row>
              <Switch checked={draft.spocEmails} onChange={(on) => set({ spocEmails: on })} label="Email updates to SPOCs" description="Schedules, changes and completion reports." />
            </Row>
            <Row>
              <Switch checked={draft.reminders} onChange={(on) => set({ reminders: on })} label="Session reminders" description="Remind participants a day before each session." />
            </Row>
          </Body>
        </Card>
      </div>
      {/* Save bar */}
      <Card padding="none" className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
        <p className="text-[13px] text-text-secondary">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
        <div className="flex gap-2">
          <Button variant="ghost" leftIcon={RotateCcw} onClick={() => setDraft(initial)} disabled={!dirty || saving}>
            Reset
          </Button>
          <Button leftIcon={Save} onClick={save} loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}

/** A card's content under its TabHeader */
function Body({ className, children }) {
  return <div className={cn('px-5 pb-5 sm:px-6 sm:pb-6', className)}>{children}</div>;
}

/** A setting inside a soft bordered box (same look as the switches on the client form) */
function Row({ children }) {
  return <div className="rounded-xl border border-border-strong bg-surface/60 px-4 py-3.5 dark:bg-surface-sunken/50">{children}</div>;
}
