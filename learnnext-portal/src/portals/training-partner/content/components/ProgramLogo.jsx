import { cn } from '@/utils/cn';

const SIZES = {
  md: 'size-11 rounded-xl text-[11px]',
  lg: 'size-14 rounded-2xl text-sm',
  // The drawer: big enough to read a logo's wordmark
  xl: 'size-24 rounded-2xl text-lg',
};

// Per category: a faint wash over the white tile and its outline (static class names for Tailwind).
// Amber reads stronger than the other hues, so its wash is lower.
const TONES = {
  Leadership: { wash: 'from-chart-1/[0.13]', ring: 'ring-chart-1/25' },
  Communication: { wash: 'from-chart-2/[0.14]', ring: 'ring-chart-2/30' },
  Coaching: { wash: 'from-chart-4/[0.12]', ring: 'ring-chart-4/25' },
  Sales: { wash: 'from-chart-3/[0.10]', ring: 'ring-chart-3/30' },
  'Customer service': { wash: 'from-success-main/[0.12]', ring: 'ring-success-main/25' },
  'Personal effectiveness': { wash: 'from-chart-5/[0.12]', ring: 'ring-chart-5/25' },
};
const FALLBACK = { wash: 'from-text-muted/[0.08]', ring: 'ring-border-strong' };

// The showcase card, per category: the top panel's soft diagonal wash, the glow behind the logo and the tag's dot
// (amber lower — it reads stronger)
const PANEL = {
  // Dimmed ~30% on request (2026-10-26): washes were .11–.15 / .04–.05, glows /25–/30
  Leadership: { panel: 'from-chart-1/[0.09] via-chart-1/[0.035]', glow: 'bg-chart-1/[0.18]', dot: 'bg-chart-1' },
  Communication: { panel: 'from-chart-2/[0.10] via-chart-2/[0.035]', glow: 'bg-chart-2/[0.2]', dot: 'bg-chart-2' },
  Coaching: { panel: 'from-chart-4/[0.085] via-chart-4/[0.03]', glow: 'bg-chart-4/[0.18]', dot: 'bg-chart-4' },
  Sales: { panel: 'from-chart-3/[0.075] via-chart-3/[0.03]', glow: 'bg-chart-3/[0.17]', dot: 'bg-chart-3' },
  'Customer service': { panel: 'from-success-main/[0.085] via-success-main/[0.03]', glow: 'bg-success-main/[0.18]', dot: 'bg-success-main' },
  'Personal effectiveness': { panel: 'from-chart-5/[0.085] via-chart-5/[0.03]', glow: 'bg-chart-5/[0.18]', dot: 'bg-chart-5' },
};
const PANEL_FALLBACK = { panel: 'from-text-muted/[0.06] via-text-muted/[0.02]', glow: 'bg-text-muted/[0.14]', dot: 'bg-text-muted' };
export const categoryTone = (category) => PANEL[category] ?? PANEL_FALLBACK;

// Short words and marks don't make good initials ("Crucial Conversations® for …" → "CC")
const SKIP = /^(for|and|of|the|a|an|to|in|–|-|&)$/i;
export function programInitials(name = '') {
  const words = name.replace(/[®™]/g, '').split(/\s+/).filter((w) => w && !SKIP.test(w));
  return words
    .map((w) => (/^[IVX]+$/.test(w) ? w : w[0]))
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

/**
 * A program's logo on a white rounded square. Uploaded logos (emblem + wordmark artwork) show as they are, fitted
 * whole. Without a logo: the initials over a faint wash and outline in the category's colour.
 */
export function ProgramLogo({ program, size = 'md', className }) {
  const t = TONES[program.category] ?? FALLBACK;
  if (program.logo) {
    return (
      <span className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-xs ring-1 ring-inset ring-border-strong', SIZES[size], className)}>
        <img src={program.logo} alt={`${program.name} logo`} className="size-full object-contain" loading="lazy" />
      </span>
    );
  }
  return (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-xs ring-1 ring-inset', SIZES[size], t.ring, className)}>
      {/* The wash is its own layer — on the tile itself it would replace the white */}
      <span className={cn('absolute inset-0 bg-gradient-to-br to-transparent', t.wash)} aria-hidden="true" />
      {/* The tile is always white (like an uploaded logo), so the initials use a fixed dark ink in both themes */}
      <span className="relative font-bold tracking-tight text-slate-700" role="img" aria-label={`${program.name} (no logo)`}>
        {programInitials(program.name)}
      </span>
    </span>
  );
}
