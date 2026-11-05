import { useId } from 'react';
import { cn } from '@/utils/cn';
import { APP_NAME } from '@/config/app';

/** LearnNext brand mark. `showWordmark={false}` for the collapsed sidebar. `tone="inverse"` on dark brand surfaces. */
export function LogoMark({ className }) {
  // Unique gradient id: a hidden copy of the logo (e.g. desktop sidebar on mobile) must not own the gradient
  const id = `ln-mark-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--ln-primary)" />
          <stop offset="1" stopColor="var(--ln-primary-active)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="white" strokeOpacity="0.14" />
      <path d="M10.5 8.5v15h11" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8.5l5.5 4.5" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ showWordmark = true, tone = 'default', subtitle, className }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className={cn('text-[15px] font-semibold tracking-[-0.02em]', tone === 'inverse' ? 'text-white' : 'text-text')}>
            {APP_NAME}
          </span>
          {subtitle && (
            <span className={cn('mt-1 text-[11px] font-medium', tone === 'inverse' ? 'text-white/60' : 'text-text-muted')}>{subtitle}</span>
          )}
        </span>
      )}
    </span>
  );
}
