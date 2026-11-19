import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, FileText, Lock, ShieldCheck, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { programWorkspaceApi } from '@/services/api';
import { Avatar, Badge, Button } from '@/components/ui';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { longDate, rangeLabel, shortDate } from '../../components/projectMeta';
import { Panel } from './Panel';

const APPROVAL = {
  approved: { tone: 'success', label: 'Approved' },
  waiting: { tone: 'warning', label: 'Waiting' },
  'sent-back': { tone: 'danger', label: 'Sent back' },
};
const kb = (size) => `${Math.max(1, Math.round(size / 1024))} KB`;

/**
 * Foundation › Agreement and approval: the client's purchase order (view / upload a new version), Finance and Audit's
 * approvals, and what approving it locks in.
 */
export function AgreementStep({ ws, slot, onChange }) {
  const toast = useToast();
  const { agreement: ag, program: pg, project, basics, journey } = ws;
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const approved = ag.approvals.every((a) => a.status === 'approved');

  const pick = () => inputRef.current?.click();
  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      toast.error('Upload a PDF', { description: file.name });
      return;
    }
    setUploading(true);
    try {
      const next = await programWorkspaceApi.uploadPo(project.id, pg.id, { name: file.name, type: 'application/pdf', size: file.size, url: URL.createObjectURL(file) });
      onChange(next);
      toast.success('Sent for approval', { description: 'Finance and Audit will review it.' });
    } catch (err) {
      toast.error('Couldn’t upload it', { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  const locks = [
    { label: 'Client', value: project.client.name },
    { label: 'Program', value: pg.program },
    { label: 'Seats', value: basics.seats },
    { label: 'Journey steps', value: journey.length },
    { label: 'Dates', value: rangeLabel(pg.start, pg.end, true) },
    { label: 'Business developer', value: basics.bdOwner },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={upload} />
      {slot &&
        ag.file &&
        !approved &&
        createPortal(
          <Button size="sm" variant="secondary" leftIcon={Upload} onClick={pick} loading={uploading}>
            Upload new version
          </Button>,
          slot,
        )}

      <Panel icon={FileText} title="Purchase order" extra={<span className="font-mono text-xs text-text-secondary">{`${ag.po} · v${ag.version}`}</span>}>
        {ag.file ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger-soft text-danger">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-text">{ag.file.name}</p>
              <p className="text-xs text-text-muted">
                {kb(ag.file.size)} · Valid {shortDate(ag.validFrom)} – {longDate(ag.validTo)}
              </p>
            </div>
            <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => setPreview(ag.file)}>
              View
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-text-secondary">No PO uploaded yet</p>
            <Button variant="secondary" size="sm" leftIcon={Upload} onClick={pick} loading={uploading}>
              Upload PDF
            </Button>
          </div>
        )}
      </Panel>

      <Panel icon={ShieldCheck} title="Approvals" bodyClassName="divide-y divide-border py-0">
        {ag.approvals.map((a) => (
          <div key={a.role} className="py-3">
            <div className="flex items-center gap-3">
              <Avatar name={a.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-text">{a.name}</p>
                <p className="text-xs text-text-muted">
                  {a.role}
                  {a.at ? ` · ${shortDate(a.at)}` : ''}
                </p>
              </div>
              <Badge tone={APPROVAL[a.status].tone}>{APPROVAL[a.status].label}</Badge>
            </div>
            {a.status === 'sent-back' && ag.comment && <p className="ml-11 mt-2 border-l-2 border-danger-main/40 pl-3 text-xs leading-5 text-text-secondary">{ag.comment}</p>}
          </div>
        ))}
      </Panel>

      <Panel icon={Lock} title="What it locks">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {locks.map((l) => (
            <div key={l.label} className="min-w-0">
              <dt className="text-xs font-medium text-text-secondary">{l.label}</dt>
              <dd className="mt-0.5 truncate text-[13px] font-medium text-text" title={String(l.value)}>
                {l.value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
