import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, History, Landmark, LayoutDashboard, Network, SearchX, Settings2, UsersRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { Avatar, Button, Card, IconTile, ListToolbar, StatusBadge, TabPanel } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientHero } from '@/shared/clients/detail/ClientHero';
import { Fact, Section } from '@/shared/clients/detail/OverviewTab';
import { TaxBillingTab } from '@/shared/clients/detail/TaxBillingTab';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { partnersApi } from '@/services/api';
import { PartnerActivityTab, PartnerSettingsTab } from './PartnerTabs';

// A mobile number for display: sub clients already store it formatted ("+91 98199 47703"); plain digits get the +91
const phone = (m) => (!m ? '' : m.startsWith('+') ? m : `+91 ${m.replace(/(\d{5})(\d{5})/, '$1 $2')}`);

const TABS = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'sub-clients', label: 'Sub clients', icon: Network },
  { value: 'billing', label: 'Tax & Billing', icon: Landmark },
  { value: 'settings', label: 'Settings & Configuration', icon: Settings2 },
  { value: 'activity', label: 'Activity History', icon: History },
];

/**
 * Super Admin → a client (training partner) — /clients/:id?tab=…. The same hero + section tabs as the Training Partner
 * portal's client page, with Super Admin's own sections: Overview, Sub clients (this partner's own clients),
 * Tax & Billing, Settings & Configuration (status, CRM fetching, access) and Activity History. View only (Edit opens the form).
 */
export default function SuperClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [version, setVersion] = useState(0); // bump after saving settings to re-read the client
  const client = useMemo(() => partnersApi.get(id), [id, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const subs = useAsync(() => partnersApi.subClients(id), [id]);

  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'overview';
  const openTab = (value) => setParams(value === 'overview' ? {} : { tab: value }, { replace: true });
  const back = () => navigate('/clients');

  if (!client) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Client not found"
          description="It may have been removed, or the link is out of date."
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={back}>
              Manage clients
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col lg:flex-1">
      <ClientHero client={client} tabs={TABS} tab={tab} onTab={openTab} onBack={back} backLabel="Manage clients" onEdit={() => navigate(`/clients/${client.id}/edit`)} />

      <TabPanel value={tab} idBase="client" key={tab} className="mt-6 min-w-0 max-sm:mt-4 lg:flex lg:flex-1 lg:flex-col lg:[&>*]:flex-1">
        {tab === 'overview' && <PartnerOverview client={client} subs={subs.data ?? []} loading={subs.loading} onOpenTab={openTab} />}
        {tab === 'sub-clients' && <SubClientsTab subs={subs.data ?? []} loading={subs.loading} error={subs.error} onRetry={subs.reload} />}
        {tab === 'billing' && <TaxBillingTab client={client} />}
        {tab === 'settings' && <PartnerSettingsTab key={version} client={client} onSaved={() => setVersion((n) => n + 1)} />}
        {tab === 'activity' && <PartnerActivityTab client={client} />}
      </TabPanel>
    </div>
  );
}

/** Overview — a small stats strip (opens Sub clients) and one information card: profile · contact person · address */
function PartnerOverview({ client, subs, loading, onOpenTab }) {
  const f = client.form;
  const active = subs.filter((s) => s.status === 'active').length;
  const stats = [
    { label: 'Sub clients', value: subs.length, icon: Network, tone: 'primary' },
    { label: 'Active sub clients', value: active, icon: UsersRound, tone: 'success' },
  ];
  const mobile = f.mobile ? `+91 ${f.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}` : '';
  const landline = f.phone ? `${f.stdCode ? `(${f.stdCode}) ` : ''}${f.phone}` : '';
  const a = f.comm ?? {};
  const address = [[a.line1, a.line2].filter(Boolean).join(', '), [a.city, a.state, a.pin].filter(Boolean).join(', '), a.country].filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <Card padding="none" className="grid grid-cols-2 overflow-hidden">
        {stats.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onOpenTab('sub-clients')}
            className={cn(
              'flex min-w-0 items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus max-sm:px-4 max-sm:py-3.5',
              i === 0 && 'border-r border-border-strong',
            )}
          >
            <IconTile icon={s.icon} tone={s.tone} className="max-sm:hidden" />
            <span className="min-w-0">
              <span className="block text-xl font-bold leading-7 tracking-tight tabular-nums text-text">{loading ? '–' : s.value}</span>
              <span className="block text-xs text-text-secondary sm:truncate">{s.label}</span>
            </span>
          </button>
        ))}
      </Card>

      <Card tint="primary" subtleTint padding="none" className="divide-y divide-dashed divide-border-strong">
        <Section title="Company profile">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Company type" value={f.companyType} />
            <Fact label="Industry" value={f.industry} />
            <Fact label="Client code" value={client.code} mono copy />
            <Fact label="Website" value={f.website} href={f.website && (/^https?:\/\//i.test(f.website) ? f.website : `https://${f.website}`)} external />
            <Fact label="Client since" value={formatDate(client.createdAt)} title={formatRelative(client.createdAt)} />
            <div className="min-w-0">
              <dt className="text-xs font-medium text-text-secondary">Added by</dt>
              <dd className="mt-1 flex min-w-0 items-center gap-2 text-sm font-medium text-text">
                <Avatar name={client.createdBy} size="xs" />
                <span className="truncate">{client.createdBy}</span>
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Contact person">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Name" value={f.contactName} />
            <Fact label="Email" value={f.contactEmail} href={f.contactEmail && `mailto:${f.contactEmail}`} />
            <Fact label="Mobile" value={mobile} href={f.mobile && `tel:+91${f.mobile}`} />
            <Fact label="Landline" value={landline} href={f.phone && `tel:${f.stdCode ?? ''}${f.phone}`} />
          </dl>
        </Section>

        <Section title="Address">
          <dl>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-text-secondary">Communication</dt>
              <dd className="mt-1 text-sm leading-6 text-text">
                {address.length ? address.map((l) => <span key={l} className="block">{l}</span>) : <span className="text-text-muted">Not added yet</span>}
              </dd>
            </div>
          </dl>
        </Section>
      </Card>
    </div>
  );
}

/** Sub clients — this training partner's own clients: summary pills (filter by status), search, then a table (cards on phones). View only. */
function SubClientsTab({ subs, loading, error, onRetry }) {
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [status, setStatus] = useState('all');
  const rows = useMemo(
    () => subs.filter((c) => (status === 'all' || c.status === status) && (!q || [c.name, c.code, c.city, c.industry, c.mobile].some((v) => v?.toLowerCase().includes(q)))),
    [subs, status, q],
  );
  const counts = { all: subs.length, active: subs.filter((c) => c.status === 'active').length, inactive: subs.filter((c) => c.status === 'inactive').length };
  const clearAll = () => {
    setStatus('all');
    setSearch('');
  };

  const columns = [
    {
      key: 'name',
      header: 'Company',
      primary: true,
      sortable: true,
      hideable: false,
      cell: (c) => (
        <div className="flex min-w-0 items-center gap-3">
          <ClientLogo client={c} />
          <div className="min-w-0">
            <p className="max-w-[18rem] truncate text-sm font-semibold text-text" title={c.name}>
              {c.name}
            </p>
            <p className="truncate text-xs text-text-muted">
              {c.industry} · {c.city}
            </p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: 'Code', sortable: true, cell: (c) => <CodeChip code={c.code} /> },
    { key: 'mobile', header: 'Mobile', hideBelow: 'lg', cell: (c) => <span className="text-[13px] tabular-nums">{phone(c.mobile) || '—'}</span> },
    {
      key: 'createdAt',
      header: 'Added on',
      sortable: true,
      hideBelow: 'xl',
      accessor: (c) => new Date(c.createdAt),
      cell: (c) => (
        <span className="text-[13px] tabular-nums" title={formatRelative(c.createdAt)}>
          {formatDate(c.createdAt)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, cell: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-col">
      <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
        <ListToolbar
          summaryOnPhones
          renderSummary={(className) => (
            <StatPills
              ariaLabel="Sub client summary"
              className={className}
              loading={loading}
              value={status}
              onChange={setStatus}
              items={[
                { key: 'all', label: 'All sub clients', value: counts.all, title: 'Show all sub clients', tone: 'blue', filterable: true },
                { key: 'active', label: 'Active', value: counts.active, title: 'Show active sub clients', tone: 'green', filterable: true },
                { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show inactive sub clients', tone: 'slate', filterable: true },
              ]}
            />
          )}
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search name, code, city…"
          searchLabel="Search sub clients"
          filtered={!loading && !error && (status !== 'all' || q !== '')}
          result={{ shown: rows.length, total: subs.length, noun: 'sub clients' }}
          onClearAll={clearAll}
        />
      </div>
      <ResponsiveList
        embedded
        columns={columns}
        data={rows}
        renderCard={(c) => (
          <GridCard
            media={<ClientLogo client={c} size="lg" />}
            title={c.name}
            subtitle={`${c.industry} · ${c.city}`}
            badges={
              <>
                <CodeChip code={c.code} />
                <StatusBadge status={c.status} />
              </>
            }
            footer={<CardFooterRow date={c.createdAt}>{phone(c.mobile) || 'No mobile'}</CardFooterRow>}
          />
        )}
        loading={loading}
        error={error}
        onRetry={onRetry}
        defaultSort={{ key: 'name', direction: 'asc' }}
        pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
        emptyState={
          subs.length === 0 ? (
            <EmptyState compact icon={Network} title="No sub clients yet" description="This training partner’s own clients will show here." />
          ) : (
            <EmptyState
              compact
              icon={SearchX}
              title="No sub clients match"
              description="Try a different search or status."
              action={
                <Button variant="secondary" onClick={clearAll}>
                  Clear search & filters
                </Button>
              }
            />
          )
        }
        caption="Sub clients"
      />
    </div>
  );
}
