import { RefreshCw, Wrench } from 'lucide-react';
import { Button } from '@/components/ui';
import { ErrorScreen, Numerals, primaryOnDark } from './components/ErrorScreen';
import { Gear } from './components/Illustrations';

/** 503 — planned maintenance or the service is temporarily down. `eta` is a short human string. */
export default function ServiceUnavailable({ eta = 'about 15 minutes' }) {
  return (
    <ErrorScreen
      tone="amber"
      docTitle="Down for maintenance"
      illustration={
        <Numerals label="503">
          {'5'}
          <Gear />
          {'3'}
        </Numerals>
      }
      eyebrow="Error 503 · Service unavailable"
      title="We’ll be right back"
      description="LearnNext is getting a quick upgrade. Everything will be back shortly — no work is lost."
      actions={
        <Button size="lg" leftIcon={RefreshCw} onClick={() => window.location.reload()} className={primaryOnDark}>
          Check again
        </Button>
      }
      extra={
        <div className="mx-auto max-w-md rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-left backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="inline-flex items-center gap-2 font-semibold text-white/85">
              <Wrench className="size-3.5 text-[#ffc25c]" aria-hidden="true" />
              Systems updating
            </span>
            <span className="text-white/55">Back in {eta}</span>
          </div>
          {/* Indeterminate progress */}
          <div className="relative mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Maintenance in progress">
            <span className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#ffc25c] to-transparent motion-safe:animate-fly motion-safe:[animation-duration:2.4s] motion-reduce:left-1/3" />
          </div>
        </div>
      }
    />
  );
}
