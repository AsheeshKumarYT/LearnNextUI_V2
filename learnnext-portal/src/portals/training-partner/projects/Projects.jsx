import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderKanban, SearchX } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { useRetained } from '@/hooks/useRetained';
import { useToast } from '@/hooks/useToast';
import { projectsApi } from '@/services/api';
import { Button, ConfirmDialog, DataTable, ListToolbar } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { projectColumns } from './components/projectColumns';
import { ProjectDrawer } from './components/ProjectDrawer';
import { ProjectFiltersDrawer } from './components/ProjectFiltersDrawer';
import { EMPTY_FILTERS, PILLS, activeChips, applyAll, clearFilter, searchProjects } from './components/projectFilters';

/**
 * Projects: summary pills (All / Live / Need action, one-click filters) + search + Filters drawer in one toolbar, then
 * the projects table (cards on phones). A row opens the project's drawer; each program there opens its workspace.
 * /projects?q=PRJ-1234 searches for that project and opens its drawer (Copy link, Back to project, after creating one).
 */
export default function Projects() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const userName = user?.name;
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload, setData } = useAsync(() => projectsApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [pill, setPill] = useState('all');
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [archiving, setArchiving] = useState(null);
  const [busy, setBusy] = useState(false);

  // ?q=<code>: show everything, search for it, open that project's drawer, then tidy the address
  const linkQ = params.get('q');
  useEffect(() => {
    if (!linkQ || !data) return;
    setPill('all');
    setFilters(EMPTY_FILTERS);
    setSearch(linkQ);
    const match = data.find((p) => p.code.toLowerCase() === linkQ.trim().toLowerCase());
    if (match) setOpenId(match.id);
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [linkQ, data, setParams]);

  const rows = useMemo(() => applyAll(all, pill, q, filters), [all, pill, q, filters]);
  // What the drawer counts over: the list as the pill and search already narrow it
  const base = useMemo(() => searchProjects(all.filter(PILLS[pill]), q), [all, pill, q]);
  const clientName = (id) => all.find((p) => p.client.id === id)?.client.name ?? id;
  const chips = activeChips(filters, clientName);
  const filtered = chips.length > 0 || pill !== 'all' || q.trim() !== '';
  const clearAll = () => {
    setPill('all');
    setSearch('');
    setFilters(EMPTY_FILTERS);
  };

  const counts = useMemo(() => ({ all: all.length, live: all.filter(PILLS.live).length, attention: all.filter(PILLS.attention).length }), [all]);

  const open = all.find((p) => p.id === openId) ?? null;
  const shown = useRetained(open);
  const archived = useRetained(archiving); // keeps the dialog's text while it animates closed

  const comingSoon = () => toast.info('Adding a program is coming soon', { description: 'This part of Projects isn’t built yet.' });
  const openClient = (p) => navigate(`/clients/${p.client.id}`);
  const copyLink = async (p) => {
    const url = `${window.location.origin}/projects?q=${encodeURIComponent(p.code)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied', { description: `${p.name} · ${p.code}` });
    } catch {
      toast.error('Couldn’t copy the link', { description: url });
    }
  };
  const archive = async () => {
    const p = archiving;
    setBusy(true);
    try {
      await projectsApi.archive(p.id);
      setData((list) => list.filter((x) => x.id !== p.id));
      if (openId === p.id) setOpenId(null);
      toast.success('Project archived', { description: p.name });
      setArchiving(null);
    } catch (e) {
      toast.error('Couldn’t archive it', { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const columns = useMemo(
    () => projectColumns({ userName, onAddProgram: comingSoon, onOpenClient: openClient, onCopyLink: copyLink, onArchive: setArchiving }),
    [userName], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={FolderKanban} title="No projects yet" description="Projects you set up for your clients will appear here." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No projects match"
        description="Try a different search or another status."
        action={
          <Button variant="secondary" onClick={clearAll}>
            Clear search & filters
          </Button>
        }
      />
    );

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Project summary"
                loading={loading}
                value={pill}
                onChange={setPill}
                className={className}
                items={[
                  { key: 'all', label: 'All projects', value: counts.all, tone: 'blue', title: 'Show all projects', filterable: true },
                  { key: 'live', label: 'Live', value: counts.live, tone: 'violet', title: 'Running now', filterable: true },
                  { key: 'attention', label: 'Need action', value: counts.attention, tone: 'amber', title: 'A program starts within 14 days and isn’t set up yet', filterable: true, attention: true },
                ]}
              />
            )}
            summaryOnPhones
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search project, client, program or OPP…"
            searchLabel="Search projects"
            filterCount={chips.length}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add project"
            onAdd={() => navigate('/projects/new')}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'projects' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => clearFilter(f, chip.key)) }))}
            onClearAll={clearAll}
          />
        </div>
        <DataTable
          embedded
          stickyHeader
          columns={columns}
          onRowClick={(p) => setOpenId(p.id)}
          data={rows}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'modifiedAt', direction: 'desc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          mobileCards
          caption="Projects"
        />
      </div>

      <ProjectFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} projects={all} base={base} />

      <ProjectDrawer
        open={!!open}
        project={shown}
        onClose={() => setOpenId(null)}
        userName={userName}
        onAddProgram={comingSoon}
        onOpenClient={openClient}
        onOpenProgram={(p, pg) => navigate(`/projects/${p.id}/programs/${pg.id}`)}
      />

      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        onConfirm={archive}
        loading={busy}
        title="Archive this project?"
        description={archived ? `${archived.name} (${archived.code}) and its ${archived.programs.length} program${archived.programs.length === 1 ? '' : 's'} will leave the list.` : ''}
        confirmLabel="Archive"
      />
    </div>
  );
}
