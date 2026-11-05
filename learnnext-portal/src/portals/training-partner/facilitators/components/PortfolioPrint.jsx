import { Award, BadgeCheck, Building2, GraduationCap, Link2, Mail, MapPin, Phone, Quote, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { LogoMark } from '@/components/brand/Logo';
import { TYPE_LABEL } from './facilitatorMeta';
import { ART, BoardScene, ChatScene } from './portfolioArt';

const BARS = [ART.peachDeep, ART.mintDeep, ART.lavDeep, ART.blue];
const SOFT = ['bg-[#e9f8f0]', 'bg-[#f2eeff]', 'bg-[#fff1e8]', 'bg-[#edf3ff]'];

/**
 * The portfolio as an A4 document — what "Download PDF" prints (the website is hidden in print; A4 is only ~720px wide,
 * so the website would print its phone layout). Two roomy pages (one dense page was "congested"):
 *   page 1 — gradient header (photo, name, role, location, rating, verified + board illustration), the numbers, About,
 *            Industry experience beside Certified in / Works with, Certified programs
 *   page 2 — Education & certifications timeline, What participants say (three quotes), a contact panel, footer
 * Blocks never split across pages.
 */
export function PortfolioPrint({ f, k, first, role, about, entities, programs, journey, voices, phone, socials, numbers }) {
  const maxYears = Math.max(1, ...k.experience.map((x) => x.years));
  return (
    <div className="hidden text-[12px] leading-[1.6] text-slate-700 print:block">
      {/* ——— Page 1 ——— (its own padding: browsers often print with no page margin) */}
      <div className="px-[16mm] pt-[14mm]">
      <header className="relative flex items-center gap-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1e8] via-[#fbf3f6] to-[#f2eeff] px-7 py-7">
        {f.photo ? (
          <img src={f.photo.replace(/w=\d+&h=\d+/, 'w=360&h=360')} alt="" className="size-[112px] shrink-0 rounded-full border-[5px] border-white object-cover shadow-md" />
        ) : (
          <span className="flex size-[112px] shrink-0 items-center justify-center rounded-full border-[5px] border-white text-4xl font-bold text-white" style={{ background: ART.navy }}>
            {first[0]}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: ART.peachDeep }}>
            <LogoMark className="size-4" />
            LearnNext · Facilitator portfolio
          </p>
          <h1 className="mt-2 whitespace-nowrap text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">{f.name}</h1>
          <p className="mt-0.5 text-[15px] font-semibold text-slate-700">{role}</p>
          <div className="mt-3 flex flex-col gap-1 text-[12px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {f.address.city}, {f.address.state}
            </span>
            {f.rating && (
              <span className="inline-flex items-center gap-1.5">
                <Stars score={f.rating.score} />
                <b className="text-slate-900">{f.rating.score.toFixed(1)}</b> from {f.rating.count} participant reviews
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
              Verified LearnNext facilitator
            </span>
          </div>
        </div>
        <BoardScene className="!w-[130px] shrink-0" />
      </header>

      <dl className="mt-6 grid grid-cols-4 gap-3">
        {numbers.map((n) => (
          <div key={n.label} className={cn('rounded-2xl px-4 py-4', n.tone.bg)}>
            <dd className="text-[24px] font-extrabold leading-none text-slate-900">{n.value}</dd>
            <dt className="mt-2 text-[10.5px] leading-snug text-slate-600">{n.label}</dt>
          </div>
        ))}
      </dl>

      <Block title="About" className="mt-8">
        <p className="text-[13px] leading-[1.8] text-slate-700">{about}</p>
      </Block>

      <div className="mt-8 grid grid-cols-2 gap-10">
        {k.experience.length > 0 && (
          <Block title="Industry experience">
            <ul className="flex flex-col gap-4">
              {k.experience.map((x, i) => (
                <li key={x.industry}>
                  <div className="flex justify-between text-[12.5px]">
                    <span className="font-semibold text-slate-900">{x.industry}</span>
                    <span className="text-slate-500">{x.years} yrs</span>
                  </div>
                  <div className="mt-1.5 h-[7px] overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(10, (x.years / maxYears) * 100)}%`, background: BARS[i % BARS.length] }} />
                  </div>
                </li>
              ))}
            </ul>
          </Block>
        )}
        <div className="flex flex-col gap-8">
          {f.certifications.length > 0 && (
            <Block title="Certified in">
              <ul className="flex flex-col gap-2.5 text-[12.5px]">
                {f.certifications.map((c, i) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: `${BARS[i % BARS.length]}26`, color: BARS[i % BARS.length] }}>
                      <Award className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-medium text-slate-800">{c}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}
          {entities.length > 0 && (
            <Block title="Works with">
              <ul className="flex flex-col gap-2.5 text-[12.5px]">
                {entities.map((e) => (
                  <li key={e} className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="font-medium text-slate-800">{e}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </div>

      {programs.length > 0 && (
        <Block title="Certified programs" className="mt-8">
          <ul className="grid grid-cols-2 gap-3">
            {programs.map((p, i) => (
              <li key={`${p.program}-${i}`} className={cn('rounded-2xl px-5 py-4', SOFT[i % SOFT.length])}>
                <p className="flex items-start gap-2 text-[13.5px] font-bold text-slate-900">
                  <Award className="mt-0.5 size-4 shrink-0" style={{ color: ART.navy }} aria-hidden="true" />
                  {p.program}
                </p>
                <p className="mt-1 pl-6 text-[11px] text-slate-600">
                  {p.entity}
                  {p.subEntity && p.subEntity !== '—' ? ` · ${p.subEntity}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      </div>

      {/* ——— Page 2 ——— */}
      <div className="break-before-page px-[16mm] pt-[14mm]">
        <Block title="Education & certifications">
          <ol className="relative ml-2 border-l-2 border-dashed border-slate-200 pl-7">
            {journey.map((q, i) => (
              <li key={`${q.course}-${i}`} className="relative break-inside-avoid pb-6 last:pb-0">
                <span
                  className="absolute -left-[41px] top-0 inline-flex size-7 items-center justify-center rounded-full ring-4 ring-white"
                  style={{ background: `${BARS[i % BARS.length]}26`, color: BARS[i % BARS.length] }}
                  aria-hidden="true"
                >
                  {q.type === 'Degree' ? <GraduationCap className="size-3.5" /> : <Award className="size-3.5" />}
                </span>
                <p className="text-[10.5px] font-semibold text-slate-400">
                  {q.start} – {q.end} · {q.type}
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-slate-900">{q.course}</p>
                <p className="text-[12px] text-slate-600">{q.college}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="What participants say" className="mt-10">
          <div className="flex items-start gap-6">
            <ul className="grid flex-1 grid-cols-3 gap-3">
              {voices.map(([text, who, industry], i) => (
                <li key={text} className={cn('flex flex-col rounded-2xl px-4 py-4', SOFT[(i + 1) % SOFT.length])}>
                  <Quote className="size-4 text-slate-400" aria-hidden="true" />
                  <p className="mt-2 flex-1 text-[11.5px] leading-[1.65] text-slate-700">{text}</p>
                  <p className="mt-3 text-[10.5px] text-slate-500">
                    <b className="text-slate-800">{who}</b>
                    <span className="block">{industry}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Block>

        {/* Contact panel */}
        <section className="mt-10 flex break-inside-avoid items-center gap-8 rounded-3xl px-8 py-7 text-white" style={{ background: ART.navy }}>
          <ChatScene className="!w-[120px] shrink-0 rounded-2xl bg-white/95 p-2" />
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-extrabold tracking-tight">Let’s work together</p>
            <p className="mt-1 text-[11.5px] text-white/70">
              {first} runs in-person and virtual programs{entities.length ? ' with LearnNext partners' : ''}.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[12px]">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-white/60" aria-hidden="true" />
                <span className="break-all">{f.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-white/60" aria-hidden="true" />
                {phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-white/60" aria-hidden="true" />
                {f.address.city}, {f.address.state}
              </li>
              {socials.map(([label, url]) => (
                <li key={label} className="flex items-center gap-2">
                  <Link2 className="size-4 shrink-0 text-white/60" aria-hidden="true" />
                  <span className="break-all">{url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-8 flex justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-400">
          <span>
            {f.name} · {TYPE_LABEL[f.type]} · <span className="font-mono">{k.code}</span> · with LearnNext since {formatDate(f.kycDoneAt ?? f.createdAt)}
          </span>
          <span>Portfolio by LearnNext · {formatDate(new Date())}</span>
        </footer>
      </div>
    </div>
  );
}

/** A block with a small coloured bar + title; never split across pages */
function Block({ title, className, children }) {
  return (
    <section className={cn('break-inside-avoid', className)}>
      <h2 className="mb-4 flex items-center gap-2.5 text-[15px] font-extrabold tracking-tight text-slate-900">
        <span className="h-4 w-1 rounded-full" style={{ background: ART.peachDeep }} aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stars({ score }) {
  const full = Math.round(score);
  return (
    <span className="inline-flex gap-px" aria-label={`${score.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn('size-3.5', n <= full ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} aria-hidden="true" />
      ))}
    </span>
  );
}
