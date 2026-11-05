/**
 * Small, single-purpose illustrations for the system pages. Decorative only (aria-hidden);
 * every loop uses motion-safe so it stops for reduced-motion users. Raw colours are illustration art.
 */
import { cn } from '@/utils/cn';

/** Astronaut drifting in zero-g (404) */
export function Astronaut() {
  return (
    <div className="motion-safe:animate-astronaut" aria-hidden="true">
      <svg viewBox="40 0 100 160" className="w-full drop-shadow-[0_14px_24px_rgb(0_0_0/0.45)]">
        <defs>
          <linearGradient id="il-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a2f86" />
            <stop offset="0.55" stopColor="#16124a" />
            <stop offset="1" stopColor="#7b4dd6" />
          </linearGradient>
          <linearGradient id="il-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d4d9ea" />
          </linearGradient>
        </defs>
        <rect x="52" y="62" width="62" height="58" rx="16" fill="#b9c1da" />
        <rect x="62" y="112" width="18" height="36" rx="9" fill="url(#il-suit)" transform="rotate(8 71 112)" />
        <rect x="88" y="112" width="18" height="36" rx="9" fill="url(#il-suit)" transform="rotate(-10 97 112)" />
        <rect x="58" y="70" width="54" height="56" rx="20" fill="url(#il-suit)" />
        <rect x="104" y="58" width="16" height="40" rx="8" fill="url(#il-suit)" transform="rotate(-40 112 78)" />
        <rect x="42" y="78" width="16" height="38" rx="8" fill="url(#il-suit)" transform="rotate(28 50 96)" />
        <rect x="72" y="90" width="26" height="14" rx="4" fill="#e3e7f3" />
        <circle cx="85" cy="50" r="32" fill="url(#il-suit)" stroke="#c3c9de" strokeWidth="2" />
        <rect x="58" y="34" width="54" height="36" rx="18" fill="url(#il-visor)" />
        <path d="M66 42 C 72 36, 84 35, 92 37" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** A glass browser window with a crack through it, gently floating (page crash) */
export function CrashedWindow() {
  return (
    <div className="relative w-[17rem] motion-safe:animate-float sm:w-[22rem]" aria-hidden="true">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_92_190/0.3),transparent)] blur-xl" />
      <div className="-rotate-3 overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-white/15 bg-white/[0.08] px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f7e]" />
          <span className="size-2.5 rounded-full bg-[#ffc25c]" />
          <span className="size-2.5 rounded-full bg-[#5ce0a0]" />
          <span className="ml-3 h-2 w-24 rounded-full bg-white/20" />
        </div>
        <div className="relative h-36 p-4 sm:h-44">
          {/* Page skeleton */}
          <div className="h-3 w-2/3 rounded-full bg-white/25" />
          <div className="mt-3 h-2 w-5/6 rounded-full bg-white/15" />
          <div className="mt-2 h-2 w-3/4 rounded-full bg-white/15" />
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="h-12 rounded-lg bg-white/15 sm:h-16" />
            <div className="h-12 translate-y-2 rotate-6 rounded-lg bg-white/10 sm:h-16" />
            <div className="h-12 -rotate-3 rounded-lg bg-white/15 sm:h-16" />
          </div>
          {/* Crack */}
          <svg viewBox="0 0 220 120" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <path d="M120 0 L108 34 L132 52 L100 78 L118 96 L96 120" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" opacity="0.9" />
            <path d="M108 34 L78 40 M132 52 L164 46 M100 78 L70 90 M118 96 L150 108" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.55" />
          </svg>
        </div>
      </div>
      {/* Falling shards */}
      <span className="absolute -bottom-3 left-[42%] size-3 rotate-45 rounded-[2px] bg-white/30" />
      <span className="absolute -bottom-6 left-[55%] size-2 rotate-12 rounded-[2px] bg-white/20" />
    </div>
  );
}

/** Slowly turning gear used as the "0" in 503 */
export function Gear({ className }) {
  return (
    <span className={cn('relative inline-block size-[0.8em]', className)} aria-hidden="true">
      <span className="absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgb(255_190_90/0.35),transparent)] blur-md" />
      <svg viewBox="0 0 100 100" className="relative size-full motion-safe:animate-spin motion-safe:[animation-duration:20s]">
        <defs>
          <linearGradient id="il-gear" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe5a8" />
            <stop offset="0.5" stopColor="#ffb44d" />
            <stop offset="1" stopColor="#d9682b" />
          </linearGradient>
        </defs>
        <g fill="url(#il-gear)">
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x="44" y="2" width="12" height="18" rx="3" transform={`rotate(${i * 36} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="36" />
        </g>
        <circle cx="50" cy="50" r="14" fill="#1a1440" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fff3d6" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

/** Wi-Fi symbol: bars pulse outward then a slash appears (offline). `online` turns it green with no slash. */
export function WifiSignal({ online }) {
  // 90° arcs centred on the dot (60, 88)
  const k = Math.SQRT1_2;
  const arc = (r) => `M ${60 - r * k} ${88 - r * k} A ${r} ${r} 0 0 1 ${60 + r * k} ${88 - r * k}`;
  return (
    <div className="relative size-40 sm:size-48" aria-hidden="true">
      <div className={cn('absolute inset-0 rounded-full blur-2xl transition-colors duration-700', online ? 'bg-[#5ce0a0]/25' : 'bg-[#7ab8ff]/20')} />
      <svg viewBox="0 0 120 120" className="relative size-full">
        {[52, 35, 18].map((r, i) => (
          <path
            key={r}
            d={arc(r)}
            fill="none"
            stroke={online ? '#5ce0a0' : '#cfe3ff'}
            strokeWidth="9"
            strokeLinecap="round"
            className={cn('transition-[stroke] duration-700', !online && 'motion-safe:animate-signal')}
            style={{ animationDelay: `${(2 - i) * 0.3}s` }}
          />
        ))}
        <circle cx="60" cy="88" r="7" fill={online ? '#5ce0a0' : '#ffffff'} className="transition-[fill] duration-700" />
        {!online && <path d="M24 24 L96 104" stroke="#ff6b8a" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgb(255_107_138/0.7)]" />}
      </svg>
    </div>
  );
}

/** Crescent moon fast asleep, with floating "z"s (session expired) */
export function SleepyMoon() {
  return (
    <div className="relative size-40 sm:size-48" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_220_150/0.35),transparent)] blur-xl" />
      <svg viewBox="0 0 120 120" className="relative size-full drop-shadow-[0_0_24px_rgb(255_220_150/0.45)]">
        <defs>
          <linearGradient id="il-moon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff7d6" />
            <stop offset="1" stopColor="#ffc96b" />
          </linearGradient>
        </defs>
        {/* Crescent = big circle minus offset circle */}
        <path d="M70 14 A 46 46 0 1 0 106 78 A 36 36 0 1 1 70 14 Z" fill="url(#il-moon)" />
        {/* Closed eye + smile */}
        <path d="M40 66 Q 46 71 52 66" fill="none" stroke="#a5673a" strokeWidth="3" strokeLinecap="round" />
        <path d="M44 84 Q 50 88 56 84" fill="none" stroke="#a5673a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="76" r="4" fill="#ff9f8a" opacity="0.45" />
      </svg>
      {/* z z z */}
      {[0, 1.2, 2.4].map((d, i) => (
        <span
          key={d}
          className="absolute font-black text-white/80 opacity-0 motion-safe:animate-zzz"
          style={{ right: `${6 + i * 6}%`, top: `${26 - i * 6}%`, fontSize: 14 + i * 5, animationDelay: `${d}s` }}
        >
          z
        </span>
      ))}
    </div>
  );
}
