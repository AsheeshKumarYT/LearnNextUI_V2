import { useId } from 'react';
import { cn } from '@/utils/cn';

/**
 * Tiny dependency-free trend line. <Sparkline data={[3,5,4,8]} tone="primary" />
 * `tone` = a --ln-* colour name (primary, chart-1, success…). `smooth` draws a soft curve instead of straight segments.
 * `fluid` stretches it to fill its parent (100% × 100%) with the line keeping its thickness — for edge-to-edge
 * backgrounds; `width`/`height` then only set the drawing's proportions.
 * `min` / `max` fix the vertical scale (e.g. to overlay two series on one scale).
 * `tips` = one text per point; hovering near a point shows it as a tooltip.
 * `area={false}` draws the line only; `areaOpacity` sets the fill's top strength; `lineOpacity` softens the line.
 */
export function Sparkline({
  data = [], width = 96, height = 32, tone = 'primary', smooth, fluid, min: minProp, max: maxProp, tips, area = true, areaOpacity, lineOpacity = 1, className,
}) {
  // useId contains ":" which breaks url(#…) references in some browsers
  const id = `spark-${useId().replace(/:/g, '')}`;
  if (data.length < 2) return null;
  const min = minProp ?? Math.min(...data);
  const max = maxProp ?? Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - 2 - ((v - min) / span) * (height - 4)]);
  const line = smooth
    ? pts
        .map(([x, y], i) => {
          if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
          // Midpoint-smoothed cubic: control points halfway between neighbours, at their heights
          const [px, py] = pts[i - 1];
          const mx = (px + x) / 2;
          return `C${mx.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ')
    : pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const color = `var(--ln-${tone === 'primary' ? 'primary' : tone})`;
  return (
    <svg
      width={fluid ? '100%' : width}
      height={fluid ? '100%' : height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={fluid ? 'none' : undefined}
      className={cn(fluid ? 'block' : 'overflow-visible', className)}
      aria-hidden={tips ? undefined : 'true'}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={areaOpacity ?? (fluid ? 0.28 : 0.22)} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeOpacity={lineOpacity} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {/* Invisible hover strips, one per point, each carrying that point's tooltip */}
      {tips &&
        data.map((_, i) => (
          <rect key={i} x={Math.max(0, i * step - step / 2)} y="0" width={i === 0 || i === data.length - 1 ? step / 2 : step} height={height} fill="transparent">
            <title>{tips[i]}</title>
          </rect>
        ))}
    </svg>
  );
}
