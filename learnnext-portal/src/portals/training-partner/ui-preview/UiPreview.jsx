import { useEffect, useRef, useState } from 'react';
import { Bug, Clock, Compass, ExternalLink, ServerCrash, WifiOff, Wrench, Zap } from 'lucide-react';
import { Card } from '@/components/ui';

/** Every system page, when users see it and what triggers it. `path` opens the real component in preview mode. */
const PAGES = [
  { key: '404', title: 'Page not found', icon: Compass, path: '/preview/404', when: 'A link is broken or the page doesn’t exist.', how: 'Any unknown address' },
  { key: 'crash', title: 'Page crash', icon: Bug, path: '/preview/crash', when: 'A screen fails while loading — instead of a blank page.', how: 'Automatic (error boundary)' },
  { key: '500', title: 'Server error', icon: ServerCrash, path: '/preview/500', when: 'The server failed to complete a request.', how: 'API returns 500' },
  { key: '503', title: 'Maintenance', icon: Wrench, path: '/preview/503', when: 'Planned maintenance or the service is temporarily down.', how: 'API returns 503' },
  { key: 'offline', title: 'No internet', icon: WifiOff, path: '/preview/offline', when: 'The device loses its connection.', how: 'Automatic overlay' },
  { key: 'session', title: 'Session expired', icon: Clock, path: '/preview/session-expired', when: 'The sign-in session ran out after inactivity.', how: 'API returns 401' },
];

// The page is rendered at a desktop size and scaled down to the card's width
const SCREEN_W = 1280;
const SCREEN_H = 800;

/** The real page, live and shrunk: an iframe at desktop size, scaled to fit (not interactive — the card is the link) */
function LiveScreen({ path, title }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b0a1a]">
      <iframe
        src={`${path}?thumb`}
        title={`${title} preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
        style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})` }}
      />
    </div>
  );
}

/**
 * UI Preview: a gallery of the full-screen system pages (404, crash, 500, 503, offline, session expired).
 * Picked from previews: "Live mini-screens" — each card is a small browser window showing the REAL page, live and
 * shrunk (address bar = its preview path), then its name, when users see it and what triggers it. The whole card opens
 * the preview (real component, safe actions) in a new tab.
 */
export default function UiPreview() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {PAGES.map((p, i) => {
        const Icon = p.icon;
        return (
          <Card
            key={p.key}
            padding="none"
            className="group relative flex animate-rise flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-md"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Window chrome: three dots + the address */}
            <div className="flex h-8 items-center gap-3 border-b border-border bg-surface-sunken/70 px-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-[#ff5f57]/70" />
                <span className="size-2 rounded-full bg-[#febc2e]/70" />
                <span className="size-2 rounded-full bg-[#28c840]/70" />
              </span>
              <span className="min-w-0 flex-1 truncate rounded-md bg-surface px-2 py-0.5 text-center font-mono text-[11px] text-text-muted dark:bg-surface-secondary">
                {p.path}
              </span>
            </div>

            <LiveScreen path={p.path} title={p.title} />

            <div className="flex flex-1 flex-col gap-1 px-4 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-text transition-colors group-hover:text-primary-text">
                  <Icon className="size-4 text-text-muted" aria-hidden="true" />
                  {/* The card's link — opens the page in a new tab; its ::after covers the whole card */}
                  <a
                    href={p.path}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${p.title} — opens in a new tab`}
                    className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-inset focus-visible:after:ring-focus"
                  >
                    {p.title}
                  </a>
                </h2>
                {/* Says where it opens (the whole card is the link) */}
                <ExternalLink className="size-4 shrink-0 text-text-muted transition-colors group-hover:text-primary-text" aria-hidden="true" />
              </div>
              <p className="text-[13px] leading-5 text-text-secondary">{p.when}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                <Zap className="size-3.5" aria-hidden="true" />
                {p.how}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
