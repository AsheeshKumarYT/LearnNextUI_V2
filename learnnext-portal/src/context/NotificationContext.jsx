import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsApi } from '@/services/api';

export const NotificationContext = createContext(null);

/**
 * Shared notification state so the header dropdown, sidebar badge and the
 * Notifications page always agree on read/unread status.
 */
export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    notificationsApi.list().then((list) => {
      if (alive) {
        setItems(list);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const markRead = useCallback((id) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))), []);
  const markUnread = useCallback((id) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: false } : n))), []);
  const markAllRead = useCallback(() => setItems((l) => l.map((n) => ({ ...n, read: true }))), []);
  const remove = useCallback((id) => setItems((l) => l.filter((n) => n.id !== id)), []);

  const value = useMemo(
    () => ({ items, loading, unreadCount: items.filter((n) => !n.read).length, markRead, markUnread, markAllRead, remove }),
    [items, loading, markRead, markUnread, markAllRead, remove],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
