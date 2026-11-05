import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FolderKanban, History, Landmark, LayoutDashboard, ReceiptText, SearchX, Settings2, UserCog, UsersRound } from 'lucide-react';
import { clientsApi } from '@/services/api';
import { Button, Card, TabPanel } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { ClientHero } from '@/shared/clients/detail/ClientHero';
import { OverviewTab } from '@/shared/clients/detail/OverviewTab';
import { ListPlaceholder } from './detail/ListPlaceholder';
import { SettingsTab } from './detail/SettingsTab';
import { ActivityTab } from './detail/ActivityTab';
import { ProjectsTab } from './detail/ProjectsTab';
import { ParticipantsTab } from './detail/ParticipantsTab';
import { SpocsTab } from './detail/SpocsTab';
import { TaxBillingTab } from '@/shared/clients/detail/TaxBillingTab';

const TABS = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'projects', label: 'Projects', icon: FolderKanban },
  { value: 'invoices', label: 'Invoices', icon: ReceiptText },
  { value: 'participants', label: 'Participants', icon: UsersRound },
  { value: 'spocs', label: 'SPOCs & Project Access', icon: UserCog },
  { value: 'billing', label: 'Tax & Billing', icon: Landmark },
  { value: 'settings', label: 'Settings & Configuration', icon: Settings2 },
  { value: 'activity', label: 'Activity History', icon: History },
];

// List tabs with no data yet (Invoices) — what each will hold (columns + empty message). Swap for real tables when ready.
const LISTS = {
  invoices: { icon: ReceiptText, tone: 'warning', title: 'Invoices', description: 'Invoices raised to this client.', columns: ['Invoice no.', 'Project', 'Date', 'Amount', 'Status'], emptyTitle: 'No invoices yet', emptyText: 'Invoices will appear here with their amount, due date and payment status.' },
};

/**
 * Client details (/clients/:id?tab=…) — opened by clicking a client in All Clients.
 * A hero card (identity + section tabs on its bottom edge), then the open section full width. Everything is view-only except Settings & Configuration. The tab lives in the URL so reloads and links keep it.
 */
export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [version, setVersion] = useState(0); // bump after saving settings to re-read the client
  const client = useMemo(() => clientsApi.get(id), [id, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const projects = useMemo(() => clientsApi.projects(id), [id]);
  const participants = useMemo(() => clientsApi.participants(id), [id]);
  const [spocVersion, setSpocVersion] = useState(0); // bump after adding / editing a SPOC to re-read them
  const spocs = useMemo(() => clientsApi.spocs(id), [id, spocVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'overview';
  const openTab = (value) => setParams(value === 'overview' ? {} : { tab: value }, { replace: true });

  const back = (
    <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/clients')}>
      All clients
    </Button>
  );

  if (!client) {
    return (
      <Card>
        <EmptyState icon={SearchX} title="Client not found" description="It may have been removed, or the link is out of date." action={back} />
      </Card>
    );
  }

  return (
    // No gap: the hero and its sticky tab bar sit flush; the section gets its own top margin
    // Fills the page height (see AdminLayout): the open section's card stretches to the bottom on large screens
    <div className="flex flex-col lg:flex-1">
      <ClientHero client={client} tabs={TABS} tab={tab} onTab={openTab} onBack={() => navigate('/clients')} onEdit={() => navigate(`/clients/${client.id}/edit`)} />

      <TabPanel value={tab} idBase="client" key={tab} className="mt-6 min-w-0 max-sm:mt-4 lg:flex lg:flex-1 lg:flex-col lg:[&>*]:flex-1">
        {tab === 'overview' && <OverviewTab client={client} projectCount={projects.length} participantCount={participants.length} onOpenTab={openTab} />}
        {tab === 'projects' && <ProjectsTab projects={projects} />}
        {tab === 'participants' && <ParticipantsTab participants={participants} />}
        {tab === 'spocs' && <SpocsTab clientId={client.id} spocs={spocs} projects={projects} onChanged={() => setSpocVersion((n) => n + 1)} />}
        {LISTS[tab] && <ListPlaceholder {...LISTS[tab]} />}
        {tab === 'billing' && <TaxBillingTab client={client} />}
        {tab === 'settings' && <SettingsTab key={version} client={client} onSaved={() => setVersion((n) => n + 1)} />}
        {tab === 'activity' && <ActivityTab client={client} />}
      </TabPanel>
    </div>
  );
}