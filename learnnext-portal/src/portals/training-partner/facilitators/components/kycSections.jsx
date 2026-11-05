import { Award, Building2, BriefcaseBusiness, ExternalLink, Eye, FileText, Globe, GraduationCap, Landmark, MapPin, ReceiptText, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { formatFileSize } from '@/utils/formatNumber';

/*
 * The KYC form's sections and how each one reads — shared by Verify KYC (checking a submitted KYC) and the facilitator
 * details page (an active facilitator's profile, tab by tab).
 */// The KYC form's sections, in its order. `when` = only shown if the KYC has it (partner firm: channel partners only).
// `tone` = the card's tint and icon tile (as on the client detail tabs), until a verdict turns it green / red.
export const SECTIONS = [
  { key: 'personal', title: 'Personal details', icon: UserRound, tone: 'primary' },
  { key: 'address', title: 'Address', icon: MapPin, tone: 'info' },
  { key: 'tax', title: 'Tax details', icon: ReceiptText, tone: 'warning' },
  { key: 'bank', title: 'Bank details', icon: Landmark, tone: 'success' },
  { key: 'qualifications', title: 'Qualifications & certifications', icon: GraduationCap, tone: 'violet' },
  { key: 'experience', title: 'Experience', icon: BriefcaseBusiness, tone: 'info' },
  { key: 'programs', title: 'BYLD program certifications', icon: Award, tone: 'violet' },
  { key: 'firm', title: 'Partner firm', icon: Building2, tone: 'warning', when: (k) => Boolean(k.firm) },
  { key: 'social', title: 'Social profiles', icon: Globe, tone: 'primary' },
];

// The header facts' icons use the same colours as the section cards' icon tiles (CardHeader's IconTile: soft gradient,
// thin ring) — smaller and circular. Static class names for Tailwind.
export const CHIP_TONES = {
  primary: 'from-chart-1/15 to-chart-1/5 text-chart-1 ring-chart-1/15',
  info: 'from-chart-2/15 to-chart-2/5 text-chart-2 ring-chart-2/15',
  success: 'from-success-main/15 to-success-main/5 text-success ring-success-main/15',
  warning: 'from-chart-3/[0.12] to-chart-3/[0.04] text-warning ring-chart-3/15',
  violet: 'from-chart-4/15 to-chart-4/5 text-chart-4 ring-chart-4/15',
};

/** A fact in the header: a small icon tile (matching the section cards' tiles) + plain text, no box */
export function Chip({ icon: Icon, tone = 'primary', title, className, children }) {
  return (
    <span className={cn('inline-flex max-w-full items-center gap-2 text-[13px] text-text-secondary', className)} title={title}>
      <span className={cn('inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ring-1 ring-inset', CHIP_TONES[tone])} aria-hidden="true">
        <Icon className="size-3.5" />
      </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------ section bodies */

/** A section's details; `view(file)` opens a document in the viewer */
export function renderSection(key, k, f, view) {
  switch (key) {
    case 'personal':
      return (
        <Fields>
          <Field label="Facilitator code" value={k.code} />
          <Field label="Name" value={f.name} />
          <Field label="Date of birth" value={formatDate(k.personal.dob)} />
          <Field label="Mobile" value={`+91 ${k.personal.mobile}`} />
          <Field label="Alternate mobile" value={k.personal.altMobile && `+91 ${k.personal.altMobile}`} />
          <Field label="Email" value={k.personal.email} />
          <Field label="Alternate email" value={k.personal.altEmail} />
          <Field label="Signature">
            <span className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-3 text-xl text-text dark:bg-surface-secondary" style={{ fontFamily: '"Segoe Script", "Brush Script MT", cursive' }}>
              {k.personal.signature}
            </span>
          </Field>
        </Fields>
      );
    case 'address': {
      const same = JSON.stringify(k.address.current) === JSON.stringify(k.address.permanent);
      return (
        <div className="flex flex-col gap-5">
          <Address title="Current address" a={k.address.current} />
          {same ? <p className="text-xs text-text-muted">Permanent address: same as current</p> : <Address title="Permanent address" a={k.address.permanent} />}
        </div>
      );
    }
    case 'tax':
      return (
        <Fields>
          <Field label="PAN number" value={k.tax.pan} />
          <Field label="PAN card">{k.tax.panDoc ? <Doc onOpen={view} file={k.tax.panDoc} /> : null}</Field>
          <Field label="GST number" value={k.tax.gst} />
          <Field label="GST certificate">{k.tax.gstDoc ? <Doc onOpen={view} file={k.tax.gstDoc} /> : null}</Field>
          {k.tax.cin && (
            <>
              <Field label="CIN number" value={k.tax.cin} />
              <Field label="Incorporation certificate">
                <Doc onOpen={view} file={k.tax.cinDoc} />
              </Field>
            </>
          )}
        </Fields>
      );
    case 'bank':
      // One solid card per account (like the billing address cards): bank + which account, the numbers, then its documents
      return (
        <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {[k.banks.primary, ...k.banks.secondary].map((b, i) => (
            <li key={i} className={cn('flex flex-col rounded-xl border bg-surface p-4 shadow-xs dark:bg-surface-secondary', i === 0 ? 'border-chart-1/30' : 'border-border-strong')}>
              {/* Primary vs secondary: a blue tile + dot + word for the primary account, grey for the others (no badge) */}
              <div className="flex items-center gap-2.5">
                <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg', i === 0 ? cn('bg-gradient-to-br ring-1 ring-inset', CHIP_TONES.primary) : 'bg-surface-sunken text-text-secondary')} aria-hidden="true">
                  <Landmark className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">{b.bank}</p>
                  <p className={cn('mt-0.5 flex items-center gap-1.5 text-xs font-medium', i === 0 ? 'text-primary-text' : 'text-text-secondary')}>
                    <span className={cn('size-1.5 rounded-full', i === 0 ? 'bg-chart-1 ring-[3px] ring-chart-1/15' : 'bg-text-muted/60 ring-[3px] ring-text-muted/10')} aria-hidden="true" />
                    {i === 0 ? 'Primary account' : `Secondary account${k.banks.secondary.length > 1 ? ` ${i}` : ''}`}
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                <Field label="Account no." value={<span className="tabular-nums">{b.account}</span>} />
                <Field label="IFSC" value={<span className="tabular-nums">{b.ifsc}</span>} />
                <Field label="Account holder" value={b.holder} />
                <Field label="Branch" value={[b.branchName, b.branchCode].filter(Boolean).join(' · ')} />
              </dl>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-border-strong pt-3">
                {b.cheque ? <Doc onOpen={view} file={b.cheque} compact /> : <MissingDoc>No cancelled cheque</MissingDoc>}
                {b.passbook ? <Doc onOpen={view} file={b.passbook} compact /> : <MissingDoc>No passbook</MissingDoc>}
              </div>
            </li>
          ))}
        </ul>
      );
    case 'qualifications':
      return (
        <MiniTable
          columns={[
            { header: 'Type', cell: (q) => q.type },
            { header: 'Course', title: true, cell: (q) => <span className="font-medium text-text">{q.course}</span> },
            { header: 'Years', cell: (q) => <span className="tabular-nums">{`${q.start} – ${q.end}`}</span> },
            { header: 'Institute', cell: (q) => q.college },
            { header: 'Document', wide: true, cell: (q) => <Doc onOpen={view} file={q.doc} compact /> },
          ]}
          rows={k.qualifications}
        />
      );
    case 'experience':
      return (
        <MiniTable
          columns={[
            { header: 'Industry', title: true, cell: (x) => <span className="font-medium text-text">{x.industry}</span> },
            { header: 'Experience type', cell: (x) => x.type },
            { header: 'Years', cell: (x) => <span className="tabular-nums">{x.years} yrs</span> },
          ]}
          rows={k.experience}
        />
      );
    case 'programs':
      return (
        <MiniTable
          columns={[
            { header: 'Entity', cell: (x) => x.entity },
            { header: 'Sub-entity', cell: (x) => x.subEntity },
            { header: 'Program', title: true, cell: (x) => <span className="font-medium text-text">{x.program}</span> },
            { header: 'Certificate', wide: true, cell: (x) => (x.certificate ? <Doc onOpen={view} file={x.certificate} compact /> : null) },
          ]}
          rows={k.certifications}
        />
      );
    case 'firm':
      return (
        <div className="flex flex-col gap-5">
          <Fields>
            <Field label="Firm name" value={k.firm.name} />
            <Field label="Email" value={k.firm.email} />
            <Field label="Mobile" value={`+91 ${k.firm.mobile}`} />
            <Field label="Website" value={k.firm.website} />
          </Fields>
          <Address title="Firm address" a={k.firm.address} />
        </div>
      );
    case 'social':
      return (
        <div className="flex flex-wrap gap-2">
          {[
            ['LinkedIn', k.social.linkedin],
            ['X / Twitter', k.social.twitter],
            ['Facebook', k.social.facebook],
          ].map(([label, url]) =>
            url ? (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 text-[13px] font-medium text-text transition-colors hover:border-primary/40 hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary"
              >
                {label}
                <ExternalLink className="size-3.5 text-text-muted" aria-hidden="true" />
              </a>
            ) : (
              <span key={label} className="inline-flex h-9 items-center rounded-full border border-dashed border-border-strong px-3.5 text-[13px] text-text-muted">
                {label} — not added
              </span>
            ),
          )}
        </div>
      );
    default:
      return null;
  }
}

export function Fields({ children }) {
  return <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">{children}</dl>;
}

/** Label over value; an empty value is a quiet dash */
export function Field({ label, value, children }) {
  const content = children ?? value;
  return (
    <div className="min-w-0">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-1 break-words text-[13px] font-medium text-text">{content || <span className="font-normal text-text-muted/70">—</span>}</dd>
    </div>
  );
}

export function SubTitle({ children }) {
  return <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">{children}</h3>;
}

export function Address({ title, a }) {
  return (
    <div>
      <SubTitle>{title}</SubTitle>
      <Fields>
        <Field label="Address line 1" value={a.line1} />
        <Field label="Address line 2" value={a.line2} />
        <Field label="City" value={`${a.city}, ${a.state}`} />
        <Field label="Country · PIN" value={`${a.country} · ${a.pin}`} />
      </Fields>
    </div>
  );
}

/** An uploaded document: file icon, name and size — click to open it in the viewer (the icon turns into an eye on hover) */
export function Doc({ file, compact, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(file)}
      title={`View ${file.name}`}
      className={cn(
        'group inline-flex max-w-full items-center gap-2 rounded-lg border border-border-strong bg-surface text-left shadow-xs transition-colors hover:border-primary/40 hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary',
        compact ? 'px-2 py-1' : 'px-2.5 py-1.5',
      )}
    >
      <FileText className="size-4 shrink-0 text-danger group-hover:hidden" aria-hidden="true" />
      <Eye className="hidden size-4 shrink-0 text-primary-text group-hover:block" aria-hidden="true" />
      <span className="min-w-0 truncate text-xs font-medium text-text group-hover:text-primary-text">{file.name}</span>
      {!compact && <span className="shrink-0 text-[11px] tabular-nums text-text-muted">{formatFileSize(file.size)}</span>}
    </button>
  );
}

/** A document that wasn't uploaded */
function MissingDoc({ children }) {
  return <span className="inline-flex items-center rounded-lg border border-dashed border-border-strong px-2 py-1 text-xs text-text-muted">{children}</span>;
}

/**
 * A light table for repeated rows (banks, qualifications…) — no heavy header band; scrolls sideways if it must.
 * Phones: one card per row instead — the 	itle column (else the first) on top, the rest as label / value facts under a
 * dashed line (wide ones, e.g. documents, span both columns).
 */
export function MiniTable({ columns, rows }) {
  const first = columns.find((c) => c.title) ?? columns[0];
  const rest = columns.filter((c) => c !== first);
  return (
    <>
      <ul className="flex flex-col gap-3 sm:hidden">
        {rows.map((r, i) => (
          <li key={i} className="rounded-xl border border-border bg-surface/60 p-3.5">
            <div className="text-sm font-semibold text-text">{first.cell(r) ?? '—'}</div>
            {rest.length > 0 && (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-dashed border-border-strong pt-3 text-[13px]">
                {rest.map((c) => (
                  <div key={c.header} className={cn('min-w-0', c.wide && 'col-span-2')}>
                    <dt className="text-xs text-text-muted">{c.header}</dt>
                    <dd className="mt-0.5 min-w-0 break-words text-text-secondary">{c.cell(r) ?? <span className="text-text-muted/70">—</span>}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
      <MiniTableDesktop columns={columns} rows={rows} />
    </>
  );
}

function MiniTableDesktop({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border max-sm:hidden">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-surface-sunken/60">
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className="whitespace-nowrap px-3 py-2 text-xs font-medium text-text-muted">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.header} className="px-3 py-2.5 align-middle text-text-secondary">
                  {c.cell(r) ?? <span className="text-text-muted/70">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
