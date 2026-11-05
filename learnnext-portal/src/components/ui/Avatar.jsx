import { useState } from 'react';
import { cn } from '@/utils/cn';
import { initials } from '@/utils/helpers';

const sizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-9 text-[13px]',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl',
  '2xl': 'size-24 text-3xl sm:size-28 sm:text-4xl',
};

// Deterministic, muted tints so initials avatars look intentional
const tints = [
  'bg-[#e3ecf8] text-[#23599a] dark:bg-[#1a2a40] dark:text-[#8dbbf0]',
  'bg-[#e2f4f1] text-[#16766b] dark:bg-[#12302c] dark:text-[#6fd8c9]',
  'bg-[#f6eedf] text-[#94600f] dark:bg-[#33280f] dark:text-[#f0c27a]',
  'bg-[#ede8f9] text-[#5b44a8] dark:bg-[#251e3d] dark:text-[#bba9f0]',
  'bg-[#fbe8eb] text-[#a8364a] dark:bg-[#3a1a21] dark:text-[#f3a1ad]',
];
const tintFor = (name = '') => tints[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % tints.length];

export function Avatar({ src, name = '', size = 'md', status, className }) {
  // A photo that can't load (offline, moved) falls back to the initials
  const [failed, setFailed] = useState(null);
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src && failed !== src ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(src)} className={cn('rounded-full object-cover', sizes[size])} />
      ) : (
        <span
          aria-label={name || undefined}
          role={name ? 'img' : undefined}
          className={cn('inline-flex items-center justify-center rounded-full font-semibold', sizes[size], tintFor(name))}
        >
          {initials(name) || '?'}
        </span>
      )}
      {status && (
        <span
          aria-label={status}
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-surface',
            size === 'xs' || size === 'sm' ? 'size-2' : 'size-2.5',
            status === 'online' ? 'bg-success' : status === 'away' ? 'bg-warning' : 'bg-text-muted',
          )}
        />
      )}
    </span>
  );
}
