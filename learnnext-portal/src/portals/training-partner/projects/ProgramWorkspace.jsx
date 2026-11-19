import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { programWorkspaceApi } from '@/services/api';
import { Button, Card, TabPanel } from '@/components/ui';
import { EmptyState, ErrorState, Skeleton } from '@/components/feedback';
import { ProgramHero } from './workspace/ProgramHero';
import { OverviewTab } from './workspace/OverviewTab';
import { ChapterTab } from './workspace/ChapterTab';
import { CHAPTER_ICONS, OVERVIEW_TAB, firstOpenStep } from './workspace/workspaceMeta';

/** Loading: the hero and tab bar's shapes */
function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col gap-5 lg:flex-1" aria-busy="true">
      <Card padding="none" className="flex items-center gap-4 px-5 py-7 sm:px-7">
        <Skeleton className="size-14 rounded-2xl sm:size-16" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </Card>
      <Skeleton className="h-12 w-full rounded-card" />
      <Skeleton className="h-64 w-full rounded-card lg:flex-1" />
    </div>
  );
}

/**
 * A program's workspace (/projects/:projectId/programs/:programId?tab=…&step=…): the hero with its section tabs, then
 * the Overview or one chapter of the setup. The tab and step live in the address, so links and reloads keep them.
 */
export default function ProgramWorkspace() {
  const { projectId, programId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: ws, loading, error, reload, setData } = useAsync(() => programWorkspaceApi.get(projectId, programId), [projectId, programId]);

  if (loading && !ws) return <WorkspaceSkeleton />;
  if (error) {
    return (
      <Card>
        <ErrorState title="Couldn’t load this program" description={error.message} onRetry={reload} />
      </Card>
    );
  }
  if (!ws) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Program not found"
          description="It may have been removed, or the link is out of date."
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/projects')}>
              All projects
            </Button>
          }
        />
      </Card>
    );
  }

  const chapter = ws.chapters.find((c) => c.key === params.get('tab'));
  const tab = chapter ? chapter.key : 'overview';
  const stepKey = chapter ? (chapter.steps.some((s) => s.key === params.get('step')) ? params.get('step') : firstOpenStep(chapter)) : null;

  // Opens a tab (a chapter on a given step, or its first open one)
  const open = (key, step) => {
    if (key === 'overview') setParams({}, { replace: true });
    else {
      const c = ws.chapters.find((x) => x.key === key);
      setParams({ tab: key, step: step ?? firstOpenStep(c) }, { replace: true });
    }
  };

  const tabs = [
    OVERVIEW_TAB,
    ...ws.chapters.map((c) => ({
      value: c.key,
      label: c.label,
      icon: CHAPTER_ICONS[c.key],
      dot: c.steps.some((s) => s.state === 'due' || s.state === 'overdue') ? 'Something here is due' : undefined,
    })),
  ];

  return (
    <div className="flex flex-col lg:flex-1">
      <ProgramHero
        ws={ws}
        tabs={tabs}
        tab={tab}
        onTab={(v) => open(v)}
        onBack={() => navigate(`/projects?q=${encodeURIComponent(ws.project.code)}`)}
        onContinue={ws.next ? () => open(ws.next.chapter.key, ws.next.key) : undefined}
      />
      <TabPanel value={tab} idBase="program" key={tab} className="mt-5 min-w-0 lg:flex lg:flex-1 lg:flex-col lg:[&>*]:flex-1">
        {tab === 'overview' ? <OverviewTab ws={ws} onOpen={open} /> : <ChapterTab ws={ws} chapterKey={tab} stepKey={stepKey} onOpen={open} onChange={setData} />}
      </TabPanel>
    </div>
  );
}
