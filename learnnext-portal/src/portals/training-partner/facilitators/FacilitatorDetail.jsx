import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, CalendarClock, GraduationCap, Landmark, LayoutDashboard, Pencil, Presentation, FileUser, SearchX, Star, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { facilitatorsApi } from '@/services/api';
import { Avatar, Button, Card, IconTile, TabPanel } from '@/components/ui';
import { EmptyState, Skeleton } from '@/components/feedback';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { HeroMobileActions, SectionTabs } from '@/shared/clients/detail/ClientHero';
import { TabHeader } from '@/shared/clients/detail/TabHeader';
import { Fact, Section } from '@/shared/clients/detail/OverviewTab';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FacilitatorModal } from './components/FacilitatorModal';
import { TYPE_LABEL } from './components/facilitatorMeta';
import { SubTitle, renderSection } from './components/kycSections';

// The profile, tab by tab — the KYC form's sections grouped as on the client details page. `when` = only if they have it.
const TABS = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'personal', label: 'Personal & address', icon: UserRound },
  { value: 'bank', label: 'Tax & bank', icon: Landmark },
  { value: 'qualifications', label: 'Qualifications', icon: GraduationCap },
  { value: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { value: 'firm', label: 'Partner firm', icon: Building2, when: (f) => Boolean(f.kyc.firm) },
];

/**
 * Facilitator details (/facilitators/:id?tab=…) — opened by clicking an Active facilitator in the list. Laid out like
 * Client details: a hero card (who they are) with the section tabs on its bottom edge, then the open section full
 * width. Everything comes from their approved KYC (the same sections Verify KYC shows), view-only; Edit opens the
 * usual facilitator form.
 */
export default function FacilitatorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [version, setVersion] = useState(0); // bump after editing to re-read them
  const { data: f, loading } = useAsync(() => facilitatorsApi.kyc(id), [id, version]);
  const lookups = useMemo(() => facilitatorsApi.lookups(), []);
  const [editing, setEditing] = useState(false);
  const [portfolioInBar, setPortfolioInBar] = useState(true); // the tab bar says whether Portfolio fits at its end
  const [preview, setPreview] = useState(null); // the document open in the viewer

  const tabs = useMemo(() => (f ? TABS.filter((t) => !t.when || t.when(f)) : TABS), [f]);
  const tab = tabs.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'overview';
  const openTab = (value) => setParams(value === 'overview' ? {} : { tab: value }, { replace: true });
  const back = () => navigate('/facilitators');
  // Their portfolio: its own full page, in a new tab (not designed yet — Coming soon)
  const openPortfolio = () => window.open(`/facilitators/${id}/portfolio`, '_blank', 'noopener');

  if (loading && !f) return <DetailSkeleton />;
  if (!f || f.status !== 'active') {
    return (
      <Card className="lg:flex-1">
        <EmptyState
          icon={SearchX}
          title={f ? 'No profile to show yet' : 'Facilitator not found'}
          description={f ? `${f.name}’s profile opens here once they’re active.` : 'They may have been removed, or the link is out of date.'}
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={back}>
              All facilitators
            </Button>
          }
        />
      </Card>
    );
  }

  const k = f.kyc;
  const entityName = Object.fromEntries(lookups.entities.map((e) => [e.id, e.name]));
  const section = (key) => renderSection(key, k, f, setPreview);

  return (
    <div className="flex flex-col lg:flex-1">
      {/* Hero — as on Client details: identity + actions, the section tabs joined to its bottom edge */}
      <Card tint="primary" padding="none" className="overflow-hidden rounded-b-none border-b-0">
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            {/* Same size as the client logo on Client details */}
            <Avatar name={f.name} src={f.photo} size="xl" className="shrink-0 [&>*]:size-14 [&>*]:text-lg sm:[&>*]:size-16" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-6 text-text max-sm:pr-8 sm:text-2xl sm:leading-8">{f.name}</h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-text-secondary">
                <CodeChip code={k.code} />
                <span className="hidden sm:inline">{TYPE_LABEL[f.type]}</span>
                <Dot className="hidden sm:inline" />
                {f.address.city}
                <Dot />
                <span className="inline-flex items-center gap-1.5 font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success-main" aria-hidden="true" />
                  Active
                </span>
              </p>
            </div>
          </div>
          <HeroMobileActions
            onBack={back}
            backLabel="All facilitators"
            actions={[
              { icon: FileUser, label: 'View portfolio', onClick: openPortfolio },
              { icon: Pencil, label: 'Edit facilitator', onClick: () => setEditing(true), primary: true },
            ]}
          />
          <div className="flex shrink-0 flex-wrap gap-2 max-sm:hidden [&>*]:flex-1 sm:[&>*]:flex-none">
            {/* Only when the tab bar has no room left for Portfolio (it measures that) — then it sits here instead */}
            {!portfolioInBar && (
              <PortfolioButton onClick={openPortfolio} />
            )}
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={back}>
              All facilitators
            </Button>
            <Button leftIcon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </Card>
      {/* View portfolio — at the bar's right end while it fits beside the tabs (else in the hero); opens the portfolio
          page in a new tab. A plain link, "Avatar + label" and a white sparkle button were rejected */}
      <SectionTabs
        tabs={tabs}
        value={tab}
        onChange={openTab}
        ariaLabel="Facilitator sections"
        idBase="facilitator"
        onEndFit={setPortfolioInBar}
        end={
          <PortfolioButton size="sm" onClick={openPortfolio} />
        }
      />

      <TabPanel value={tab} idBase="facilitator" key={tab} className="mt-6 min-w-0 max-sm:mt-4 lg:flex lg:flex-1 lg:flex-col lg:[&>*]:flex-1">
        {tab === 'overview' && <Overview f={f} entityName={entityName} section={section} />}
        {tab === 'personal' && (
          <TabCard icon={UserRound} tone="primary" title="Personal & address" description="Who they are and where they live, from their KYC.">
            <Block>{section('personal')}</Block>
            <Block>{section('address')}</Block>
            <Block title="Social profiles">{section('social')}</Block>
          </TabCard>
        )}
        {tab === 'bank' && (
          <TabCard icon={Landmark} tone="success" title="Tax & bank" description="Where their fees are paid, and their tax details.">
            <Block>{section('tax')}</Block>
            <Block title="Bank accounts">{section('bank')}</Block>
          </TabCard>
        )}
        {tab === 'qualifications' && (
          <TabCard icon={GraduationCap} tone="violet" title="Qualifications" description="Their education, certifications and the programs they’re certified for.">
            <Block title="Qualifications & certifications">{section('qualifications')}</Block>
            <Block title="BYLD program certifications">{section('programs')}</Block>
          </TabCard>
        )}
        {tab === 'experience' && (
          <TabCard icon={BriefcaseBusiness} tone="info" title="Experience" description="The industries they’ve worked in, and for how long.">
            <Block>{section('experience')}</Block>
          </TabCard>
        )}
        {tab === 'firm' && (
          <TabCard icon={Building2} tone="warning" title="Partner firm" description="The firm they work through as a channel partner.">
            <Block>{section('firm')}</Block>
          </TabCard>
        )}
      </TabPanel>
      <FacilitatorModal
        open={editing}
        facilitator={f}
        onClose={() => setEditing(false)}
        onSaved={() => setVersion((n) => n + 1)}
      />
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

/**
 * View portfolio — in the app's own blue (a soft primary wash + hairline ring, like the open tab), file icon, and an arrow
 * that lifts on hover. `sm` for the tab bar's end, default size beside the hero's buttons.
 */
function PortfolioButton({ size = 'md', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary/[0.08] font-semibold text-primary-text ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-3.5 text-sm sm:h-9',
      )}
    >
      <FileUser className="size-4" aria-hidden="true" />
      View portfolio
      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden="true" />
    </button>
  );
}

function Dot({ className }) {
  return (
    <span className={cn('text-text-muted/60', className)} aria-hidden="true">
      ·
    </span>
  );
}

// A soft gradient wash in the card's colour (amber and green read strongest — kept a step lighter)
const tintOf = (tone) => ({ tint: tone, softTint: tone !== 'warning' && tone !== 'success', subtleTint: tone === 'warning' || tone === 'success' });

/** A tab's card: a soft gradient wash in its colour, the client-detail tab header, then its parts divided by hairlines */
function TabCard({ icon, tone, title, description, action, children }) {
  return (
    <Card {...tintOf(tone)} padding="none" className="overflow-hidden">
      <TabHeader icon={icon} tone={tone} title={title} description={description} hideTitleOnMobile className="border-b border-border">
        {action}
      </TabHeader>
      <div className="divide-y divide-border">{children}</div>
    </Card>
  );
}

function Block({ title, children }) {
  return (
    <div className="px-5 py-5 sm:px-6">
      {title && <SubTitle>{title}</SubTitle>}
      {children}
    </div>
  );
}

/**
 * Overview — laid out exactly like the client Overview: a stats strip (numbers split by thin dividers, plain labels) and
 * one information card (profile · contact · expertise · social as sections divided by soft dashed lines). View only.
 */
function Overview({ f, entityName, section }) {
  const ends = f.agreementEnd ? Math.ceil((new Date(f.agreementEnd) - Date.now()) / 864e5) : null;
  const stats = [
    { label: 'Trainings delivered', value: f.trainings.toLocaleString('en-IN'), icon: Presentation, tone: 'primary' },
    { label: f.rating ? `Rating (${f.rating.count} reviews)` : 'Rating', value: f.rating ? f.rating.score.toFixed(1) : '—', icon: Star, tone: 'warning' },
    { label: 'Years of experience', value: f.experience ?? '—', icon: BriefcaseBusiness, tone: 'violet' },
    { label: ends != null && ends <= 30 ? `Agreement ends in ${ends} days` : 'Agreement ends', value: f.agreementEnd ? formatDate(f.agreementEnd) : '—', icon: CalendarClock, tone: 'success', warn: ends != null && ends <= 30 },
  ];
  const mobile = `+91 ${f.mobile.replace(/(\d{5})(\d+)/, '$1 $2')}`;

  return (
    <div className="flex flex-col gap-5">
      <Card padding="none" className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'flex min-w-0 items-center gap-3.5 px-5 py-4 max-sm:px-4 max-sm:py-3.5',
              // Thin dividers: a 2×2 grid on smaller screens, one row from lg (as on the client Overview)
              i < 2 && 'border-b border-border-strong lg:border-b-0',
              i % 2 === 0 && 'border-r border-border-strong',
              i === 1 && 'lg:border-r',
            )}
          >
            {/* Phones: no icon tile — the half-width cells were too tight (labels cut off) */}
            <IconTile icon={s.icon} tone={s.tone} className="max-sm:hidden" />
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-lg font-bold leading-6 sm:text-xl sm:leading-7 tracking-tight tabular-nums text-text">{s.value}</span>
              <span className={cn('block text-xs sm:truncate', s.warn ? 'font-medium text-warning' : 'text-text-secondary')}>{s.label}</span>
            </span>
          </div>
        ))}
      </Card>

      <Card tint="primary" subtleTint padding="none" className="divide-y divide-dashed divide-border-strong">
        <Section title="Facilitator profile">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Type" value={TYPE_LABEL[f.type]} />
            <Fact label="Facilitator code" value={f.kyc.code} mono copy />
            <Fact label="Facilitator since" value={formatDate(f.kycDoneAt ?? f.createdAt)} />
            <div className="min-w-0">
              <dt className="text-xs font-medium text-text-secondary">Added by</dt>
              <dd className="mt-1 flex min-w-0 items-center gap-2 text-sm font-medium text-text">
                <Avatar name={f.createdBy} size="xs" />
                <span className="truncate">{f.createdBy}</span>
              </dd>
            </div>
            {/* Several values: their own full-width row, wrapping in full (never cut off with "…") */}
            <List label="Entities" items={f.entities.map((e) => entityName[e] ?? '—')} wide />
          </dl>
        </Section>

        <Section title="Contact">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Mobile" value={mobile} href={`tel:+91${f.mobile}`} />
            <Fact label="Email" value={f.email} href={`mailto:${f.email}`} />
            <Fact label="Location" value={`${f.address.city}, ${f.address.state}`} />
          </dl>
        </Section>

        <Section title="Expertise">
          {/* Two halves (each lines up with two of the four columns above) so the lists wrap in full */}
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <List label="Industries" items={f.industries} />
            <List label="Certifications" items={f.certifications} />
          </dl>
        </Section>

        <Section title="Social profiles">{section('social')}</Section>
      </Card>
    </div>
  );
}

/**
 * A fact with several values (Fact's look), in full: joined by soft dots and wrapping — never cut off with "…".
 * Phones: one per line (a wrapped dot-joined line left a stray "·" at the start of the next line).
 */
function List({ label, items, wide }) {
  return (
    <div className={cn('min-w-0', wide && 'sm:col-span-2 lg:col-span-4')}>
      <dt className="text-xs font-medium text-text-secondary">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-text">
        {items.length ? (
          <ul className="flex flex-wrap gap-x-2.5 gap-y-1 max-sm:flex-col">
            {items.map((x, i) => (
              <li key={x} className="inline-flex items-center gap-x-2.5">
                {i > 0 && (
                  <span className="text-text-muted/60 max-sm:hidden" aria-hidden="true">
                    ·
                  </span>
                )}
                {x}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-text-muted">—</span>
        )}
      </dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <Skeleton className="h-40 rounded-card" />
      <Skeleton className="h-80 rounded-card" />
    </div>
  );
}
