import { FolderKanban, IndianRupee, ReceiptText, UsersRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { Avatar, Card, IconTile } from '@/components/ui';
import { CopyButton } from './CopyButton';

/**
 * Overview — a stats strip (numbers split by thin dividers, each opens its section) and one information card
 * (profile · contact · addresses as sections divided by soft lines, plain text inside). View only.
 */
export function OverviewTab({ client, projectCount = 0, participantCount = 0, onOpenTab }) {
  const f = client.form;
  const company = f.trainingFor !== 'individual';

  // The invoice count fills in once that list is connected
  const stats = [
    { key: 'projects', label: 'Projects', value: projectCount, icon: FolderKanban, tone: 'primary' },
    { key: 'participants', label: 'Participants', value: participantCount, icon: UsersRound, tone: 'success' },
    { key: 'invoices', label: 'Invoices', value: 0, icon: ReceiptText, tone: 'violet' },
    { key: 'invoices', label: 'Outstanding', value: '₹0', icon: IndianRupee, tone: 'warning' },
  ];

  const mobile = f.mobile ? `+91 ${f.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}` : '';
  const landline = f.phone ? `${f.stdCode ? `(${f.stdCode}) ` : ''}${f.phone}` : '';

  return (
    <div className="flex flex-col gap-5">
      {/* Stats strip — each number opens its section */}
      <Card padding="none" className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        {stats.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onOpenTab(s.key)}
            className={cn(
              'flex min-w-0 items-center gap-3.5 px-5 py-4 text-left max-sm:px-4 max-sm:py-3.5 transition-colors hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
              // Thin dividers: a 2×2 grid on smaller screens, one row from lg
              i < 2 && 'border-b border-border-strong lg:border-b-0',
              i % 2 === 0 && 'border-r border-border-strong',
              i === 1 && 'lg:border-r',
            )}
          >
            {/* Phones: no icon tile — the half-width cells were too tight (labels cut off) */}
            <IconTile icon={s.icon} tone={s.tone} className="max-sm:hidden" />
            <span className="min-w-0">
              <span className="block text-xl font-bold leading-7 tracking-tight tabular-nums text-text">{s.value}</span>
              <span className="block text-xs text-text-secondary sm:truncate">{s.label}</span>
            </span>
          </button>
        ))}
      </Card>
      {/* One card, three sections */}
      <Card tint="primary" subtleTint padding="none" className="divide-y divide-dashed divide-border-strong">
        <Section title={company ? 'Company profile' : 'Participant profile'}>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {company ? (
              <>
                <Fact label="Company type" value={f.companyType} />
                <Fact label="Industry" value={f.industry} />
                <Fact label="Client code" value={client.code} mono copy />
                {/* In an SEZ: show its SEZ number instead of a bare "Yes" */}
                <Fact label="Special Economic Zone" value={f.sez === 'yes' ? (f.sezNo ? `Yes · ${f.sezNo}` : 'Yes') : f.sez === 'no' ? 'No' : ''} />
              </>
            ) : (
              <>
                <Fact label="Department" value={f.department} />
                <Fact label="Designation" value={f.designation} />
                <Fact label="Participant ID" value={client.code} mono copy />
                <Fact label="Email" value={f.email} href={f.email && `mailto:${f.email}`} />
              </>
            )}
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

        <Section title="Contact">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone numbers call, the website opens in a new tab, email opens the mail app */}
            <Fact label="Mobile" value={mobile} href={f.mobile && `tel:+91${f.mobile}`} />
            <Fact label="Landline" value={landline} href={f.phone && `tel:${f.stdCode ?? ''}${f.phone}`} />
            {company ? (
              <Fact label="Website" value={f.website} href={f.website && (/^https?:\/\//i.test(f.website) ? f.website : `https://${f.website}`)} external wide />
            ) : (
              <Fact label="Email" value={f.email} href={f.email && `mailto:${f.email}`} wide />
            )}
          </dl>
        </Section>

        <Section title="Addresses">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Address label="Communication" address={f.comm} />
            {f.officeSame ? (
              <div className="min-w-0">
                <dt className="text-xs font-medium text-text-secondary">Office</dt>
                <dd className="mt-1 text-sm text-text-secondary">Same as the communication address</dd>
              </div>
            ) : (
              <Address label="Office" address={f.office} />
            )}
          </dl>
        </Section>
      </Card>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section className="px-5 py-5 sm:px-6">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">{title}</h3>
      {children}
    </section>
  );
}

/**
 * One label/value pair; empty values show a quiet dash. `wide` spans two columns on large screens.
 * `href` makes the value a link (`external` opens a new tab); `copy` adds a copy button on hover.
 */
export function Fact({ label, value, mono, wide, title, href, external, copy }) {
  const text = (
    <span className={cn('truncate', mono && 'font-mono tracking-wide')} title={title ?? (value || undefined)}>
      {value || '—'}
    </span>
  );
  return (
    <div className={cn('group min-w-0', wide && 'lg:col-span-2')}>
      <dt className="text-xs font-medium text-text-secondary">{label}</dt>
      <dd className={cn('mt-1 flex min-w-0 items-center gap-1 text-sm font-medium', value ? 'text-text' : 'text-text-muted')}>
        {value && href ? (
          <a
            href={href}
            {...(external && { target: '_blank', rel: 'noreferrer' })}
            className="min-w-0 truncate rounded-sm text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {text}
          </a>
        ) : (
          text
        )}
        {value && copy && <CopyButton text={value} label={label.toLowerCase()} />}
      </dd>
    </div>
  );
}

function Address({ label, address = {} }) {
  const lines = [[address.line1, address.line2].filter(Boolean).join(', '), [address.city, address.state, address.pin].filter(Boolean).join(', '), address.country].filter(Boolean);
  return (
    <div className="group min-w-0">
      <dt className="flex items-center gap-1 text-xs font-medium text-text-secondary">
        {label}
        {lines.length > 0 && <CopyButton text={lines.join(', ')} label={`${label.toLowerCase()} address`} className="-my-1" />}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-text">
        {lines.length ? (
          lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))
        ) : (
          <span className="text-text-muted">Not added yet</span>
        )}
      </dd>
    </div>
  );
}
