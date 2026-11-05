import { cn } from '@/utils/cn';

const strokes = { primary: 'var(--ln-primary)', success: 'var(--ln-success)', warning: 'var(--ln-warning)', danger: 'var(--ln-danger)', inverse: '#ffffff' };

/**
 * Circular progress. <ProgressCircle value={72} size={56} label="Complete" /> — tone="inverse" for white-on-color cards.
 * `animateIn` fills the ring from empty on mount.
 */
export function ProgressCircle({ value = 0, size = 48, stroke = 5, tone = 'primary', showValue = true, animateIn, label, className }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progress'}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone === 'inverse' ? 'rgb(255 255 255 / 0.24)' : 'var(--ln-surface-sunken)'} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokes[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{
            transition: 'stroke-dashoffset 600ms ease-out',
            ...(animateIn && { '--ln-ring-from': c, animation: 'ln-ring-fill 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) 0.3s both' }),
          }}
        />
      </svg>
      {showValue && <span className={cn('absolute text-xs font-bold tabular-nums', tone === 'inverse' ? 'text-white' : 'text-text')}>{Math.round(pct)}%</span>}
    </div>
  );
}
