import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Moon, Sun, Award, BadgeCheck, BriefcaseBusiness, Download, GraduationCap, Mail, MapPin, Phone, Presentation, Quote, SearchX, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useTheme } from '@/hooks/useTheme';
import { facilitatorsApi } from '@/services/api';
import { Skeleton } from '@/components/feedback';
import { LogoMark } from '@/components/brand/Logo';
import { TYPE_LABEL } from './components/facilitatorMeta';
import { PortfolioPrint } from './components/PortfolioPrint';
import { ART, BoardScene, CertificateScene, ChatScene, GrowthScene, PlaneScene, RoadScene, SpeakerScene } from './components/portfolioArt';

const ROLE = { facilitator: 'Facilitator & trainer', partner: 'Channel partner', both: 'Facilitator & channel partner' };
// Soft tones for cards, in turn: background, icon tile, bar
const TONES = [
  { bg: 'bg-[#fff1e8] dark:bg-[#f39a6b]/10', tile: 'bg-[#ffc3a0] dark:bg-[#f39a6b]/25 text-[#8a3b12] dark:text-[#ffc3a0]', bar: ART.peachDeep },
  { bg: 'bg-[#e9f8f0] dark:bg-[#4fb98b]/10', tile: 'bg-[#a8e3c8] dark:bg-[#4fb98b]/25 text-[#1f6b4a] dark:text-[#a8e3c8]', bar: ART.mintDeep },
  { bg: 'bg-[#f2eeff] dark:bg-[#8f7be8]/12', tile: 'bg-[#d9cffc] dark:bg-[#8f7be8]/25 text-[#4b3aa8] dark:text-[#d9cffc]', bar: ART.lavDeep },
  { bg: 'bg-[#edf3ff] dark:bg-[#5b7fe8]/12', tile: 'bg-[#cfe0ff] dark:bg-[#5b7fe8]/25 text-[#2848a8] dark:text-[#cfe0ff]', bar: ART.blue },
];

// Sample participant comments for the demo (real ones come from session feedback later — see the PRD)
const VOICES = [
  ['The most practical session we have had in years — our managers still use the frameworks every week.', 'L&D Head', 'Financial Services'],
  ['Engaging from the first minute. Real examples, honest conversations and very clear takeaways.', 'Team Lead', 'BPOs'],
  ['Our first-time managers came back more confident. The follow-up coaching made all the difference.', 'HR Business Partner', 'Retail'],
  ['Brilliant at reading the room — it never felt like a lecture, always like a conversation.', 'Operations Manager', 'Manufacturing'],
  ['Clear, structured and warm. Participants rated it the best program of the quarter.', 'Talent Manager', 'IT Services'],
];

const NAV = [
  ['about', 'About'],
  ['expertise', 'Expertise'],
  ['programs', 'Programs'],
  ['journey', 'Journey'],
  ['voices', 'Voices'],
  ['contact', 'Contact'],
];

/**
 * A facilitator's portfolio (/facilitators/:id/portfolio) — opened in a new tab by "View portfolio" on their details
 * page; its own full page outside the app shell. A modern, light one-pager with custom flat illustrations (asked for:
 * "modern… illustrations"), everything from the facilitator's own data:
 *   hero (name, role, pitch, CTAs, rating) beside their photo with an illustrated board scene and floating facts →
 *   numbers → About (speaker illustration) → Expertise (growth illustration + industry cards) → Programs (certificate
 *   illustration) → Journey (road illustration + timeline) → Voices (chat illustration + rating + comments) → contact
 *   band (paper plane). "Download PDF" prints it (Save as PDF); the top bar is left out.
 */
export default function FacilitatorPortfolio() {
  const { id } = useParams();
  const { data: f, loading } = useAsync(() => facilitatorsApi.kyc(id), [id]);
  const lookups = useMemo(() => facilitatorsApi.lookups(), []);
  const { resolvedTheme, toggleTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  // The tab's title — also the file name the browser suggests for Save as PDF
  useEffect(() => {
    if (f) document.title = `${f.name} · Portfolio`;
  }, [f]);
  // Which section is in view (marked in the top bar) — the last one whose top has passed a third of the screen
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false); // the glass pill appears once the page moves
  useEffect(() => {
    if (!f) return undefined;
    const spy = () => {
      setScrolled(window.scrollY > 24);
      let current = null;
      for (const [key] of NAV) {
        const el = document.getElementById(key);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = key;
      }
      setActive(current);
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    return () => window.removeEventListener('scroll', spy);
  }, [f]);

  if (loading && !f) return <PortfolioSkeleton />;
  if (!f) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-white dark:bg-[#141b2d] p-6 text-center text-slate-900 dark:text-white">
        <SearchX className="size-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <p className="text-xl font-bold">Portfolio not found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">The facilitator may have been removed, or the link is out of date.</p>
      </main>
    );
  }

  const k = f.kyc;
  const first = f.name.split(' ').find((w) => w.length > 1) ?? f.name;
  const entityName = Object.fromEntries(lookups.entities.map((e) => [e.id, e.name]));
  const entities = f.entities.map((e) => entityName[e]).filter(Boolean);
  const programs = k.certifications.filter((c) => c.program && c.program !== '—');
  const programNames = [...new Set(programs.map((p) => p.program))];
  const journey = [...k.qualifications].sort((a, b) => b.end - a.end);
  const maxYears = Math.max(1, ...k.experience.map((x) => x.years));
  const listOf = (arr) => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} and ${arr.at(-1)}` : (arr[0] ?? ''));
  const seed = [...f.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const voices = [0, 1, 2].map((i) => VOICES[(seed + i) % VOICES.length]);
  const phone = `+91 ${f.mobile.replace(/(\d{5})(\d+)/, '$1 $2')}`;
  const go = (key) => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const about = [
    `${first} is a ${ROLE[f.type].toLowerCase()} with ${f.experience ?? 'several'} years of experience${f.industries.length ? ` across ${listOf(f.industries)}` : ''}.`,
    f.certifications.length || programNames.length
      ? `${first} ${f.certifications.length ? `holds ${listOf(f.certifications)}` : ''}${f.certifications.length && programNames.length ? ' and ' : ''}${programNames.length ? `is certified to deliver ${listOf(programNames)}` : ''}.`
      : '',
    f.trainings ? `So far ${first} has delivered ${f.trainings} trainings${f.rating ? `, rated ${f.rating.score.toFixed(1)} out of 5 by participants` : ''}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const numbers = [
    { icon: BriefcaseBusiness, value: f.experience ?? '—', label: 'Years of experience', tone: TONES[0] },
    { icon: Presentation, value: f.trainings, label: 'Trainings delivered', tone: TONES[1] },
    { icon: Star, value: f.rating ? f.rating.score.toFixed(1) : '—', label: f.rating ? `Rating · ${f.rating.count} reviews` : 'Rating', tone: TONES[2] },
    { icon: Award, value: programNames.length + f.certifications.length, label: 'Certifications & programs', tone: TONES[3] },
  ];
  const socials = [
    ['LinkedIn', k.social.linkedin],
    ['X / Twitter', k.social.twitter],
    ['Facebook', k.social.facebook],
  ].filter(([, url]) => url);

  return (
    <>
      <style>{`@page { size: A4; margin: 0; } @media print { html, body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      {/* Download PDF prints this A4 sheet; the website below is screen-only */}
      <PortfolioPrint
        f={f}
        k={k}
        first={first}
        role={ROLE[f.type]}
        about={about}
        entities={entities}
        programs={programs}
        journey={journey}
        voices={voices}
        phone={phone}
        socials={socials}
        numbers={numbers}
      />
    <div className="min-h-dvh bg-white text-slate-900 antialiased dark:bg-[#0d1220] dark:text-white print:hidden">

      {/* Top bar — a floating, blurred glass pill over the hero's soft colours (back by request, over the transparent
          bar), combined with "Transparent, appears on scroll": at the top there's no pill at all — the logo, links and
          button sit straight on the hero; once the page moves, the blurred glass pill fades in behind them. The section
          in view is marked with a white pill */}
      <nav className="fixed inset-x-0 top-3 z-30 px-3 sm:top-4 sm:px-6 print:hidden">
        <div
          className={cn(
            'mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-4 pr-2 ring-1 transition-[background-color,box-shadow,backdrop-filter] duration-300 sm:pl-5',
            scrolled
              ? 'bg-white/55 dark:bg-[#141b2d]/60 shadow-[0_10px_30px_-16px_rgba(30,42,74,0.25)] ring-white/70 dark:ring-white/10 backdrop-blur-xl backdrop-saturate-150'
              : 'bg-transparent shadow-none ring-transparent',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="leading-tight">
              <span className="block text-sm font-bold">LearnNext</span>
              <span className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">Portfolio · {f.name}</span>
            </span>
          </span>
          <div className="hidden items-center gap-0.5 rounded-full bg-slate-900/[0.04] dark:bg-white/[0.06] p-1 md:flex">
            {NAV.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => go(key)}
                aria-current={active === key || undefined}
                className={cn(
                  'cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                  active === key ? 'bg-white dark:bg-[#141b2d] text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Light / dark — the app's own theme switch, so the choice is remembered */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-slate-700 ring-1 ring-slate-900/10 transition-colors hover:bg-white/60 dark:text-amber-300 dark:ring-white/15 dark:hover:bg-white/10"
            >
              {dark ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#1e2a4a] px-3.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-4 dark:bg-white dark:text-slate-900"
            >
              <Download className="size-4" aria-hidden="true" />
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        <span className="absolute -left-40 -top-32 -z-10 size-[28rem] rounded-full bg-[#fff1e8] dark:bg-[#f39a6b]/10 blur-3xl" aria-hidden="true" />
        <span className="absolute -right-24 top-0 -z-10 size-[26rem] rounded-full bg-[#f2eeff] dark:bg-[#8f7be8]/12 blur-3xl" aria-hidden="true" />
        <span className="absolute bottom-0 left-1/3 -z-10 size-[22rem] rounded-full bg-[#e9f8f0] dark:bg-[#4fb98b]/10 blur-3xl" aria-hidden="true" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-28 sm:px-8 lg:min-h-dvh lg:grid-cols-[1fr_1.05fr] lg:pb-10 lg:pt-24 print:min-h-0 print:grid-cols-[1.2fr_1fr] print:py-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#141b2d] px-3 py-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-white/10">
              <BadgeCheck className="size-4 text-emerald-500" aria-hidden="true" />
              Verified LearnNext facilitator
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl print:text-4xl">
              Hi, I’m <span className="relative whitespace-nowrap">
                {first}
                <svg viewBox="0 0 200 16" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 10 C 50 2, 150 2, 196 10" fill="none" stroke={ART.peachDeep} strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-slate-300">.</span>
            </h1>
            <p className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200">{ROLE[f.type]}</p>
            <p className="mt-3 max-w-lg text-lg leading-8 text-slate-500 dark:text-slate-400 print:text-sm print:leading-6">
              {f.experience ?? 'Years of'} years of helping teams{f.industries.length ? ` in ${listOf(f.industries.slice(0, 3))}` : ''} learn, lead and grow — one practical session at a time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
              <a href={`mailto:${f.email}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1e2a4a] px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900">
                Work with {first}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <button type="button" onClick={() => go('programs')} className="inline-flex h-12 cursor-pointer items-center rounded-full bg-white dark:bg-[#141b2d] px-6 text-sm font-semibold ring-1 ring-slate-200 dark:ring-white/10 transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                See programs
              </button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              {f.rating && (
                <span className="inline-flex items-center gap-2">
                  <Stars score={f.rating.score} />
                  <span>
                    <b className="text-slate-900 dark:text-white">{f.rating.score.toFixed(1)}</b> · {f.rating.count} reviews
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {f.address.city}, {f.address.state}
              </span>
            </div>
          </div>

          {/* Photo + illustration */}
          <div className="relative mx-auto w-full max-w-[32rem] print:max-w-[18rem]">
            {/* Phones: no board / bulb / plant art — just the photo, centred */}
            <BoardScene className="absolute -left-10 -top-6 w-[62%] opacity-95 max-sm:hidden sm:-left-16" />
            <div className="relative ml-auto mt-24 w-[72%] max-sm:mx-auto max-sm:mt-6 max-sm:w-[80%]">
              <span className="absolute -inset-3 -z-10 rotate-6 rounded-[2.5rem] bg-gradient-to-br from-[#ffc3a0] via-[#ffe4d4] to-[#d9cffc]" aria-hidden="true" />
              <div className="overflow-hidden rounded-[2.25rem] border-[6px] border-white dark:border-[#141b2d] bg-white dark:bg-[#141b2d] shadow-xl shadow-slate-900/10">
                {f.photo ? (
                  <img src={f.photo.replace(/w=\d+&h=\d+/, 'w=640&h=760')} alt={f.name} className="aspect-[5/6] w-full object-cover" />
                ) : (
                  <span className="flex aspect-[5/6] w-full items-center justify-center text-6xl font-bold text-white" style={{ background: ART.navy }}>
                    {first[0]}
                  </span>
                )}
              </div>
              {/* Phones keep the facts inside the photo's edges; wider screens let them float out */}
              <Chip className="-left-3 bottom-8 sm:-left-20 sm:bottom-10" icon={Presentation} value={f.trainings} label="trainings" tone={TONES[1].tile} />
              {f.rating && <Chip className="-bottom-5 -right-2 sm:-bottom-6 sm:-right-5" icon={Star} value={f.rating.score.toFixed(1)} label="rating" tone={TONES[0].tile} />}
            </div>
          </div>
        </div>
      </header>

      {/* Numbers */}
      <section className="px-5 sm:px-8">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 print:grid-cols-4">
          {numbers.map((n) => (
            // Phones: icon above the number (two narrow columns); from sm: icon beside it
            <div key={n.label} className={cn('flex min-w-0 flex-col items-start gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5', n.tone.bg)}>
              <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-2xl sm:size-12', n.tone.tile)}>
                <n.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl print:text-2xl">{n.value}</dd>
                <dt className="text-[13px] text-slate-600 dark:text-slate-300">{n.label}</dt>
              </span>
            </div>
          ))}
        </dl>
      </section>

      {/* About */}
      <Section id="about" eyebrow="About" title={`A little about ${first}`} art={<SpeakerScene />} artTone="bg-[#f2eeff] dark:bg-[#8f7be8]/12">
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 print:text-sm print:leading-6">{about}</p>
        <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {[
            ['Role', TYPE_LABEL[f.type]],
            ['Based in', `${f.address.city}, ${f.address.state}`],
            ['Works with', entities.join(', ') || '—'],
            ['With LearnNext since', formatDate(f.kycDoneAt ?? f.createdAt)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">{label}</dt>
              <dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Expertise */}
      <Section id="expertise" eyebrow="Expertise" title="Industries & skills" art={<GrowthScene />} artTone="bg-[#e9f8f0] dark:bg-[#4fb98b]/10" flip>
        <ul className="flex flex-col gap-4">
          {k.experience.map((x, i) => {
            const t = TONES[i % TONES.length];
            return (
              <li key={x.industry} className="rounded-2xl bg-white dark:bg-[#141b2d] p-4 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10 print:break-inside-avoid">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{x.industry}</span>
                  <span className="text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">{x.years} yrs</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(10, (x.years / maxYears) * 100)}%`, background: t.bar }} />
                </div>
              </li>
            );
          })}
        </ul>
        {f.certifications.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Certified in</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {f.certifications.map((c, i) => (
                <li key={c} className={cn('inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold', TONES[(i + 2) % TONES.length].tile)}>
                  <Award className="size-3.5" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Programs */}
      {programs.length > 0 && (
        <Section id="programs" eyebrow="Programs" title={`What ${first} can run for your team`} art={<CertificateScene />} artTone="bg-[#fff1e8] dark:bg-[#f39a6b]/10">
          <ul className="grid gap-4">
            {programs.map((p, i) => {
              const t = TONES[(i + 1) % TONES.length];
              return (
                <li key={`${p.program}-${i}`} className={cn('flex items-center gap-4 rounded-2xl p-5 print:break-inside-avoid', t.bg)}>
                  <span className={cn('inline-flex size-12 shrink-0 items-center justify-center rounded-2xl', t.tile)}>
                    <Award className="size-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-bold">{p.program}</span>
                    <span className="block text-sm text-slate-600 dark:text-slate-300">
                      {p.entity}
                      {p.subEntity && p.subEntity !== '—' ? ` · ${p.subEntity}` : ''}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Journey */}
      <Section id="journey" eyebrow="Journey" title="Education & certifications" art={<RoadScene />} artTone="bg-[#edf3ff] dark:bg-[#5b7fe8]/12" flip>
        <ol className="relative ml-4 border-l-2 border-dashed border-slate-200 dark:border-white/10 pl-8">
          {journey.map((q, i) => (
            <li key={`${q.course}-${i}`} className="relative pb-7 last:pb-0 print:break-inside-avoid">
              <span className={cn('absolute -left-[49px] top-0 inline-flex size-9 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#0d1220]', TONES[i % TONES.length].tile)}>
                {q.type === 'Degree' ? <GraduationCap className="size-4" aria-hidden="true" /> : <Award className="size-4" aria-hidden="true" />}
              </span>
              <p className="text-[13px] font-semibold tabular-nums text-slate-400 dark:text-slate-500">
                {q.start} – {q.end} · {q.type}
              </p>
              <p className="mt-1 text-lg font-bold">{q.course}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{q.college}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Voices */}
      <Section id="voices" eyebrow="Voices" title="What participants say" art={<ChatScene />} artTone="bg-[#e9f8f0] dark:bg-[#4fb98b]/10">
        {f.rating && (
          <div className="mb-6 flex items-center gap-4">
            <span className="text-5xl font-extrabold tracking-tight">{f.rating.score.toFixed(1)}</span>
            <span>
              <Stars score={f.rating.score} />
              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">from {f.rating.count} participant reviews</span>
            </span>
          </div>
        )}
        <ul className="flex flex-col gap-4">
          {voices.map(([text, role, industry], i) => (
            <li key={text} className={cn('rounded-2xl p-5 print:break-inside-avoid', TONES[i % TONES.length].bg)}>
              <Quote className="size-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">{text}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">{role}</span>
                <span className="text-slate-500 dark:text-slate-400"> · {industry}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 px-5 pb-16 pt-20 sm:px-8 print:pt-8 print:break-inside-avoid">
        <div className="relative isolate mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2rem] bg-[#1e2a4a] p-8 text-white ring-1 ring-transparent sm:p-12 lg:grid-cols-[1.2fr_1fr] dark:bg-[#18233d] dark:ring-white/10">
          <span className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-white/[0.04]" aria-hidden="true" />
          <div>
            <PlaneScene className="mb-2 w-44" />
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl print:text-3xl">Let’s work together.</h2>
            <p className="mt-4 max-w-md leading-7 text-white/70">
              {first} runs in-person and virtual programs{entities.length ? ` with ${listOf(entities)}` : ''}. Drop a line to plan your next session.
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#141b2d] p-2 text-slate-900 dark:text-white">
            <ul className="divide-y divide-slate-100 dark:divide-white/10">
              {[
                { icon: Mail, label: 'Email', value: f.email, href: `mailto:${f.email}`, tone: TONES[3].tile },
                { icon: Phone, label: 'Phone', value: phone, href: `tel:+91${f.mobile}`, tone: TONES[1].tile },
                { icon: MapPin, label: 'Based in', value: `${f.address.city}, ${f.address.state}`, tone: TONES[0].tile },
              ].map((c) => {
                const body = (
                  <>
                    <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl', c.tone)}>
                      <c.icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{c.label}</span>
                      <span className="block break-all font-semibold">{c.value}</span>
                    </span>
                    {c.href && <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-600 print:hidden" aria-hidden="true" />}
                  </>
                );
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a href={c.href} className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 px-4 py-3.5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 pb-3 pt-4">
                {socials.map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-white/15">
                    {label}
                    <ArrowUpRight className="size-3.5 print:hidden" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-white/10 px-5 py-6 text-[13px] text-slate-500 dark:text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <span>
            {f.name} · {TYPE_LABEL[f.type]} · <span className="font-mono">{k.code}</span>
          </span>
          <span>Portfolio by LearnNext · {formatDate(new Date())}</span>
        </div>
      </footer>
    </div>
    </>
  );
}

/** A section: an illustration panel on one side (alternating with `flip`), the eyebrow, title and content on the other */
function Section({ id, eyebrow, title, art, artTone, flip, children }) {
  return (
    <section id={id} className="scroll-mt-24 px-5 pt-24 sm:px-8 print:pt-8">
      <div className={cn('mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16 print:grid-cols-[12rem_1fr] print:gap-8', flip && 'lg:grid-cols-[1fr_22rem] print:grid-cols-[1fr_12rem]')}>
        <div className={cn('flex items-center justify-center rounded-[2rem] p-8 lg:sticky lg:top-24 print:static print:p-4', artTone, flip && 'lg:order-2')}>
          {art}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: ART.peachDeep }}>
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl print:text-2xl">{title}</h2>
          <div className="mt-8 print:mt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** A floating fact beside the hero photo */
function Chip({ className, icon: Icon, value, label, tone }) {
  return (
    <div className={cn('absolute flex items-center gap-2.5 rounded-2xl bg-white dark:bg-[#141b2d] px-3 py-2 shadow-lg sm:gap-3 sm:px-4 sm:py-3 shadow-slate-900/10 ring-1 ring-slate-100 dark:ring-white/10 motion-safe:animate-[pf-bob_6s_ease-in-out_infinite]', className)}>
      <span className={cn('inline-flex size-9 items-center justify-center rounded-xl', tone)}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold tabular-nums">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </span>
    </div>
  );
}

/** Five stars, filled to the score (rounded) */
function Stars({ score }) {
  const full = Math.round(score);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${score.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn('size-4', n <= full ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} aria-hidden="true" />
      ))}
    </span>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="min-h-dvh bg-white dark:bg-[#141b2d]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-24 sm:px-8 lg:grid-cols-2" role="status" aria-label="Loading">
        <div className="space-y-4">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-12 w-72 rounded-full" />
        </div>
        <Skeleton className="h-[28rem] rounded-[2.5rem]" />
      </div>
    </div>
  );
}
