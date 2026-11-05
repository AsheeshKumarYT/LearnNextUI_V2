import { useState } from 'react';
import { Eye, FileText, Percent, ReceiptText } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatNumber';
import { Card } from '@/components/ui';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { TabHeader } from './TabHeader';

const addressText = (b) => [b.line1, b.line2].filter(Boolean).join(', ');
const placeText = (b) => [b.city, b.state, b.pin].filter(Boolean).join(', ');

/**
 * Tax & Billing — exactly what the Add client form's Billing step collects, shown the same way so it reads at a glance:
 *   Billing addresses  the same cards as the form: "Billing address 1", the address, the GSTIN and its certificate
 *   Lower TDS          Yes / No, and when yes: rate, amount, section, valid from / to and the certificate
 * Individuals have their own GST No. instead of billing addresses. Certificates open in the preview. View only.
 */
export function TaxBillingTab({ client }) {
  const f = client.form;
  const company = f.trainingFor !== 'individual';
  const [preview, setPreview] = useState(null);
  const billing = (f.billing ?? []).filter((b) => b.gstNo);

  return (
    <div className="flex flex-col gap-5">
      <Card tint="warning" subtleTint flatOnMobile padding="none">
        <TabHeader
          icon={ReceiptText}
          tone="warning"
          title={company ? 'Billing addresses' : 'GST'}
          description={company ? 'One for each GST registration the company is billed under.' : 'The participant’s GST registration, if any.'}
          hideTitleOnMobile // phones: the address cards speak for themselves
        />
        {/* Phones: the card's frame is gone, so its inner padding shrinks to line the address cards up with the page */}
        <div className="px-5 pb-6 max-sm:px-3 max-sm:pb-0 max-sm:pt-1 sm:px-6">
          {company ? (
            billing.length ? (
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {billing.map((b, i) => (
                  <li key={b.id ?? i} className="flex flex-col rounded-xl border border-border-strong bg-surface/80 p-4 shadow-xs dark:bg-surface-secondary/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Billing address {i + 1}</p>
                    <p className="mt-1.5 text-[13px] font-medium text-text">{addressText(b)}</p>
                    <p className="text-[13px] text-text-secondary">{placeText(b)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-border-strong pt-3 text-xs">
                      <Gstin value={b.gstNo} />
                      {b.gstDoc && <DocLink file={b.gstDoc} onOpen={setPreview} />}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No billing addresses added.</Empty>
            )
          ) : f.gstNo ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Gstin value={f.gstNo} />
              {f.gstDoc && <DocLink file={f.gstDoc} onOpen={setPreview} />}
            </div>
          ) : (
            <Empty>No GST number added.</Empty>
          )}
        </div>
      </Card>

      <Card tint="violet" subtleTint padding="none">
        <TabHeader icon={Percent} tone="violet" title="Lower TDS" description={f.lowerTds ? 'The client has a lower TDS certificate.' : 'No lower TDS certificate — the standard rate applies.'} />
        {f.lowerTds && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 px-5 pb-6 sm:grid-cols-3 sm:px-6 xl:grid-cols-6">
            <Fact label="Lower TDS rate">{f.tdsRate ? `${f.tdsRate}%` : null}</Fact>
            <Fact label="Amount">{f.tdsAmount ? formatCurrency(Number(f.tdsAmount), 'INR') : null}</Fact>
            <Fact label="Section">{f.tdsSection}</Fact>
            <Fact label="Valid from">{f.tdsFrom ? formatDate(f.tdsFrom) : null}</Fact>
            <Fact label="Valid to">{f.tdsTo ? <ValidTo date={f.tdsTo} /> : null}</Fact>
            <Fact label="Certificate">{f.tdsCert ? <DocLink file={f.tdsCert} onOpen={setPreview} /> : null}</Fact>
          </dl>
        )}
      </Card>

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

/** The GSTIN, as on the form's address cards */
function Gstin({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-sunken px-2 py-1 font-mono font-semibold text-text-secondary">
      <ReceiptText className="size-3.5" aria-hidden="true" />
      {value}
    </span>
  );
}

/** A certificate's file name — opens it in the preview (as on the form) */
function DocLink({ file, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(file)}
      title={`View ${file.name}`}
      className="group inline-flex min-w-0 max-w-full items-center gap-1 rounded text-xs text-text-muted hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <FileText className="size-3.5 shrink-0 group-hover:hidden" aria-hidden="true" />
      <Eye className="hidden size-3.5 shrink-0 group-hover:block" aria-hidden="true" />
      <span className="truncate group-hover:underline">{file.name}</span>
    </button>
  );
}

/** The end date, with a quiet note when it's close or past */
function ValidTo({ date }) {
  const left = Math.ceil((new Date(date).getTime() - Date.now()) / 864e5);
  return (
    <span>
      {formatDate(date)}
      {left < 0 ? <span className="block text-xs font-normal text-danger">Expired</span> : left <= 30 && <span className="block text-xs font-normal text-warning">Ends in {left} days</span>}
    </span>
  );
}

function Fact({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-text-secondary">{label}</dt>
      <dd className={cn('mt-1 text-sm font-medium', children ? 'text-text' : 'text-text-muted')}>{children || '—'}</dd>
    </div>
  );
}

function Empty({ children }) {
  return <p className="text-sm text-text-muted">{children}</p>;
}
