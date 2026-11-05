import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Small copy-to-clipboard button. Hidden until its `group` parent is hovered or focused (always visible on touch
 * screens), shows a tick for a moment after copying. `label` names what's copied for screen readers.
 */
export function CopyButton({ text, label, className }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? 'Copied' : 'Copy'}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-md transition-[opacity,background-color,color] duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        copied ? 'text-success opacity-100' : 'text-text-muted opacity-0 hover:bg-surface-sunken hover:text-text group-hover:opacity-100 [@media(hover:none)]:opacity-100',
        className,
      )}
    >
      {copied ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
    </button>
  );
}
