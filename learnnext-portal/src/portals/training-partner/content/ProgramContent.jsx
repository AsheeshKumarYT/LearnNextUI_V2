import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, SearchX, ShieldCheck, UploadCloud } from 'lucide-react';
import { programsApi } from '@/services/api';
import { setLeaveGuard } from '@/utils/leaveGuard';
import { Button, Card, ConfirmDialog, TabPanel } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { ProgramHero } from './components/ProgramHero';
import { ProgramModal } from './components/ProgramModal';
import { UploadContentTab } from './components/UploadContentTab';
import { ContentPermissionsTab } from './components/ContentPermissionsTab';

const TABS = [
  { value: 'upload', label: 'Upload Content', icon: UploadCloud },
  { value: 'permissions', label: 'Content Permissions', icon: ShieldCheck },
];

/**
 * A program's content page (/content/:id?tab=…) — opened by Add content on Manage Content. Laid out like client
 * details: a hero (logo, name, category · sub-entity · fee, All programs + Edit) with the section tabs on its bottom
 * edge, then the open section full width. Tabs: Upload Content (the Pre / During / Post buckets and their elements) and
 * Content Permissions (what trainers and participants can do with each element). The tab lives in the URL so reloads
 * and links keep it.
 *
 * Unsaved permission changes live here, not in the tab, so switching tabs keeps them (the tab shows a dot meanwhile).
 * Leaving the page with some — All programs, the breadcrumbs, the sidebar — asks first; reloading / closing the
 * browser tab gets the browser's own prompt.
 */
export default function ProgramContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [version, setVersion] = useState(0); // bump after editing to re-read the program
  const program = useMemo(() => programsApi.get(id), [id, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const [editing, setEditing] = useState(false);

  // Permission drafts: { [elementId]: { trainer?, participant? } } — only what differs from saved
  const [draft, setDraft] = useState({});
  const unsaved = Object.values(draft).reduce((n, d) => n + Object.keys(d).length, 0);
  const [leaveTo, setLeaveTo] = useState(null);
  useEffect(() => setDraft({}), [id]);

  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'upload';
  const openTab = (value) => setParams(value === 'upload' ? {} : { tab: value }, { replace: true });
  const leave = (to) => (unsaved ? setLeaveTo(to) : navigate(to));

  // Links outside the page (breadcrumbs, sidebar) ask first too, and so does reloading / closing the browser tab
  useEffect(() => setLeaveGuard((to) => (unsaved ? (setLeaveTo(to), true) : false)), [unsaved]);
  useEffect(() => {
    if (!unsaved) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved]);

  if (!program) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Program not found"
          description="It may have been removed, or the link is out of date."
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/content')}>
              All programs
            </Button>
          }
        />
      </Card>
    );
  }

  const tabs = TABS.map((t) => (t.value === 'permissions' && unsaved && tab !== 'permissions' ? { ...t, dot: 'Unsaved changes' } : t));

  return (
    // No gap: the hero and its sticky tab bar sit flush; the section gets its own top margin and fills the page height
    <div className="flex flex-col lg:flex-1">
      <ProgramHero program={program} tabs={tabs} tab={tab} onTab={openTab} onBack={() => leave('/content')} onEdit={() => setEditing(true)} />

      <TabPanel value={tab} idBase="program" key={tab} className="mt-6 min-w-0 max-sm:mt-4 lg:flex lg:flex-1 lg:flex-col lg:[&>*]:flex-1">
        {tab === 'upload' ? (
          // A deleted element's unsaved permission change goes with it, so the counts and the leave prompt stay right
          <UploadContentTab program={program} onElementRemoved={(elId) => setDraft(({ [elId]: _gone, ...rest }) => rest)} />
        ) : (
          <ContentPermissionsTab program={program} draft={draft} setDraft={setDraft} onOpenUpload={() => openTab('upload')} />
        )}
      </TabPanel>

      <ProgramModal open={editing} program={program} onClose={() => setEditing(false)} onSaved={() => setVersion((n) => n + 1)} />
      <ConfirmDialog
        open={leaveTo != null}
        onClose={() => setLeaveTo(null)}
        onConfirm={() => {
          const to = leaveTo;
          setDraft({});
          setLeaveTo(null);
          navigate(to);
        }}
        title="Discard permission changes?"
        description={`You have ${unsaved} unsaved permission change${unsaved === 1 ? '' : 's'}. If you leave now, they won’t be saved.`}
        confirmLabel="Discard and leave"
        cancelLabel="Stay"
        tone="danger"
      />
    </div>
  );
}
