import { Suspense, useEffect, useRef } from 'react';
import { PendingToasts } from '@/context/ToastContext';
import { Outlet, Link } from 'react-router-dom';
import {
  BadgeCheck,
  Building2,
  CalendarRange,
  ChartColumn,
  ClipboardCheck,
  Download,
  Gauge,
  History,
  KeyRound,
  Layers,
  MessagesSquare,
  Moon,
  Receipt,
  Route,
  ShieldCheck,
  Smartphone,
  Users,
  Vote,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { LegalLinks } from '@/pages/auth/components/LegalLinks';
import { cn } from '@/utils/cn';

/** Inline animation-delay for staggered entrance animations. */
const delay = (ms) => ({ animationDelay: `${ms}ms` });

/**
 * Split-screen auth shell: brand story on the left, form card on the right (lg+); form only on phones. On large screens
 * the page fits the window — no scrolling (spacing tightens on shorter screens).
 * Auth pages render into <Outlet />.
 */
export function AuthLayout() {
  return (
    // minmax(0,1fr) on mobile keeps the single column at the viewport width (an implicit grid track grows to fit content).
    // Desktop: brand panel gets a fixed width sized to its content; the form side takes the rest.
    <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] bg-surface lg:h-dvh lg:overflow-hidden lg:grid-cols-[440px_minmax(0,1fr)] xl:grid-cols-[540px_minmax(0,1fr)] 2xl:grid-cols-[600px_minmax(0,1fr)]">
      {/* Form stays first in the DOM (reading/tab order, mobile), but sits on the right on desktop */}
      {/* Below lg (picked from previews: "Navy hero + sheet"): the desktop's navy panel becomes a hero on top — logo,
          the brand line and a small glass-tier stack — and the form rises over it as a white sheet with rounded top
          corners. The hero takes whatever room the sheet leaves, so the page never scrolls. */}
      {/* overflow-clip, not hidden: a hidden box can still be scrolled sideways by focus (e.g. opening the theme menu
          slid the whole form under the navy panel); clip can't scroll at all */}
      <div className="relative flex min-h-dvh min-w-0 flex-col overflow-clip max-lg:bg-brand-navy lg:order-2 lg:min-h-0 lg:bg-page lg:px-14 lg:py-6">
        <FormBackdrop />
        <MobileHeroBackdrop />
        <div className="relative flex animate-fade-in items-center justify-between max-lg:px-5 max-lg:pt-5 sm:max-lg:px-10">
          <Link to="/login" className="rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus">
            <Logo className="max-lg:hidden" />
            <Logo tone="inverse" className="lg:hidden" />
          </Link>
          <ThemeToggle className="max-lg:text-white/80 max-lg:hover:bg-white/10 max-lg:hover:text-white" />
        </div>
        <MobileHero />
        {/* One white sheet holds the form and the footer on phones (two separately painted blocks left a hairline seam
            of navy between them); on desktop the wrapper dissolves (`contents`) and the column works as before */}
        <div className="relative max-lg:-mt-2 max-lg:rounded-t-[28px] max-lg:bg-surface max-lg:shadow-[0_-16px_40px_-20px_rgb(0_0_0/0.5)] lg:contents">
        <main className="relative flex lg:flex-1 items-center justify-center max-lg:px-5 max-lg:pb-4 max-lg:pt-8 short:max-lg:pb-3 short:max-lg:pt-6 sm:max-lg:px-10 lg:min-h-0 lg:py-4">
          {/* Flat on phones; on desktop the form sits in a frosted-glass card over the glow and rings (they show through,
              softly blurred), with a thin light along its top edge */}
          <div
            className="relative w-full max-w-[400px] animate-rise lg:max-w-[460px] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-white/70 lg:bg-surface/55 lg:p-8 lg:shadow-[0_24px_60px_-28px_rgb(30_58_138/0.45)] lg:backdrop-blur-xl lg:backdrop-saturate-150 tall:lg:p-10 dark:lg:border-white/[0.14] dark:lg:bg-[#1f2b3a]/85 dark:lg:shadow-[0_30px_70px_-20px_rgb(0_0_0/0.75),0_0_0_1px_rgb(255_255_255/0.03)]"
            style={delay(150)}
          >
            <span
              className="pointer-events-none absolute inset-x-8 top-0 hidden h-px bg-gradient-to-r from-transparent via-white to-transparent lg:block dark:via-white/40"
              aria-hidden="true"
            />
            {/* A page still loading waits inside the card, so the whole screen never swaps to the full-page loader */}
            <Suspense fallback={null}>
              <Outlet />
              {/* e.g. "You have been signed out" appears once the sign-in page is showing */}
              <PendingToasts />
            </Suspense>
          </div>
        </main>
        <div className="relative animate-fade-in max-lg:px-5 max-lg:pb-[max(1rem,env(safe-area-inset-bottom))] max-lg:pt-2 sm:max-lg:px-10">
          <LegalLinks />
        </div>
        </div>
      </div>
      <BrandPanel />
    </div>
  );
}

/** Decorative depth behind the form card on desktop: fading dot grid, breathing brand glow and concentric rings. */
function FormBackdrop() {
  const ring = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border';
  return (
    <div className="pointer-events-none absolute inset-0 hidden animate-fade-in lg:block" aria-hidden="true">
      <div className="absolute inset-0 bg-dots-fade" />
      <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] motion-safe:animate-breathe" />
      <div className={`${ring} size-[680px] border-primary/20`} />
      <div className={`${ring} size-[940px] border-primary/12`} />
      <div className={`${ring} size-[1220px] border-primary/8`} />
    </div>
  );
}

/** Below lg: the brand panel's grid and drifting glows, behind the navy hero (the white sheet covers the lower part). */
function MobileHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -right-24 -top-24 size-[320px] rounded-full bg-[var(--ln-primary)] opacity-40 blur-[90px] motion-safe:animate-drift-a" />
      <div className="absolute -left-20 top-1/3 size-[260px] rounded-full bg-[#2bb3a3] opacity-[0.16] blur-[90px] motion-safe:animate-drift-c" />
    </div>
  );
}

/** Below lg: the brand line beside a small glass-tier stack, filling the room above the form sheet. */
function MobileHero() {
  return (
    <div className="relative flex min-h-0 flex-1 items-center gap-2 overflow-hidden px-5 pb-6 pt-4 sm:px-10 short:pb-5 short:pt-2 lg:hidden" aria-hidden="true">
      <div className="min-w-0 flex-1">
        <p className="animate-rise text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-[32px]" style={delay(100)}>
          Your learning, organised.
        </p>
        <p className="mt-2 animate-rise text-sm leading-6 text-white/65 short:hidden" style={delay(200)}>
          Every client, program and facilitator, at a glance.
        </p>
      </div>
      {/* Fixed small box (the scaled stack overflows it visually) so the hero can shrink on short screens */}
      <PlatformStack className="-mr-4 h-24 w-32 flex-none -translate-y-6 scale-[0.55] py-0 sm:mr-0 sm:scale-75" />
    </div>
  );
}

function BrandPanel() {
  return (
    <aside
      className="relative hidden overflow-hidden bg-brand-navy lg:order-1 lg:flex lg:min-h-0 lg:flex-col lg:justify-between lg:p-10 xl:px-14 tall:xl:py-14"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -right-32 -top-32 size-[520px] rounded-full bg-[var(--ln-primary)] opacity-40 blur-[120px] motion-safe:animate-drift-a" />
      <div className="absolute -bottom-40 -left-24 size-[420px] rounded-full bg-[#2bb3a3] opacity-[0.18] blur-[120px] motion-safe:animate-drift-c" />

      <div className="relative">
        {/* No "LearnNext Admin" eyebrow: every role signs in on this page */}
        <h2
          className="max-w-md animate-rise text-[32px] font-semibold leading-[1.15] tracking-[-0.025em] text-white xl:text-[38px]"
          style={delay(100)}
        >
          Your learning, organised.
        </h2>
        <p className="mt-3 max-w-md animate-rise text-[15px] leading-7 text-white/65" style={delay(200)}>
          Every client, program and facilitator, at a glance.
        </p>
      </div>

      {/* The platform, as a picture — in the room between the line and the pills */}
      <PlatformStack />

      {/* Everything the portal runs — names only, no figures */}
      <PortalMarquee />
    </aside>
  );
}

// The stack's glass tiers, bottom to top: [lift px, look]
const TIERS = [
  [0, 'border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02]'],
  [46, 'border-sky-300/25 bg-gradient-to-br from-sky-400/20 via-indigo-400/10 to-transparent'],
  [92, 'border-white/30 bg-gradient-to-br from-sky-300/40 via-indigo-400/35 to-violet-500/30 shadow-[0_0_60px_rgb(99_102_241/0.45)]'],
];

/**
 * The platform as a picture, in the middle of the panel: three floating isometric glass tiers stacked on a soft glow,
 * the top one bright with the LearnNext mark — everything built on one calm base. The stack bobs gently (still for
 * reduced motion) and a few sparks rise beside it. Sized to the room it has, so the page never scrolls.
 */
function PlatformStack({ className }) {
  return (
    <div className={cn('relative flex min-h-0 flex-1 animate-fade-in items-center justify-center py-6', className)} style={delay(300)}>
      {/* Glow under the stack */}
      <div className="absolute left-1/2 top-[66%] h-16 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(99_102_241/0.55),transparent)] blur-xl" />
      {/* A few sparks rising */}
      {[
        ['left-[30%]', 'top-[34%]', '0s'],
        ['left-[66%]', 'top-[26%]', '1.4s'],
        ['left-[72%]', 'top-[52%]', '2.6s'],
      ].map(([l, t, d]) => (
        <span
          key={l}
          className={`absolute size-1.5 rounded-full bg-sky-200 shadow-[0_0_10px_rgb(186_230_253)] motion-safe:animate-float ${l} ${t}`}
          style={{ animationDelay: d }}
        />
      ))}

      {/* Nudged down: the tiers rise up off the plane, so its middle sits low — this centres what you see */}
      <div className="translate-y-10 motion-safe:animate-float">
        {/* Isometric plane: the tiers lift off it along Z */}
        <div className="relative size-[150px] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-45deg)] xl:size-[170px]">
          {TIERS.map(([z, look], i) => (
            <div
              key={z}
              className={`absolute inset-0 rounded-[28px] border backdrop-blur-sm ${look}`}
              style={{ transform: `translateZ(${z}px)` }}
            >
              {i === TIERS.length - 1 && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <LogoMark className="size-16 rotate-45" />
                </span>
              )}
              {i === 1 && <span className="absolute inset-5 rounded-[18px] border border-dashed border-white/15" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// What the product does for you — features in plain words, not page names (every role signs in here):
// three gliding rows of pills: [icon, feature, tint]
const MARQUEE = [
  [
    [Route, 'Guided learning journeys', 'bg-emerald-400/20 text-emerald-300'],
    [Layers, 'Pre, during & post content', 'bg-sky-400/20 text-sky-300'],
    [CalendarRange, 'Programs on one timeline', 'bg-indigo-400/20 text-indigo-300'],
    [Gauge, 'Live progress tracking', 'bg-violet-400/20 text-violet-300'],
    [BadgeCheck, 'Facilitator KYC in minutes', 'bg-orange-400/20 text-orange-300'],
    [Building2, 'Every client in one place', 'bg-rose-400/20 text-rose-300'],
  ],
  [
    [ClipboardCheck, 'Assessments & quizzes', 'bg-orange-400/20 text-orange-300'],
    [Vote, 'Polls & surveys', 'bg-pink-400/20 text-pink-300'],
    [MessagesSquare, 'Built-in support chat', 'bg-rose-400/20 text-rose-300'],
    [ChartColumn, 'Insightful reports', 'bg-violet-400/20 text-violet-300'],
    [Smartphone, 'Works on any device', 'bg-sky-400/20 text-sky-300'],
    [History, 'Full activity history', 'bg-teal-400/20 text-teal-300'],
  ],
  [
    [KeyRound, 'Role-based access', 'bg-amber-300/20 text-amber-200'],
    [Receipt, 'GST-ready invoicing', 'bg-emerald-400/20 text-emerald-300'],
    [ShieldCheck, 'Secure sign-in', 'bg-indigo-400/20 text-indigo-300'],
    [Download, 'Install as an app', 'bg-sky-400/20 text-sky-300'],
    [Moon, 'Light & dark mode', 'bg-slate-300/20 text-slate-200'],
    [Users, 'Made for every team', 'bg-violet-400/20 text-violet-300'],
  ],
];

/**
 * What the product offers, shown without clutter (picked from previews: "Flowing marquee rows"): three rows of
 * frosted pills — an icon and a name each, no figures — gliding slowly sideways in alternating directions, fading out
 * at the panel's edges; they stand still for anyone who prefers reduced motion.
 * Hover = Windows 10 "Reveal" (the user's reference; the rows keep gliding): a light follows the cursor and reveals the
 * BORDERS of the pills near it — brightest on the side facing the pointer. Borders only — no light inside
 * the pills, no glow on the panel. Pill positions are read each frame only while the pointer is over the rows.
 */
const REVEAL_REACH = 170; // px — pills further than this from the cursor stay unlit

// Edge-only mask: the padding box minus the content box = a 1px ring over the pill's border
const RING_MASK = {
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
};

const HOVER_SPEED = 0.3; // the rows glide at 30% speed while the pointer is over them

function PortalMarquee() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let x = 0;
    let y = 0;
    let raf = 0;
    let on = false;
    const tick = () => {
      el.querySelectorAll('[data-pill]').forEach((p) => {
        const b = p.getBoundingClientRect();
        const near = x > b.left - REVEAL_REACH && x < b.right + REVEAL_REACH && y > b.top - REVEAL_REACH && y < b.bottom + REVEAL_REACH;
        p.style.setProperty('--x', near ? `${x - b.left}px` : '-9999px');
        p.style.setProperty('--y', near ? `${y - b.top}px` : '-9999px');
      });
      if (on) raf = requestAnimationFrame(tick);
    };
    // Hovering slows the glide (not a stop): the rows' speed eases to HOVER_SPEED and back over ~0.5s, so it never
    // jumps (playbackRate keeps each row's position)
    let speedRaf = 0;
    const easeSpeed = (target) => {
      cancelAnimationFrame(speedRaf);
      const anims = el.getAnimations({ subtree: true }).filter((a) => a.animationName === 'ln-marquee');
      const from = anims[0]?.playbackRate ?? 1;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 500);
        const rate = from + (target - from) * (1 - (1 - t) ** 3);
        anims.forEach((a) => a.updatePlaybackRate(rate));
        if (t < 1) speedRaf = requestAnimationFrame(step);
      };
      speedRaf = requestAnimationFrame(step);
    };
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!on) {
        on = true;
        el.dataset.reveal = 'on';
        raf = requestAnimationFrame(tick);
        easeSpeed(HOVER_SPEED);
      }
    };
    const leave = () => {
      if (!on) return;
      on = false;
      cancelAnimationFrame(raf);
      delete el.dataset.reveal;
      easeSpeed(1);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      leave();
      cancelAnimationFrame(speedRaf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="group/marquee relative -mx-10 flex animate-fade-in flex-col gap-3 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)] xl:-mx-14"
      style={delay(350)}
    >
      {MARQUEE.map((row, r) => (
        <div
          key={r}
          className="flex w-max gap-3 motion-safe:animate-[ln-marquee_48s_linear_infinite]"
          style={{ animationDirection: r % 2 ? 'reverse' : 'normal', animationDuration: `${44 + r * 8}s` }}
        >
          {/* Listed twice, so the glide (half its width) loops seamlessly */}
          {[...row, ...row].map(([Icon, name, tint], i) => (
            <span
              key={i}
              data-pill
              className="relative inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-white/85 backdrop-blur-md"
              aria-hidden={i >= row.length ? 'true' : undefined}
            >
              {/* Reveal: the border lights up on the side facing the cursor */}
              <span
                className="pointer-events-none absolute -inset-px rounded-full p-px opacity-0 transition-opacity duration-200 group-data-[reveal=on]/marquee:opacity-100"
                style={{ ...RING_MASK, background: 'radial-gradient(150px circle at var(--x, -9999px) var(--y, -9999px), rgb(255 255 255 / 0.6), transparent 100%)' }}
                aria-hidden="true"
              />
              <span className={`relative flex size-7 items-center justify-center rounded-full ${tint}`}>
                <Icon className="size-3.5" />
              </span>
              <span className="relative">{name}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
