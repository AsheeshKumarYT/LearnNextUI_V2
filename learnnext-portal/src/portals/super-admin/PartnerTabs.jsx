import { useState } from 'react';
import { BellRing, CircleCheck, DatabaseZap, History, RotateCcw, Save } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { Button, Card, Switch } from '@/components/ui';
import { Skeleton } from '@/components/feedback';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { TabHeader } from '@/shared/clients/detail/TabHeader';
import { partnersApi } from '@/services/api';

/**
 * Super Admin client → Settings & Configuration. Same layout as the Training Partner portal's (cards of switches in
 * soft boxes, a save bar below): status, CRM fetching, and portal access & communication. Edits a draft; Save stores it
 * and logs it in Activity History.
 */
export function PartnerSettingsTab({ client, onSaved }) {
  const toast = useToast();
  const { user } = useAuth();
  const initial = { status: client.status, ...client.settings };
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const save = async () => {
    setSaving(true);
    try {
      await partnersApi.updateSettings(client.id, draft, user?.name ?? 'You');
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
          <TabHeader icon={CircleCheck} tone="success" title="Client status" description="Inactive clients stay on file but can’t sign in" />
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
          <TabHeader icon={DatabaseZap} tone="violet" title="CRM fetching" description="How this training partner adds its own clients" />
          <Body>
            <Row>
              <Switch
                checked={draft.crmFetch}
                onChange={(on) => set({ crmFetch: on })}
                label={draft.crmFetch ? 'CRM fetching on' : 'CRM fetching off'}
                description={
                  draft.crmFetch
                    ? 'Adding a client looks the company up in their CRM portal and fills in every step.'
                    : 'Every client is filled in by hand — no CRM look-up.'
                }
              />
            </Row>
          </Body>
        </Card>

        <Card tint="primary" subtleTint padding="none" className="lg:col-span-2">
          <TabHeader icon={BellRing} tone="primary" title="Access & communication" description="Who can sign in and who hears from us" />
          <Body className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Row>
              <Switch checked={draft.portalAccess} onChange={(on) => set({ portalAccess: on })} label="Training Partner portal access" description="Their team can sign in and manage their clients." />
            </Row>
            <Row>
              <Switch checked={draft.contactEmails} onChange={(on) => set({ contactEmails: on })} label="Email updates to the contact person" description="Account notices and monthly summaries." />
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

// Activity types for a Super Admin client (tile colours + the type filter)
const MODULES = {
  client: { label: 'Client', tone: 'amber' },
  subclients: { label: 'Sub clients', tone: 'blue' },
  settings: { label: 'Settings & CRM', tone: 'violet' },
};

/** Super Admin client → Activity History: the same timeline as the Training Partner portal's, with this client's own events */
export function PartnerActivityTab({ client }) {
  // Re-read when the client changes (e.g. after saving settings, which adds an entry)
  const { data, loading } = useAsync(() => partnersApi.activity(client.id), [client]);
  if (loading || !data) return <Skeleton className="h-96 w-full rounded-card" />;
  return (
    <ActivityTimeline
      data={data}
      icon={History}
      title="Activity history"
      count={data.entries.length}
      description="Everything that happened with this client, newest first"
      modules={MODULES}
      summaryStickyClassName="lg:top-[calc(var(--app-header-h)+6rem)]"
      showHeatmap={false}
      hideHeaderOnMobile
    />
  );
}

function Body({ className, children }) {
  return <div className={cn('px-5 pb-5 sm:px-6 sm:pb-6', className)}>{children}</div>;
}

function Row({ children }) {
  return <div className="rounded-xl border border-border-strong bg-surface/60 px-4 py-3.5 dark:bg-surface-sunken/50">{children}</div>;
}
