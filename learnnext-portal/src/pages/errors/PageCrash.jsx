import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Copy, LayoutDashboard, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import { ErrorScreen, ghostOnDark, primaryOnDark } from './components/ErrorScreen';
import { CrashedWindow } from './components/Illustrations';

const SAMPLE_ERROR = "TypeError: Cannot read properties of undefined (reading 'map')\n    at ProgramSchedule (ProgramSchedule.jsx:42:18)";

/**
 * Shown by the app-wide ErrorBoundary when a screen throws while rendering (`error` is what was thrown).
 * Without an error (UI Preview) it shows a sample message.
 */
export default function PageCrash({ error }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const details = error ? `${error.name ?? 'Error'}: ${error.message}${error.stack ? `\n${error.stack.split('\n').slice(1, 4).join('\n')}` : ''}` : SAMPLE_ERROR;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <ErrorScreen
      tone="rose"
      docTitle="Something went wrong"
      illustration={<CrashedWindow />}
      eyebrow="Unexpected error"
      title="This page crashed"
      description="Something went wrong while showing this screen. Your data is safe — reloading usually fixes it."
      actions={
        <>
          <Button size="lg" leftIcon={RotateCcw} onClick={() => window.location.reload()} className={primaryOnDark}>
            Reload page
          </Button>
          {/* Navigating changes the path, which resets the error boundary */}
          <Button as={Link} to="/dashboard" size="lg" variant="ghost" leftIcon={LayoutDashboard} className={ghostOnDark}>
            Back to dashboard
          </Button>
        </>
      }
      extra={
        <div className="mx-auto max-w-md rounded-xl border border-white/15 bg-black/20 text-left backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Technical details
            <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
          </button>
          {open && (
            <div className="relative animate-fade-in border-t border-white/10 px-4 pb-3 pt-2.5">
              <pre className="max-h-32 overflow-auto short:max-h-16 whitespace-pre-wrap break-words pr-8 font-mono text-[11px] leading-5 text-white/70">{details}</pre>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? 'Copied' : 'Copy error details'}
                className="absolute right-3 top-2.5 inline-flex size-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {copied ? <Check className="size-3.5 text-[#5ce0a0]" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
