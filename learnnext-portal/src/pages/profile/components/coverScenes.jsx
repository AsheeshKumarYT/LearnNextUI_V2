/**
 * Animated profile cover scenes. Each scene fills its (relative, overflow-hidden) parent and is purely decorative.
 * Raw colours are intentional — these are illustrations, the same in light and dark themes.
 * Every looping animation uses `motion-safe:` so it stops for people who prefer reduced motion.
 */
import { cn } from '@/utils/cn';
import { STATIC_COVERS } from './staticCovers';

/* ---------------------------------------------------------------- shared helpers */

/** Small deterministic PRNG so star fields look random but never change between renders */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const makeStars = (n, seed, maxY = 100) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: r() * 100, y: r() * maxY, s: 1 + r() * 1.8, delay: r() * 4000, dur: 2.4 + r() * 3.2 }));
};

function Stars({ stars, className }) {
  return stars.map((st, i) => (
    <span
      key={i}
      className={cn('absolute rounded-full bg-white motion-safe:animate-twinkle', className)}
      style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, animationDelay: `${st.delay}ms`, animationDuration: `${st.dur}s` }}
      aria-hidden="true"
    />
  ));
}

const SPARKLE_PATH = 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z';
function Sparkles({ items }) {
  return items.map(([left, top, size, ms]) => (
    <svg
      key={`${left}-${top}`}
      viewBox="0 0 24 24"
      className="pointer-events-none absolute text-white motion-safe:animate-twinkle"
      style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${ms}ms` }}
      aria-hidden="true"
    >
      <path d={SPARKLE_PATH} fill="currentColor" />
    </svg>
  ));
}

// One wave period is 1200 wide; the path holds two so translating the 200%-wide svg by -50% loops seamlessly
const WAVE = 'M0 60 C 300 18 300 102 600 60 S 900 18 1200 60 S 1500 102 1800 60 S 2100 18 2400 60 V120 H0 Z';
const WAVE_TALL = 'M0 70 C 200 20 400 20 600 70 S 1000 120 1200 70 S 1600 20 1800 70 S 2200 120 2400 70 V120 H0 Z';
function Wave({ d = WAVE, fill, className, anim = 'motion-safe:animate-wave', style }) {
  return (
    <svg className={cn('absolute -bottom-px left-0 w-[200%]', anim, className)} viewBox="0 0 2400 120" preserveAspectRatio="none" style={style} aria-hidden="true">
      <path d={d} style={{ fill }} />
    </svg>
  );
}

/* ---------------------------------------------------------------- 1. Lantern festival */
const DUSK_SKY_STARS = makeStars(36, 61, 48);
// Sky lanterns: start on/above the lake and rise; negative delays so the sky is already full on first paint
const LANTERNS = (() => {
  const r = rng(2024);
  return Array.from({ length: 20 }, () => ({ x: 4 + r() * 92, y: 54 + r() * 24, s: 0.95 + r() * 0.75, dur: 14 + r() * 12, delay: -r() * 26, flick: 1.4 + r() * 1.4 }));
})();
// Lanterns floating on the water: [left %, bottom %, scale, delay s]
const FLOATING = [[18, 9, 0.8, 0], [31, 5, 1, 1.2], [47, 11, 0.7, 2.1], [63, 6, 0.9, 0.6], [79, 10, 0.75, 1.7], [88, 4, 1, 2.6]];
const HILLS_BACK = 'M0 100 L0 48 C 90 30 170 44 260 36 C 360 26 430 52 540 40 C 640 30 720 18 820 34 C 920 50 1000 30 1090 38 C 1140 42 1180 36 1200 34 L1200 100 Z';
const HILLS_FRONT = 'M0 100 L0 66 C 120 52 220 72 340 60 C 460 48 560 70 680 62 C 800 54 900 74 1020 64 C 1100 58 1160 66 1200 62 L1200 100 Z';

/** A paper lantern: warm body with an inner flame glow and soft halo */
function Lantern({ scale = 1, flicker = 1.8, className, style }) {
  return (
    <span className={cn('absolute block', className)} style={style} aria-hidden="true">
      <span
        className="block h-[18px] w-[13px] rounded-[45%_45%_32%_32%] bg-[linear-gradient(180deg,#ffe7a3_0%,#ffb44d_45%,#ff7a2f_100%)] shadow-[0_0_10px_3px_rgb(255_170_70/0.75),0_0_28px_10px_rgb(255_120_50/0.3)] motion-safe:animate-flicker"
        style={{ transform: `scale(${scale})`, animationDuration: `${flicker}s` }}
      >
        <span className="mx-auto mt-[11px] block h-[4px] w-[5px] rounded-full bg-[#fff6d6] blur-[1px]" />
      </span>
    </span>
  );
}

function LanternScene() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#0e0c2e_0%,#2c1755_24%,#6e2c68_44%,#c9566a_60%,#f39a5e_72%)]">
      <Stars stars={DUSK_SKY_STARS} />
      {/* Last light of the sun just below the hills */}
      <div className="absolute left-[22%] top-[30%] h-[46%] w-[56%]" aria-hidden="true">
        <div className="size-full rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_214_140/0.85),rgb(255_150_90/0.35)_55%,transparent)] blur-md motion-safe:animate-sun" />
      </div>

      {/* Distant hills — slim so the warm sky stays visible */}
      <svg className="absolute inset-x-0 bottom-[28%] h-[20%] w-full" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={HILLS_BACK} fill="rgb(96 40 96 / 0.8)" />
        <path d={HILLS_FRONT} fill="#2a1240" />
      </svg>

      {/* Lake with the sky's warm reflection and shimmering ripples */}
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,#5a2a5c_0%,#2c1645_45%,#170d2b_100%)]" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(34%_100%_at_50%_0%,rgb(255_180_110/0.6),transparent)]" />
        {[[22, 30, 18], [48, 22, 26], [70, 46, 16], [36, 64, 22], [60, 74, 14], [84, 34, 12]].map(([left, top, w], i) => (
          <span
            key={i}
            className="absolute h-px rounded-full bg-[#ffd3a0] motion-safe:animate-shimmer-x"
            style={{ left: `${left}%`, top: `${top}%`, width: `${w}%`, animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>

      {/* Rising sky lanterns (bigger = closer) */}
      {LANTERNS.map((l, i) => (
        <span
          key={i}
          className="absolute opacity-0 motion-safe:animate-lantern motion-reduce:opacity-80"
          style={{ left: `${l.x}%`, top: `${l.y}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}
          aria-hidden="true"
        >
          <Lantern scale={l.s} flicker={l.flick} className="relative" />
        </span>
      ))}

      {/* Lanterns floating on the lake */}
      {FLOATING.map(([left, bottom, s, d]) => (
        <span key={left} className="absolute motion-safe:animate-bob" style={{ left: `${left}%`, bottom: `${bottom}%`, animationDelay: `${d}s` }} aria-hidden="true">
          <Lantern scale={s * 0.9} className="relative" />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Galaxy */
const GALAXY_STARS = makeStars(80, 42);
const SHOOTING = [
  { top: '-4%', right: '8%', delay: 0 },
  { top: '6%', right: '38%', delay: 2.4 },
  { top: '-8%', right: '62%', delay: 4.8 },
];

/** `planet={false}` hides the ringed planet (e.g. the 404 page draws its own) */
function GalaxyScene({ planet = true }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,#1f1150_0%,#0c0824_55%,#04030c_100%)]">
      {/* Nebula clouds (slow colour shift) */}
      <div className="absolute inset-0 motion-safe:animate-hue" aria-hidden="true">
        <div className="absolute -top-1/2 left-[18%] h-[170%] w-[48%] rounded-full bg-[radial-gradient(closest-side,rgb(255_79_163/0.5),transparent)] blur-2xl motion-safe:animate-drift-a" />
        <div className="absolute -bottom-1/2 right-[8%] h-[160%] w-[44%] rounded-full bg-[radial-gradient(closest-side,rgb(124_77_255/0.55),transparent)] blur-2xl motion-safe:animate-drift-c" />
        <div className="absolute -top-1/4 right-[30%] h-[120%] w-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(0_200_255/0.35),transparent)] blur-2xl motion-safe:animate-drift-b" />
      </div>
      <Stars stars={GALAXY_STARS} />

      {/* Shooting stars — head (bright end) leads down-left */}
      {SHOOTING.map((s, i) => (
        <span
          key={i}
          className="absolute h-[1.5px] w-32 rounded-full bg-gradient-to-r from-white via-white/60 to-transparent opacity-0 shadow-[0_0_8px_rgb(255_255_255/0.8)] motion-safe:animate-shoot"
          style={{ top: s.top, right: s.right, animationDelay: `${s.delay}s` }}
          aria-hidden="true"
        />
      ))}

      {/* Ringed planet: back half of the ring, planet, then the front half */}
      {planet && (
        <div className="absolute right-[28%] top-[22%] size-14 motion-safe:animate-float sm:size-16" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-5 w-[230%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-2 border-[#ffd9a8]/60" />
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,#fff1d0_0%,#ff9a62_40%,#b0306e_80%,#4a1240_100%)] shadow-[0_0_36px_6px_rgb(255_120_120/0.35)]" />
          <span className="absolute left-1/2 top-1/2 h-5 w-[230%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-2 border-[#ffd9a8]/80 [clip-path:inset(50%_0_0_0)]" />
        </div>
      )}
      <span className="absolute left-[44%] top-[62%] size-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#e6f4ff,#5b98e0_60%,#1c2c66)] shadow-[0_0_14px_rgb(91_152_224/0.7)] motion-safe:animate-float [animation-delay:2s]" aria-hidden="true" />
      <Sparkles items={[[24, 30, 10, 0], [55, 12, 8, 1600], [70, 70, 9, 900], [90, 30, 7, 2600]]} />
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Ocean */
const RAYS = [
  { left: '12%', rot: -16, delay: 0 },
  { left: '28%', rot: -8, delay: -2 },
  { left: '46%', rot: 2, delay: -4 },
  { left: '63%', rot: 10, delay: -1 },
  { left: '80%', rot: 18, delay: -3 },
];
const BUBBLES = (() => {
  const r = rng(99);
  return Array.from({ length: 16 }, () => ({ left: r() * 100, size: 4 + r() * 9, dur: 6 + r() * 6, delay: r() * -10 }));
})();
const PLANKTON = makeStars(26, 11);

function OceanScene() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#02182b_0%,#04375a_45%,#077089_100%)]">
      <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(140_240_255/0.28),transparent)]" aria-hidden="true" />
      {/* God rays from the surface */}
      {RAYS.map((r, i) => (
        <div
          key={i}
          className="absolute -top-1/4 h-[160%] w-[8%] origin-top bg-gradient-to-b from-white/35 via-white/10 to-transparent blur-[6px] mix-blend-screen motion-safe:animate-rays"
          style={{ left: r.left, '--ln-ray': `${r.rot}deg`, transform: `rotate(${r.rot}deg)`, animationDelay: `${r.delay}s` }}
          aria-hidden="true"
        />
      ))}
      <Stars stars={PLANKTON} className="bg-cyan-100/70" />
      {/* Rising bubbles */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute -bottom-3 rounded-full border border-white/60 bg-white/10 opacity-0 shadow-[inset_-1px_-1px_2px_rgb(255_255_255/0.5)] motion-safe:animate-bubble"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
          aria-hidden="true"
        />
      ))}
      {/* Three wave layers at different speeds for depth */}
      <Wave d={WAVE_TALL} fill="rgb(120 230 240 / 0.12)" className="h-20" anim="motion-safe:animate-wave-slow" />
      <Wave fill="rgb(10 150 170 / 0.35)" className="h-14" />
      <Wave d={WAVE_TALL} fill="rgb(3 40 66 / 0.6)" className="h-9" anim="motion-safe:animate-wave [animation-duration:18s]" />
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Synthwave sunset */
const DUSK_STARS = makeStars(30, 5, 45);
const SUN_STRIPES =
  'linear-gradient(180deg,#000 52%,transparent 52% 56%,#000 56% 64%,transparent 64% 69%,#000 69% 76%,transparent 76% 82%,#000 82% 88%,transparent 88% 95%,#000 95%)';

function SunsetScene() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#160936_0%,#3a0f62_32%,#8a1f7c_58%,#e5456f_80%,#ff9a5a_100%)]">
      <Stars stars={DUSK_STARS} />
      {/* Striped retro sun with a breathing glow */}
      {/* Sized from the cover height so it never clips; outer centres it, inner breathes */}
      <div className="absolute bottom-[24%] left-[58%] aspect-square h-[62%] -translate-x-1/2" aria-hidden="true">
        <div className="size-full motion-safe:animate-sun">
          <div
            className="size-full rounded-full bg-[linear-gradient(180deg,#fff3ad_0%,#ffbe5c_42%,#ff5f8f_100%)]"
            style={{ maskImage: SUN_STRIPES, WebkitMaskImage: SUN_STRIPES }}
          />
        </div>
      </div>
      {/* Mountain ranges */}
      <svg className="absolute bottom-[24%] left-0 h-[34%] w-full" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 100 L0 62 L90 30 L170 66 L260 18 L360 70 L450 40 L540 78 L640 26 L740 68 L830 36 L930 72 L1030 22 L1120 60 L1200 40 L1200 100 Z" fill="rgb(92 26 120 / 0.75)" />
        <path d="M0 100 L0 80 L120 52 L220 86 L330 58 L430 90 L560 60 L680 92 L800 64 L910 88 L1020 56 L1130 84 L1200 70 L1200 100 Z" fill="#2a0b47" />
      </svg>
      {/* Horizon glow */}
      <div className="absolute inset-x-0 bottom-[24%] h-px bg-[#ffb3d9] shadow-[0_0_14px_3px_rgb(255_120_200/0.8)]" aria-hidden="true" />
      {/* Neon grid floor rushing toward you */}
      <div className="absolute inset-x-0 bottom-0 h-[24%] overflow-hidden bg-[#1a0631] [perspective:140px]" aria-hidden="true">
        <div
          className="absolute -inset-x-1/2 top-0 h-[400%] origin-top [transform:rotateX(62deg)] motion-safe:animate-grid-flow"
          style={{
            backgroundImage: 'linear-gradient(rgb(255 92 190 / 0.85) 1.5px, transparent 1.5px), linear-gradient(90deg, rgb(255 92 190 / 0.85) 1.5px, transparent 1.5px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#1a0631] to-transparent" />
      </div>
      <Sparkles items={[[20, 16, 8, 0], [40, 34, 6, 1500], [82, 14, 9, 800]]} />
    </div>
  );
}

/* ---------------------------------------------------------------- 5. Midnight city */
const CITY_STARS = makeStars(34, 909, 42);

/** Row of buildings in a 1200×100 viewBox with their lit windows; some windows switch off and on */
function skyline(seed, { minH, maxH, minW, maxW, litChance, animChance }) {
  const r = rng(seed);
  const buildings = [];
  const windows = [];
  for (let x = -8; x < 1210; ) {
    const w = minW + r() * (maxW - minW);
    const h = minH + r() * (maxH - minH);
    buildings.push({ x, w, h });
    for (let wx = x + 4; wx < x + w - 5; wx += 7) {
      for (let wy = 100 - h + 6; wy < 96; wy += 7.5) {
        if (r() < litChance) windows.push({ x: wx, y: wy, anim: r() < animChance, delay: -r() * 9, dur: 7 + r() * 9, warm: r() < 0.8 });
      }
    }
    x += w + r() * 3;
  }
  return { buildings, windows };
}
const CITY_FAR = skyline(31, { minH: 30, maxH: 70, minW: 26, maxW: 54, litChance: 0.18, animChance: 0 });
const CITY_NEAR = skyline(77, { minH: 22, maxH: 82, minW: 34, maxW: 72, litChance: 0.4, animChance: 0.2 });
const TALLEST = CITY_NEAR.buildings.reduce((a, b) => (b.h > a.h && b.x > 300 && b.x < 900 ? b : a), CITY_NEAR.buildings[0]);

function Skyline({ data, fill, windowClass, children, className }) {
  return (
    <div className={cn('absolute inset-x-0 bottom-0', className)} aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
        {data.buildings.map((b, i) => (
          <rect key={i} x={b.x} y={100 - b.h} width={b.w} height={b.h} fill={fill} />
        ))}
        {data.windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="3"
            height="3.6"
            fill={w.warm ? '#ffd88a' : '#bfe3ff'}
            className={cn(windowClass, w.anim && 'motion-safe:animate-window')}
            style={w.anim ? { animationDelay: `${w.delay}s`, animationDuration: `${w.dur}s` } : undefined}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}

function CityScene() {
  // Antenna light position on the tallest tower, as % of the near-skyline box
  const antennaLeft = ((TALLEST.x + TALLEST.w / 2) / 1200) * 100;
  const antennaTop = 100 - TALLEST.h - 9;

  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#060a22_0%,#161447_42%,#3a1f63_72%,#61307a_100%)]">
      <Stars stars={CITY_STARS} />
      {/* Moon with drifting clouds */}
      <div className="absolute right-[30%] top-[12%] size-11 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fffdf0,#ece4c6_60%,#cfc4a0)] shadow-[0_0_36px_10px_rgb(255_240_200/0.22)] sm:size-12" aria-hidden="true" />
      <div className="absolute right-[24%] top-[20%] h-5 w-44 rounded-full bg-white/10 blur-md motion-safe:animate-drift-b" aria-hidden="true" />
      <div className="absolute right-[38%] top-[8%] h-4 w-32 rounded-full bg-white/[0.07] blur-md motion-safe:animate-drift-c" aria-hidden="true" />

      {/* Plane crossing with blinking navigation lights */}
      <div className="absolute top-[16%] flex items-center gap-1.5 motion-safe:animate-fly motion-reduce:hidden" aria-hidden="true">
        <span className="h-px w-10 bg-gradient-to-l from-white/40 to-transparent" />
        <span className="size-1 rounded-full bg-[#ff4d6d] shadow-[0_0_6px_2px_rgb(255_77_109/0.8)] motion-safe:animate-blink" />
        <span className="size-1 rounded-full bg-white shadow-[0_0_6px_2px_rgb(255_255_255/0.8)] motion-safe:animate-blink [animation-delay:0.8s]" />
      </div>

      {/* City glow on the horizon */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(255_120_190/0.35),transparent)]" aria-hidden="true" />

      <Skyline data={CITY_FAR} fill="#2a2058" windowClass="opacity-50" className="h-[62%]" />
      <Skyline data={CITY_NEAR} fill="#0c0a25" className="h-[48%]">
        <span className="absolute h-[9%] w-px bg-[#0c0a25]" style={{ left: `${antennaLeft}%`, top: `${antennaTop + 1}%` }} />
        <span
          className="absolute size-1.5 -translate-x-1/2 rounded-full bg-[#ff4d6d] shadow-[0_0_8px_3px_rgb(255_77_109/0.75)] motion-safe:animate-blink"
          style={{ left: `${antennaLeft}%`, top: `${antennaTop}%` }}
        />
      </Skyline>
      {/* Street-level haze */}
      <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-[rgb(255_150_200/0.18)] to-transparent" aria-hidden="true" />
    </div>
  );
}

/* ---------------------------------------------------------------- 6. Firefly night */
const FOREST_STARS = makeStars(40, 23, 55);
const FIREFLIES = (() => {
  const r = rng(314);
  return Array.from({ length: 22 }, () => ({ x: 4 + r() * 92, y: 30 + r() * 62, s: 3 + r() * 3, dur: 8 + r() * 7, delay: r() * -12, glow: 1.8 + r() * 2 }));
})();
// Pine-tree ridge silhouettes (viewBox 1200×100)
const ridge = (seed, base, peak) => {
  const r = rng(seed);
  let d = `M0 100 L0 ${base}`;
  for (let x = 0; x <= 1200; x += 24 + r() * 26) {
    const h = base - peak * (0.4 + r() * 0.6);
    d += ` L${x.toFixed(0)} ${base} L${(x + 10).toFixed(0)} ${h.toFixed(0)} L${(x + 20).toFixed(0)} ${base}`;
  }
  return `${d} L1200 ${base} L1200 100 Z`;
};
const RIDGE_BACK = ridge(8, 62, 40);
const RIDGE_FRONT = ridge(15, 84, 46);

function FireflyScene() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#06121f_0%,#0b2a35_55%,#11423f_100%)]">
      <Stars stars={FOREST_STARS} />
      {/* Moon with halo */}
      <div className="absolute right-[30%] top-[14%] size-12 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fffbe6,#f3e7b5_60%,#cbbd84)] shadow-[0_0_40px_12px_rgb(255_244_200/0.25),0_0_120px_40px_rgb(180_255_220/0.12)] motion-safe:animate-float sm:size-14" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(120_255_190/0.18),transparent)]" aria-hidden="true" />
      {/* Misty forest layers */}
      <svg className="absolute inset-x-0 bottom-0 h-[70%] w-full" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={RIDGE_BACK} fill="rgb(16 66 66 / 0.85)" />
      </svg>
      <div className="absolute inset-x-0 bottom-[18%] h-10 bg-gradient-to-t from-transparent via-[rgb(160_240_220/0.12)] to-transparent blur-md motion-safe:animate-drift-b" aria-hidden="true" />
      <svg className="absolute inset-x-0 bottom-0 h-[55%] w-full" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={RIDGE_FRONT} fill="#04161a" />
      </svg>
      {/* Fireflies: wander on a loop (outer) while their glow pulses (inner) */}
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="absolute motion-safe:animate-firefly"
          style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
          aria-hidden="true"
        >
          <span
            className="block rounded-full bg-[#fff6a8] shadow-[0_0_10px_3px_rgb(255_230_110/0.85),0_0_22px_8px_rgb(190_255_120/0.35)] motion-safe:animate-glow"
            style={{ width: f.s, height: f.s, animationDuration: `${f.glow}s`, animationDelay: `${f.delay / 3}s` }}
          />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- registry */
export const COVERS = [
  { id: 'fireflies', label: 'Firefly night', description: 'Moonlit forest with glowing fireflies', Scene: FireflyScene },
  { id: 'lanterns', label: 'Lantern festival', description: 'Sky lanterns rising over a dusk lake', Scene: LanternScene },
  { id: 'galaxy', label: 'Galaxy', description: 'Nebula, shooting stars & a ringed planet', Scene: GalaxyScene },
  { id: 'ocean', label: 'Deep ocean', description: 'Light rays, rising bubbles & rolling waves', Scene: OceanScene },
  { id: 'sunset', label: 'Synthwave', description: 'Retro sun, mountains & a neon grid', Scene: SunsetScene },
  { id: 'city', label: 'Midnight city', description: 'Skyline windows, a blinking tower & a passing plane', Scene: CityScene },
].map((c) => ({ ...c, kind: 'animated' }));
export const DEFAULT_COVER = 'fireflies';

/** Every cover, animated first then the still ones (staticCovers.jsx) */
export const ALL_COVERS = [...COVERS, ...STATIC_COVERS];
export const coverById = (id) => ALL_COVERS.find((c) => c.id === id) ?? ALL_COVERS.find((c) => c.id === DEFAULT_COVER);

/** Extra props go to the scene (e.g. <CoverScene id="galaxy" planet={false} />) */
export function CoverScene({ id, ...sceneProps }) {
  const { Scene } = coverById(id);
  return <Scene {...sceneProps} />;
}
