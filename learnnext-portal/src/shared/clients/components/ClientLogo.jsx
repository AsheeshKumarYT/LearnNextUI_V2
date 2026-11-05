import { cn } from '@/utils/cn';

const SIZES = {
  sm: 'size-9 rounded-[10px] text-xs',
  md: 'size-11 rounded-xl text-sm',
  lg: 'size-14 rounded-2xl text-base',
};

// Soft monogram tints (static class names so Tailwind can see them) — picked per company so it never changes
const TONES = [
  'bg-chart-1/12 text-chart-1 ring-chart-1/20',
  'bg-chart-2/15 text-info ring-chart-2/25',
  'bg-chart-3/20 text-warning ring-chart-3/30',
  'bg-chart-4/12 text-chart-4 ring-chart-4/20',
  'bg-chart-5/12 text-chart-5 ring-chart-5/20',
  'bg-success-main/15 text-success ring-success-main/25',
];
// The same tones as plain colours (same order) — e.g. to tint a client page's hero to match its monogram
const TONE_COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)', 'var(--color-success-main)'];
const toneIndex = (key = '') => [...key].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length;
const toneFor = (key) => TONES[toneIndex(key)];
/** The colour of a client's monogram tile (used when the client has no logo image) */
export const monogramColor = (key) => TONE_COLORS[toneIndex(key)];

// Legal suffixes don't make good initials ("Tata Steel Ltd" → "TS", not "TL")
const SUFFIX = /^(ltd|limited|pvt|private|india|llp|inc|co|and|&|the)\.?$/i;
export function monogram(name = '') {
  const words = name.split(/\s+/).filter((w) => w && !SUFFIX.test(w));
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '?').slice(0, 2)).toUpperCase();
}

/** Company logo: the uploaded image on a white tile, or a tinted monogram when there's no logo yet. */
export function ClientLogo({ client, size = 'md', className }) {
  const box = cn('inline-flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-inset', SIZES[size], className);
  if (client.logo) {
    return (
      <span className={cn(box, 'bg-white ring-border-strong')}>
        <img src={client.logo} alt={`${client.name} logo`} className="size-full object-contain" loading="lazy" />
      </span>
    );
  }
  return (
    <span className={cn(box, 'font-bold tracking-tight', toneFor(client.code))} role="img" aria-label={`${client.name} (no logo)`}>
      {monogram(client.name)}
    </span>
  );
}
