import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Building2, Check, ChevronDown, CornerUpLeft, Eye, Mail, MapPin, Phone, SearchX, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { setLeaveGuard } from '@/utils/leaveGuard';
import { facilitatorsApi } from '@/services/api';
import { Avatar, Button, Card, ConfirmDialog, IconTile, Modal, Textarea } from '@/components/ui';
import { EmptyState, Skeleton } from '@/components/feedback';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { TYPE_LABEL, daysSince, dayWord, stageOf } from './components/facilitatorMeta';
import { Chip, SECTIONS, renderSection } from './components/kycSections';


/**
 * Verify a facilitator's submitted KYC (/facilitators/:id/verify — "Verify" on an Approval pending row). The old
 * Verify Facilitator Profile screen, made calmer and quicker to work through:
 *   • a header: photo, name, code, type, contact, when they submitted, their profile note — and how many sections are checked
 *   • on lg+, a sticky list of the sections with each one's verdict (jump to any); the sections themselves on the right
 *   • each section is a card with its details and a clear Valid / Not valid choice. Valid folds it to one line and moves
 *     on to the next unchecked section; Not valid asks what needs fixing (sent to the facilitator)
 *   • a bar at the bottom: progress, then "Approve KYC" once everything is valid, or "Send back for changes" once all
 *     are checked and something isn't — both confirm first and return to the list
 * Leaving with verdicts half done asks first.
 */
export default function VerifyFacilitator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { data: f, loading } = useAsync(() => facilitatorsApi.kyc(id), [id]);
  const lookups = useMemo(() => facilitatorsApi.lookups(), []);

  const sections = useMemo(() => (f ? SECTIONS.filter((s) => !s.when || s.when(f.kyc)) : []), [f]);
  const [decisions, setDecisions] = useState({}); // { [key]: { valid: bool, note: '' } }
  const [open, setOpen] = useState({}); // valid sections opened again
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaveTo, setLeaveTo] = useState(null);
  const [preview, setPreview] = useState(null); // the document open in the viewer
  const [viewPhoto, setViewPhoto] = useState(false); // the photo shown large

  const checked = sections.filter((s) => decisions[s.key]).length;
  const invalid = sections.filter((s) => decisions[s.key]?.valid === false);
  const allChecked = sections.length > 0 && checked === sections.length;
  const notesMissing = invalid.some((s) => !decisions[s.key].note?.trim());
  const outcome = !allChecked ? null : invalid.length ? 'send-back' : 'approve';

  // Half-done verdicts: links elsewhere and closing the tab ask first
  const dirty = checked > 0 && !saving;
  useEffect(() => setLeaveGuard((to) => (dirty ? (setLeaveTo(to), true) : false)), [dirty]);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const scrollTo = (key) => document.getElementById(`kyc-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const decide = (key, valid) => {
    setDecisions((d) => ({ ...d, [key]: { valid, note: valid ? '' : (d[key]?.note ?? '') } }));
    setOpen((o) => ({ ...o, [key]: false }));
    // Valid: on to the next section that still needs a look
    if (valid) {
      const next = sections.find((s) => s.key !== key && !decisions[s.key]);
      if (next) setTimeout(() => scrollTo(next.key), 120);
    }
  };

  const finish = async () => {
    setSaving(true);
    try {
      const res = await facilitatorsApi.verifyKyc(id, decisions, user?.name ?? 'You');
      if (res.approved) toast.success('KYC approved', { description: `${f.name} moves on to payment setup.`, afterLoad: true });
      else toast.success('Sent back for changes', { description: `${f.name} will get the KYC link again with your notes.`, afterLoad: true });
      setLeaveGuard(() => false);
      navigate('/facilitators');
    } catch (e) {
      toast.error('Couldn’t finish the verification', { description: e.message });
      setSaving(false);
    }
  };

  if (loading && !f) return <VerifySkeleton />;
  if (!f || stageOf(f) !== 'review') {
    return (
      <Card className="lg:flex-1">
        <EmptyState
          icon={SearchX}
          title={f ? 'Nothing to verify here' : 'Facilitator not found'}
          description={f ? `${f.name} doesn’t have a submitted KYC waiting for verification.` : 'They may have been removed, or the link is out of date.'}
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/facilitators')}>
              All facilitators
            </Button>
          }
        />
      </Card>
    );
  }

  const k = f.kyc;
  const submitted = daysSince(f.kycSubmittedAt);
  const entityName = Object.fromEntries(lookups.entities.map((e) => [e.id, e.name]));

  return (
    <div className="flex flex-col gap-5 lg:flex-1">
      {/* Who they are, and how far the check has got — picked from previews: "Profile hero". A soft wash in the Approval
          pending violet; a bigger photo (plain, no badge); the facts as quiet icon chips; a progress ring on the right.
          (Restored by request — "it was better" — after many other headers were tried and rejected.) */}
      <section
        aria-label="Facilitator"
        className="relative isolate overflow-hidden rounded-card border border-glass-border bg-surface/70 p-5 shadow-card dark:bg-surface-secondary/60 sm:p-6"
      >
        <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-chart-4/[0.10] via-chart-1/[0.04] to-transparent" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-chart-4/[0.07] blur-2xl" aria-hidden="true" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Just the photo — no frame, no tag. Click to see it large (as on My profile): it eases in a little and an eye
              appears on hover */}
          {f.photo ? (
            <button
              type="button"
              onClick={() => setViewPhoto(true)}
              aria-label={`View ${f.name}’s photo`}
              aria-haspopup="dialog"
              className="group relative flex shrink-0 self-start overflow-hidden rounded-full outline outline-1 outline-offset-[3px] outline-chart-4/25 ring-[3px] ring-white focus-visible:outline-none focus-visible:ring-focus sm:self-center dark:ring-surface-secondary"
            >
              <Avatar name={f.name} src={f.photo} size="xl" className="[&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-110" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                <Eye className="size-5" />
              </span>
            </button>
          ) : (
            <Avatar name={f.name} size="xl" className="shrink-0 self-start sm:self-center" />
          )}

          <div className="min-w-0 flex-1">
            {/* The name on its own; the code joins the quiet line under it (no tag). LinkedIn isn't repeated up here — it's
                in the Social profiles section below */}
            <p className="text-xl font-semibold tracking-tight text-text">{f.name}</p>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              {TYPE_LABEL[f.type]} · <span className="tabular-nums">{k.code}</span> · submitted {submitted === 0 ? 'today' : `${dayWord(submitted)} ago`}
              <span className="text-text-muted"> ({formatDate(f.kycSubmittedAt)})</span>
            </p>
            {/* Contact details: a soft coloured round icon + plain text each (no pill boxes), with room between them */}
            {/* Phones: one per row (short ones used to pair up on a line, which looked uneven) */}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 max-sm:flex-col">
              <Chip icon={Mail} tone="primary">{f.email}</Chip>
              <Chip icon={Phone} tone="success">+91 {f.mobile.replace(/(\d{5})(\d+)/, '$1 $2')}</Chip>
              <Chip icon={MapPin} tone="info">
                {f.address.city}, {f.address.state}
              </Chip>
              <Chip icon={Building2} tone="violet" title={f.entities.map((e) => entityName[e] ?? '—').join(', ')}>
                {entityName[f.entities[0]] ?? '—'}
                {f.entities.length > 1 && <span className="text-text-muted"> +{f.entities.length - 1}</span>}
              </Chip>
            </div>
          </div>

          <ProgressRing done={checked} total={sections.length} bad={invalid.length} />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* The sections at a glance (lg+): jump to any; each shows its verdict */}
        <nav aria-label="KYC sections" className="hidden lg:block">
          <Card tint="primary" subtleTint padding="none" className="sticky top-[calc(var(--app-header-h)+2rem)] transition-[top] duration-300 ease-out">
            <p className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">KYC sections</p>
            <ol className="space-y-0.5 px-2 pb-2">
              {sections.map((s) => {
                const d = decisions[s.key];
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => scrollTo(s.key)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <Verdict d={d} />
                      <span className="min-w-0 flex-1 truncate">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>
        </nav>

        <div className="flex min-w-0 flex-col gap-4 pb-24">
          {sections.map((s) => {
            const d = decisions[s.key];
            const folded = d?.valid && !open[s.key];
            const tone = d ? (d.valid ? 'success' : 'danger') : s.tone;
            return (
              <Card
                as="section"
                key={s.key}
                id={`kyc-${s.key}`}
                aria-label={s.title}
                tint={tone}
                subtleTint
                faintTint={tone === 'warning' || tone === 'success'} // amber and green read strongest — kept fainter
                padding="none"
                className={cn('scroll-mt-24 overflow-hidden transition-colors', d && (d.valid ? 'border-success-main/35' : 'border-danger-main/40'))}
              >
                <header className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6">
                  <IconTile icon={d ? (d.valid ? Check : X) : s.icon} tone={tone} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-semibold leading-6 text-text">{s.title}</h2>
                    {/* Just the title — the details speak for themselves (hints removed: "so much texting") */}
                    {folded && (
                      <button type="button" onClick={() => setOpen((o) => ({ ...o, [s.key]: true }))} className="inline-flex items-center gap-1 text-xs text-success hover:underline">
                        Marked valid · show details
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <ValidToggle value={d?.valid} onChange={(valid) => decide(s.key, valid)} label={s.title} />
                </header>

                {!folded && <div className="px-5 pb-6 pt-1 sm:px-6">{renderSection(s.key, k, f, setPreview)}</div>}

                {d?.valid === false && (
                  <div className="border-t border-danger-main/20 bg-danger-soft/40 px-5 py-3.5 sm:px-6">
                    <label className="mb-1.5 block text-xs font-medium text-danger" htmlFor={`note-${s.key}`}>
                      What needs fixing? <span className="font-normal text-text-muted">— the facilitator sees this</span>
                    </label>
                    <Textarea
                      id={`note-${s.key}`}
                      rows={2}
                      placeholder="e.g. The PAN number doesn’t match the uploaded card"
                      value={d.note}
                      onChange={(e) => setDecisions((x) => ({ ...x, [s.key]: { ...x[s.key], note: e.target.value } }))}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Progress and the way out — sticks to the bottom while you work through the sections */}
      <div className="sticky bottom-4 z-10 max-md:bottom-[calc(5.125rem+env(safe-area-inset-bottom))] -mt-20 flex flex-wrap items-center gap-3 rounded-xl border border-border-strong bg-elevated/95 px-4 py-3 shadow-raised backdrop-blur sm:px-5">
        <p className="min-w-0 flex-1 text-[13px] text-text-secondary">
          {!allChecked ? (
            <>
              <span className="font-semibold tabular-nums text-text">
                {checked} of {sections.length}
              </span>{' '}
              checked
            </>
          ) : invalid.length ? (
            <>
              <span className="font-semibold tabular-nums text-danger">{invalid.length}</span> {invalid.length === 1 ? 'section needs' : 'sections need'} changes
              {notesMissing && <span className="text-text-muted"> · add a note to each</span>}
            </>
          ) : (
            <span className="font-medium text-success">Everything checks out</span>
          )}
        </p>
        <Button variant="ghost" onClick={() => navigate('/facilitators')} className="hidden sm:inline-flex">
          Cancel
        </Button>
        {outcome === 'send-back' ? (
          <Button variant="secondary" leftIcon={CornerUpLeft} onClick={() => setConfirm(true)} disabled={notesMissing}>
            Send back for changes
          </Button>
        ) : (
          <Button leftIcon={BadgeCheck} onClick={() => setConfirm(true)} disabled={outcome !== 'approve'}>
            Approve KYC
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={finish}
        loading={saving}
        title={outcome === 'approve' ? `Approve ${f.name}’s KYC?` : `Send ${f.name}’s KYC back?`}
        description={
          outcome === 'approve'
            ? 'They move on to payment setup.'
            : `They’ll get the KYC link again with your notes on: ${invalid.map((s) => s.title.toLowerCase()).join(', ')}.`
        }
        confirmLabel={outcome === 'approve' ? 'Approve KYC' : 'Send back'}
      />
      <ConfirmDialog
        open={leaveTo != null}
        onClose={() => setLeaveTo(null)}
        onConfirm={() => {
          const to = leaveTo;
          setLeaveTo(null);
          setLeaveGuard(() => false);
          navigate(to);
        }}
        title="Leave without finishing?"
        description="The sections you’ve marked won’t be saved."
        confirmLabel="Leave"
        cancelLabel="Stay"
        tone="danger"
      />
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
      {/* The photo, large (a bigger version of the same picture) */}
      <Modal open={viewPhoto} onClose={() => setViewPhoto(false)} size="lg" title={f.name} description="Profile photo">
        <div className="flex justify-center rounded-xl bg-surface-sunken/60 p-4">
          <img
            src={f.photo?.replace(/w=\d+&h=\d+/, 'w=900&h=900')}
            alt={f.name}
            className="max-h-[65dvh] w-auto max-w-full rounded-xl object-contain shadow-card"
          />
        </div>
      </Modal>
    </div>
  );
}


/** How far the check has got: a ring filling green as sections are checked (red while any is not valid), "2 / 8" inside */
function ProgressRing({ done, total, bad }) {
  const r = 30;
  const len = 2 * Math.PI * r;
  const share = total ? done / total : 0;
  return (
    // Phones: sits in the hero's top-right corner, beside the photo (it used to trail under the contacts, leaving an empty
    // gap next to the photo)
    <div className="flex shrink-0 flex-col items-center gap-1.5 max-sm:absolute max-sm:right-5 max-sm:top-6 sm:self-center" role="img" aria-label={`${done} of ${total} sections checked`}>
      <span className="relative size-16">
        <svg viewBox="0 0 72 72" className="size-full -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" className="stroke-text-muted/15" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - share)}
            className={cn('transition-[stroke-dashoffset] duration-500 ease-out', bad ? 'stroke-danger-main/70' : 'stroke-success-main/80')}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums text-text">
          {done}
          <span className="text-xs font-medium text-text-muted">/{total}</span>
        </span>
      </span>
      <span className="whitespace-nowrap text-xs text-text-muted">sections checked</span>
    </div>
  );
}

/**
 * Valid / Not valid — two clear choices; the picked one fills in its colour. Phones: a full-width row of two equal
 * buttons under the section title (beside it they squeezed the title onto two lines)
 */
function ValidToggle({ value, onChange, label }) {
  const base = 'inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus max-sm:h-9 max-sm:flex-1';
  return (
    <div className="flex shrink-0 gap-1.5 max-sm:w-full max-sm:gap-2" role="group" aria-label={`${label}: valid or not`}>
      <button
        type="button"
        aria-pressed={value === true}
        onClick={() => onChange(true)}
        className={cn(base, value === true ? 'border-success-main bg-success-main text-white' : 'border-border-strong bg-surface text-text-secondary hover:border-success-main/50 hover:text-success dark:bg-surface-secondary')}
      >
        <Check className="size-3.5" aria-hidden="true" />
        Valid
      </button>
      <button
        type="button"
        aria-pressed={value === false}
        onClick={() => onChange(false)}
        className={cn(base, value === false ? 'border-danger-main bg-danger-main text-white' : 'border-border-strong bg-surface text-text-secondary hover:border-danger-main/50 hover:text-danger dark:bg-surface-secondary')}
      >
        <X className="size-3.5" aria-hidden="true" />
        Not valid
      </button>
    </div>
  );
}

/** A section's verdict in the side list: empty ring, green tick or red cross */
function Verdict({ d }) {
  if (!d) return <span className="size-4 shrink-0 rounded-full border-2 border-border-strong" aria-label="Not checked" />;
  return d.valid ? (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success-main text-white" aria-label="Valid">
      <Check className="size-3" strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-danger-main text-white" aria-label="Not valid">
      <X className="size-3" strokeWidth={3} />
    </span>
  );
}


function VerifySkeleton() {
  return (
    <div className="flex flex-col gap-5" role="status" aria-label="Loading">
      <Skeleton className="h-32 rounded-card" />
      <div className="grid gap-5 lg:grid-cols-[14rem_1fr]">
        <Skeleton className="hidden h-80 rounded-card lg:block" />
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
