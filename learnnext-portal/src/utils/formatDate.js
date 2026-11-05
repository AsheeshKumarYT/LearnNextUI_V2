const toDate = (value) => (value instanceof Date ? value : new Date(value));

/** 12 Mar 2026 */
export function formatDate(value, options = {}) {
  if (!value) return '—';
  return toDate(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', ...options });
}

/** 9:30 AM */
export function formatTime(value) {
  if (!value) return '—';
  return toDate(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** 12 Mar 2026, 9:30 AM */
export function formatDateTime(value) {
  if (!value) return '—';
  return `${formatDate(value)}, ${formatTime(value)}`;
}

/** Wednesday, 7 October */
export function formatLongDate(value = new Date()) {
  return toDate(value).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** "5m ago", "3h ago", "2d ago", falls back to a date. */
export function formatRelative(value) {
  if (!value) return '—';
  const diff = Date.now() - toDate(value).getTime();
  const abs = Math.abs(diff);
  const m = 60 * 1000;
  const h = 60 * m;
  const d = 24 * h;
  const suffix = diff >= 0 ? 'ago' : 'from now';
  if (abs < m) return 'just now';
  if (abs < h) return `${Math.round(abs / m)}m ${suffix}`;
  if (abs < d) return `${Math.round(abs / h)}h ${suffix}`;
  if (abs < 7 * d) return `${Math.round(abs / d)}d ${suffix}`;
  return formatDate(value);
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  const x = toDate(a);
  const y = toDate(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

export function startOfDay(value) {
  const d = new Date(toDate(value));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(value, n) {
  const d = new Date(toDate(value));
  d.setDate(d.getDate() + n);
  return d;
}

/** Monday-based start of week */
export function startOfWeek(value) {
  const d = startOfDay(value);
  const day = (d.getDay() + 6) % 7;
  return addDays(d, -day);
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** YYYY-MM-DD in local time — stable value for inputs and APIs */
export function toISODate(value) {
  if (!value) return '';
  const d = toDate(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISODate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
