import { useEffect, useRef, useState } from 'react';
// Imported eagerly on purpose: a lazy chunk couldn't be downloaded while offline
import Offline, { useOnlineStatus } from '@/pages/errors/Offline';

const BACK_ONLINE_MS = 1800;

/**
 * Shows the full-screen "You're offline" page on top of the app while the connection is down
 * (the app stays mounted underneath, so nothing on screen is lost), then "Back online" briefly.
 */
export function OfflineGate({ children }) {
  const online = useOnlineStatus();
  const [showBack, setShowBack] = useState(false);
  const wasOffline = useRef(!online);
  const savedTitle = useRef('');
  const visible = !online || showBack;

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setShowBack(false);
      return undefined;
    }
    if (!wasOffline.current) return undefined;
    wasOffline.current = false;
    setShowBack(true);
    const t = setTimeout(() => setShowBack(false), BACK_ONLINE_MS);
    return () => clearTimeout(t);
  }, [online]);

  // The overlay sets its own tab title; remember the page's title while hidden (read during render, before
  // the overlay's effect runs) and put it back when the overlay closes
  if (!visible && typeof document !== 'undefined') savedTitle.current = document.title;
  useEffect(() => {
    if (!visible) return undefined;
    return () => {
      document.title = savedTitle.current;
    };
  }, [visible]);

  return (
    <>
      {children}
      {visible && (
        <div className="fixed inset-0 z-[95] animate-fade-in" role="alert">
          <Offline online={online} onContinue={() => setShowBack(false)} />
        </div>
      )}
    </>
  );
}
