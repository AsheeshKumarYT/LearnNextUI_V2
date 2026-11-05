import { useEffect, useRef, useState } from 'react';
import { Share, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '@/hooks/useToast';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui';
import { LogoMark } from '@/components/brand/Logo';

const DISMISS_KEY = 'ln.pwa.installDismissedAt';
const SNOOZE_DAYS = 14;
const CHECK_EVERY_MS = 60 * 60 * 1000; // look for a new version hourly while the app is open

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * PWA glue. PwaUpdater sits at the app root (registers the service worker on every page, sign-in included);
 * InstallCard sits in the signed-in shell (above the bottom tab bar):
 *  • Update: when a new version has been deployed, a lasting toast "New version available" with **Reload** — the new
 *    version only takes over when the user taps it, so nobody is swapped mid-task.
 *  • Install (phones, not already installed): a slim card above the bottom tab bar. Android / Chrome: **Install** opens
 *    the browser's install dialog. iPhone / iPad (no install API): how to do it — Share → Add to Home Screen.
 *    × hides it for 14 days.
 */
export function PwaUpdater() {
  const toast = useToast();
  const shown = useRef(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => registration.update().catch(() => {}), CHECK_EVERY_MS);
    },
  });

  useEffect(() => {
    if (!needRefresh || shown.current) return;
    shown.current = true;
    toast.info('New version available', {
      description: 'Reload to get the latest LearnNext.',
      duration: 0,
      action: { label: 'Reload', onClick: () => updateServiceWorker(true) },
    });
  }, [needRefresh, toast, updateServiceWorker]);

  return null;
}

export function InstallCard() {
  const mobile = useIsMobile();
  const [dismissedAt, setDismissedAt] = useLocalStorage(DISMISS_KEY, 0);
  const [deferred, setDeferred] = useState(null); // Chrome / Android's saved install prompt
  const [installed, setInstalled] = useState(isStandalone);
  const ios = isIos();

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault(); // keep the browser's own mini-bar away; we offer it in our card
      setDeferred(e);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const snoozed = dismissedAt && Date.now() - dismissedAt < SNOOZE_DAYS * 864e5;
  if (!mobile || installed || snoozed || (!deferred && !ios)) return null;

  const install = async () => {
    deferred.prompt();
    const { outcome } = await deferred.userChoice.catch(() => ({ outcome: 'dismissed' }));
    setDeferred(null);
    if (outcome === 'accepted') setInstalled(true);
    else setDismissedAt(Date.now());
  };

  return (
    <div
      role="dialog"
      aria-label="Install LearnNext"
      className="fixed inset-x-3 bottom-[calc(5.125rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-2xl border border-border bg-elevated p-3 shadow-pop motion-safe:animate-slide-up md:hidden"
    >
      <LogoMark className="size-10 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text">Install LearnNext</p>
        <p className="text-xs leading-snug text-text-secondary">
          {ios ? (
            <>
              Tap <Share className="mx-0.5 inline size-3.5 -translate-y-px" aria-label="Share" /> then <span className="font-medium text-text">Add to Home Screen</span>
            </>
          ) : (
            'Open it from your home screen like an app.'
          )}
        </p>
      </div>
      {!ios && (
        <Button size="sm" onClick={install} className="shrink-0">
          Install
        </Button>
      )}
      <button
        type="button"
        onClick={() => setDismissedAt(Date.now())}
        aria-label="Not now"
        className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
