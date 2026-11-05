import { useMemo } from 'react';
import { History } from 'lucide-react';
import { clientsApi } from '@/services/api';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';

// Activity types for this client (tile colours + the type filter)
const MODULES = {
  client: { label: 'Client', tone: 'amber' },
  projects: { label: 'Projects', tone: 'blue' },
  participants: { label: 'Participants', tone: 'cyan' },
  finance: { label: 'Invoices', tone: 'violet' },
  access: { label: 'SPOCs & access', tone: 'green' },
};

/**
 * Activity History — the same view as "My activity" on the profile (minus the heatmap): this week + a by-type count beside a
 * day-grouped timeline, filtered by type and date range. View only.
 */
export function ActivityTab({ client }) {
  // Re-read when the client changes (e.g. after saving settings, which adds an entry)
  const data = useMemo(() => clientsApi.activity(client.id), [client]);
  return (
    <ActivityTimeline
      data={data}
      icon={History} // same icon as the Activity History tab
      title="Activity history"
      count={data.entries.length}
      description="Everything that happened with this client, newest first"
      modules={MODULES}
      // Pins below the client's sticky tab bar (top bar 64px + tab bar), with a gap
      summaryStickyClassName="lg:top-[calc(var(--app-header-h)+6rem)]"
      showHeatmap={false}
      hideHeaderOnMobile // the tab already names it
    />
  );
}
