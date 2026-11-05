import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LifeBuoy, RefreshCw } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/config/app';
import { Button } from '@/components/ui';
import { ErrorScreen, Numerals, Planet, ghostOnDark, primaryOnDark } from './components/ErrorScreen';

/** 500 — something failed on the server. Pass `reference` (request id) when the API returns one. */
export default function ServerError({ reference }) {
  const ref = useMemo(() => reference ?? `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, [reference]);

  return (
    <ErrorScreen
      tone="violet"
      docTitle="Server error"
      illustration={
        <Numerals label="500">
          {'5'}
          <Planet moon={false} />
          <Planet tone="ice" ring={false} moon={false} className="[animation-delay:1.5s]" />
        </Numerals>
      }
      eyebrow="Error 500 · Internal server error"
      title="Our servers hit turbulence"
      description="Something went wrong on our side. We’ve been notified and are already on it — please try again in a moment."
      actions={
        <>
          <Button size="lg" leftIcon={RefreshCw} onClick={() => window.location.reload()} className={primaryOnDark}>
            Try again
          </Button>
          <Button as={Link} to="/dashboard" size="lg" variant="ghost" leftIcon={LayoutDashboard} className={ghostOnDark}>
            Back to dashboard
          </Button>
        </>
      }
      extra={
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/55">
          <span className="font-mono">Reference {ref}</span>
          <span aria-hidden="true">·</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Server error ${ref}`)}`}
            className="inline-flex items-center gap-1 rounded font-semibold text-white/80 underline-offset-2 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <LifeBuoy className="size-3.5" aria-hidden="true" />
            Contact support
          </a>
        </p>
      }
    />
  );
}
