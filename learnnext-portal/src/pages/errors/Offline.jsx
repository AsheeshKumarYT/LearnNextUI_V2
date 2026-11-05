import { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui';
import { ErrorScreen, ghostOnDark, primaryOnDark, usePreview } from './components/ErrorScreen';
import { WifiSignal } from './components/Illustrations';

const TIPS = ['Check your Wi-Fi', 'Turn off airplane mode', 'Try another network'];

/** Tracks navigator.onLine */
export function useOnlineStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/**
 * No internet. Used as a full-screen overlay by OfflineGate (it disappears by itself once the connection returns)
 * and in the UI Preview gallery, where "Simulate reconnect" shows the back-online state.
 */
export default function Offline({ online: onlineProp, onContinue }) {
  const preview = usePreview();
  const live = useOnlineStatus();
  const [simulated, setSimulated] = useState(false);
  const online = preview ? simulated : onlineProp ?? live;

  return (
    <ErrorScreen
      tone="teal"
      docTitle={online ? 'Back online' : 'You’re offline'}
      illustration={<WifiSignal online={online} />}
      eyebrow={online ? 'Connection restored' : 'No internet connection'}
      title={online ? 'You’re back online' : 'You’re offline'}
      description={
        online
          ? 'Your connection is back. Pick up right where you left off.'
          : 'Check your connection — we’ll reconnect automatically as soon as you’re back online.'
      }
      actions={
        online ? (
          <Button size="lg" rightIcon={ArrowRight} onClick={() => (preview ? setSimulated(false) : onContinue ? onContinue() : window.location.reload())} className={primaryOnDark}>
            {preview ? 'Go offline again' : 'Continue'}
          </Button>
        ) : (
          <>
            <Button size="lg" leftIcon={RefreshCw} onClick={() => window.location.reload()} className={primaryOnDark}>
              Try again
            </Button>
            {preview && (
              <Button size="lg" variant="ghost" leftIcon={Wifi} onClick={() => setSimulated(true)} className={ghostOnDark}>
                Simulate reconnect
              </Button>
            )}
          </>
        )
      }
      extra={
        !online && (
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Things to try">
            {TIPS.map((t) => (
              <li key={t} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/65 backdrop-blur-md">
                {t}
              </li>
            ))}
          </ul>
        )
      }
    />
  );
}
