import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/config/app';
import { Avatar, Button } from '@/components/ui';
import { Logo } from '@/components/brand/Logo';
// Animated scenes shared with the profile covers, so system pages feel part of LearnNext
import { CoverScene } from '@/pages/profile/components/coverScenes';

export const delay = (ms) => ({ animationDelay: `${ms}ms` });

/* ------------------------------------------------------------ preview mode */
const PreviewContext = createContext(false);
/** True when a system page is opened from the UI Preview gallery (actions shouldn't sign out, etc.) */
export const usePreview = () => useContext(PreviewContext);

/**
 * Wraps a system page for the gallery: marks it as a preview, so its actions stay safe (no signing out, etc.). No
 * on-screen "Preview mode" pill (asked away) — the gallery opens each page in a new tab; close it to go back.
 */
export function PreviewFrame({ children }) {
  return <PreviewContext.Provider value>{children}</PreviewContext.Provider>;
}

/* ------------------------------------------------------------ calm backdrop */
// One soft glow colour per page
const GLOWS = {
  violet: 'rgb(139 92 246 / 0.28)',
  rose: 'rgb(244 114 182 / 0.24)',
  amber: 'rgb(251 191 36 / 0.2)',
  teal: 'rgb(45 212 191 / 0.2)',
  indigo: 'rgb(99 102 241 / 0.28)',
};
// Fixed star positions [left %, top %, size px] — still, no animation
const STILL_STARS = [
  [8, 14, 2], [17, 62, 1.5], [24, 28, 1], [31, 82, 1.5], [38, 10, 1], [46, 70, 1], [55, 18, 1.5], [63, 88, 1],
  [70, 34, 1], [77, 12, 2], [84, 58, 1.5], [91, 26, 1], [12, 44, 1], [58, 48, 1], [88, 80, 1.5], [4, 90, 1],
];

/** Plain deep-navy background with a single soft glow and a few still stars */
export function CalmBackdrop({ tone = 'violet' }) {
  return (
    <div className="absolute inset-0 bg-[#070a1c]" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at 50% 38%, ${GLOWS[tone]}, transparent 70%)` }} />
      <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_110%,rgb(42_105_178/0.18),transparent)]" />
      {STILL_STARS.map(([l, t, s]) => (
        <span key={`${l}-${t}`} className="absolute rounded-full bg-white/60" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ layout */
/**
 * Full-screen system page: background, logo + account in the top bar, centred illustration, title, text and actions.
 * Background: `scene` (an animated cover scene, e.g. the 404) or `tone` (calm glow — see CalmBackdrop).
 * <ErrorScreen tone="violet" title="…" description="…" illustration={…} actions={…} extra={…} />
 * `showAccount={false}` hides the avatar (e.g. session expired).
 */
export function ErrorScreen({ scene, sceneProps, tone = 'violet', docTitle, illustration, eyebrow, title, description, actions, extra, showAccount = true }) {
  const { user, isAuthenticated } = useAuth();
  const home = isAuthenticated ? '/dashboard' : '/login';

  useEffect(() => {
    document.title = `${docTitle ?? title} · ${APP_NAME}`;
  }, [docTitle, title]);

  return (
    // Exactly the screen's height — never scrolls (asked for); when space is short the illustration shrinks to fit
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-brand-navy text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {scene ? (
          <>
            <CoverScene id={scene} {...sceneProps} />
            <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_45%,rgb(4_3_12/0.05),rgb(4_3_12/0.72))]" />
          </>
        ) : (
          <CalmBackdrop tone={tone} />
        )}
      </div>

      <header className="flex shrink-0 animate-fade-in items-center justify-between px-5 py-5 short:py-3 sm:px-10">
        <Link to={home} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <Logo tone="inverse" />
        </Link>
        {showAccount &&
          (isAuthenticated ? (
            <Link
              to="/profile"
              // Phones: just the photo (the name is hidden), so an even ring round it; the right padding is for the name
              className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-md sm:pr-3.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <span className="hidden text-[13px] font-semibold sm:inline">{user?.name}</span>
            </Link>
          ) : (
            <Button as={Link} to="/login" size="sm" variant="ghost" leftIcon={LogIn} className={ghostOnDark}>
              Sign in
            </Button>
          ))}
      </header>

      <FitMain>
        <FitIllustration>{illustration}</FitIllustration>
        {eyebrow && (
          <p className="mt-10 animate-rise short:mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50" style={delay(80)}>
            {eyebrow}
          </p>
        )}
        <h1 id="es-title" className={cn('animate-rise text-[28px] font-bold tracking-[-0.02em] sm:text-[34px]', eyebrow ? 'mt-2' : 'mt-10 short:mt-5')} style={delay(100)}>
          {title}
        </h1>
        <p className="mt-3 max-w-md animate-rise text-[15px] leading-6 text-white/70" style={delay(160)}>
          {description}
        </p>
        {actions && (
          <div className="mt-8 flex animate-rise flex-wrap items-center justify-center gap-3 short:mt-5" style={delay(240)}>
            {actions}
          </div>
        )}
        {extra && (
          <div className="mt-8 w-full max-w-xl animate-rise short:mt-5" style={delay(320)}>
            {extra}
          </div>
        )}
      </FitMain>

      <footer className="shrink-0 animate-fade-in px-5 py-5 short:py-3 text-center text-xs text-white/40 sm:px-10">
        © {new Date().getFullYear()} {APP_NAME}
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ fit to the screen */
// The illustration's scale, shared by FitMain (which measures) and FitIllustration (which applies it)
const FitContext = createContext(1);
const MIN_SCALE = 0.12; // the picture can get very small on tiny screens (it's a decoration — the text always fits first)

/**
 * The page's middle area: measures whether everything fits between the top bar and the footer and, if not, works out
 * how small the illustration must get so the page never scrolls. Re-measures on resize and when the content changes
 * (e.g. the crash page's "Technical details" opening).
 */
function FitMain({ children }) {
  const mainRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const fitRef = useRef(() => {});
  // Re-check after every render too (content changed, e.g. details opened) — before paint, so nothing flashes
  useLayoutEffect(() => fitRef.current());
  useLayoutEffect(() => {
    const main = mainRef.current;
    const content = contentRef.current;
    if (!main || !content) return undefined;
    const fit = () => {
      const pic = content.querySelector('[data-fit-illustration]');
      const natural = pic?.firstElementChild?.offsetHeight ?? 0; // unscaled height (transforms don't change it)
      if (!natural) return setScale(1);
      const shown = pic.offsetHeight; // its current, scaled height
      const rest = content.offsetHeight - shown; // everything else in the middle area
      const room = main.clientHeight - 32 - rest; // 32 = a little breathing space top and bottom
      // Shrink to fit; if even the smallest size doesn't fit (tiny screen + details open), the picture steps aside
      const want = Math.min(1, room / natural);
      const next = want < MIN_SCALE ? 0 : want;
      setScale((s) => (Math.abs(s - next) < 0.01 ? s : next)); // ignore sub-pixel jitter (no render loop)
    };
    fitRef.current = fit;
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(main);
    // Watch the other blocks (not the picture itself, which this resizes)
    [...content.children].filter((c) => !c.hasAttribute('data-fit-illustration')).forEach((c) => ro.observe(c));
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);
  return (
    <FitContext.Provider value={scale}>
      <main ref={mainRef} className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center" aria-labelledby="es-title">
        <div ref={contentRef} className="flex w-full flex-col items-center">
          {children}
        </div>
      </main>
    </FitContext.Provider>
  );
}

/** The illustration, shrunk (from its top centre) when the screen is short; its box shrinks with it so nothing gaps */
function FitIllustration({ children }) {
  const scale = useContext(FitContext);
  const innerRef = useRef(null);
  const [h, setH] = useState(null);
  useLayoutEffect(() => {
    if (innerRef.current) setH(innerRef.current.offsetHeight);
  }, [children]);
  return (
    <div data-fit-illustration="" className="relative shrink-0 animate-rise" style={h ? { height: h * scale, visibility: scale ? undefined : 'hidden' } : undefined}>
      <div ref={innerRef} style={{ transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: 'top center' }}>
        {children}
      </div>
    </div>
  );
}

/** Secondary button style on the dark scenes */
export const ghostOnDark = 'border border-white/20 text-white hover:bg-white/10 hover:text-white';
/** The main button on these dark pages: solid white with navy text (picked from previews — the brand blue looked off on the scenes) */
export const primaryOnDark = 'bg-white text-[#0f1a3d] shadow-none hover:bg-white/90 hover:text-[#0f1a3d] active:bg-white/80 focus-visible:ring-white/60';

/* ------------------------------------------------------------ illustration pieces */

// Solid numerals with a short stacked shadow for a subtle 3D look
const EXTRUDE = {
  color: '#f5f3ff',
  textShadow: '0 1px 0 #d4cdf8, 0 2px 0 #b8aeee, 0 3px 0 #9c90df, 0 4px 0 #8175cc, 0 5px 0 #6a5eb6, 0 20px 36px rgb(0 0 0 / 0.5)',
};

/** Big numeral row: <Numerals>{'4'}<Planet />{'4'}</Numerals> — strings get the 3D style */
export function Numerals({ label, children }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <p className="flex items-center gap-2 text-[100px] font-black leading-none tracking-[-0.05em] sm:gap-5 sm:text-[168px]" aria-label={label}>
      {items.map((c, i) =>
        typeof c === 'string' ? (
          <span key={i} style={EXTRUDE} aria-hidden="true">
            {c}
          </span>
        ) : (
          <span key={i} aria-hidden="true" className="contents">
            {c}
          </span>
        ),
      )}
    </p>
  );
}

const PLANET_TONES = {
  sunset: { body: 'bg-[radial-gradient(circle_at_32%_30%,#fff1d0_0%,#ff9a62_38%,#b0306e_78%,#4a1240_100%)]', glow: 'shadow-[0_0_80px_14px_rgb(255_120_150/0.3),inset_-0.08em_-0.06em_0.16em_rgb(0_0_0/0.35)]', ring: 'border-[#ffd9a8]' },
  ice: { body: 'bg-[radial-gradient(circle_at_32%_30%,#f2fbff_0%,#8fd3ff_40%,#3a6fd8_78%,#1a2a6c_100%)]', glow: 'shadow-[0_0_70px_12px_rgb(120_190_255/0.3),inset_-0.08em_-0.06em_0.16em_rgb(0_0_0/0.35)]', ring: 'border-[#cfe9ff]' },
};

/** The "0": a glowing planet, optionally with a ring and/or an orbiting moon */
export function Planet({ tone = 'sunset', ring = true, moon = true, className }) {
  const t = PLANET_TONES[tone];
  return (
    <span className={cn('relative inline-block size-[0.8em] motion-safe:animate-float', className)} aria-hidden="true">
      {ring && <span className={cn('absolute left-1/2 top-1/2 h-[30%] w-[170%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[0.035em] opacity-50', t.ring)} />}
      <span className={cn('absolute inset-0 rounded-full', t.body, t.glow)} />
      {!ring && (
        // Craters instead of a ring
        <>
          <span className="absolute left-[26%] top-[30%] size-[16%] rounded-full bg-black/15 shadow-[inset_0.01em_0.01em_0.02em_rgb(0_0_0/0.25)]" />
          <span className="absolute left-[56%] top-[56%] size-[11%] rounded-full bg-black/15" />
          <span className="absolute left-[60%] top-[24%] size-[8%] rounded-full bg-black/10" />
        </>
      )}
      {ring && <span className={cn('absolute left-1/2 top-1/2 h-[30%] w-[170%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[0.035em] opacity-85 [clip-path:inset(50%_0_0_0)]', t.ring)} />}
      {moon && (
        <span className="absolute inset-[-28%] motion-safe:animate-spin motion-safe:[animation-duration:9s]">
          <span className="absolute left-1/2 top-0 size-[0.12em] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#9cc4ff_60%,#3b5aa8)] shadow-[0_0_12px_rgb(156_196_255/0.8)]" />
        </span>
      )}
    </span>
  );
}
