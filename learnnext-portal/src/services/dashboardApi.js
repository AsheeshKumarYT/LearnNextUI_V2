/** Dashboard, notifications, lookups and the small demo modules. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { startOfDay, addDays } from '@/utils/formatDate';
import { db, mock } from './coreApi';

/* ------------------------------------------------------- Other modules */
export const scheduleApi = { list: () => mock(demo.sessions) };
export const messagesApi = { list: () => mock(demo.conversations) };
export const activityApi = { list: () => mock(demo.activity) };
export const analyticsApi = { get: () => mock(demo.analytics) };
/** Coaching dashboard: { stages, coaches, engagements, actions, invoices }. Filtering happens client-side. */
export const coachingApi = { dashboard: () => mock(demo.coaching) };
export const securityApi = { loginActivity: () => mock(demo.loginActivity) };

/* ------------------------------------------------------------- Dashboard */
// Mock-only: how much of "last month" each period represents, and the share collected.
const PERIOD_SCALE = { month: 0.45, last_month: 1, quarter: 2.8, year: 10.6 };
const PERIOD_COLLECTED = { month: 0.24, last_month: 0.42, quarter: 0.38, year: 0.71 };

/**
 * Time buckets for the selected period, oldest first:
 * month → each day so far · last_month → each day · quarter → 13 weeks · year → 12 months.
 * A real API would return these series; the mock spreads the period totals over the buckets.
 */
function trendBuckets(period) {
  const today = startOfDay(new Date());
  const short = (d, opts) => d.toLocaleDateString('en-GB', opts);
  if (period === 'month') {
    return Array.from({ length: today.getDate() }, (_, i) => short(new Date(today.getFullYear(), today.getMonth(), i + 1), { day: 'numeric', month: 'short' }));
  }
  if (period === 'last_month') {
    const days = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    return Array.from({ length: days }, (_, i) => short(new Date(today.getFullYear(), today.getMonth() - 1, i + 1), { day: 'numeric', month: 'short' }));
  }
  if (period === 'quarter') {
    return Array.from({ length: 13 }, (_, i) => `Week of ${short(addDays(today, (i - 12) * 7), { day: 'numeric', month: 'short' })}`);
  }
  return Array.from({ length: 12 }, (_, i) => short(new Date(today.getFullYear(), today.getMonth() - 11 + i, 1), { month: 'short', year: 'numeric' }));
}

/** Deterministic pseudo-random numbers so the charts never jump between renders */
export function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Running total that rises unevenly across the buckets and ends exactly at `total` */
function cumulativeSeries(n, total, seed) {
  const r = seeded(seed);
  const weights = Array.from({ length: n }, () => 0.35 + r());
  const sum = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => Math.round(total * ((acc += w) / sum)));
}

/** A level that drifts up and down across the buckets and ends exactly at `end` (e.g. items waiting) */
function levelSeries(n, end, seed) {
  const r = seeded(seed);
  const out = [];
  let v = Math.max(1, end * (0.55 + r() * 0.4));
  for (let i = 0; i < n; i++) {
    v = Math.max(0, v + (r() - 0.45) * Math.max(2, end * 0.18));
    out.push(Math.round(v));
  }
  out[n - 1] = end;
  return out;
}

const PERIOD_SEED = { month: 11, last_month: 23, quarter: 37, year: 53 };

/** { unit, labels[], programs[], invoiced[], collected[], approvals[] } for the KPI cards */
function buildTrends(period, totals) {
  const labels = trendBuckets(period);
  const n = labels.length;
  const seed = PERIOD_SEED[period] ?? 7;
  const unit = period === 'quarter' ? 'week' : period === 'year' ? 'month' : 'day';
  return {
    unit,
    labels,
    programs: cumulativeSeries(n, totals.programs, seed * 101),
    invoiced: cumulativeSeries(n, totals.invoiced, seed * 211),
    collected: cumulativeSeries(n, totals.received, seed * 307),
    approvals: levelSeries(n, totals.pending, seed * 409),
  };
}

export const dashboardApi = {
  /** period: month | last_month | quarter | year. Schedule, partners, agreements and leaderboard are current state. */
  overview(period = 'last_month') {
    const d = demo.dashboard;
    const f = PERIOD_SCALE[period] ?? 1;
    const n = (v) => Math.max(0, Math.round(v * f));
    const programs = { ...d.programs, completed: n(d.programs.completed), pending: n(d.programs.pending) };
    programs.total = programs.completed + programs.inProgress + programs.upcoming + programs.pending;    const invoiced = n(d.billing.invoiced);
    const received = Math.round(invoiced * (PERIOD_COLLECTED[period] ?? 0));
    return mock({
      ...d,
      programs,
      billing: {
        invoiced,
        received,
        entities: d.billing.entities.map((e) => ({ ...e, value: n(e.value) })),
      },
      trends: buildTrends(period, { programs: programs.total, invoiced, received, pending: programs.pending }),
      usage: Object.fromEntries(Object.entries(d.usage).map(([k, rows]) => [k, rows.map((r) => ({ ...r, value: Math.max(1, n(r.value)) }))])),
    });
  },
};

export const notificationsApi = {
  list: () => mock(db.notifications, 200),
};

export const lookupsApi = {
  categories: () => demo.categories,
  instructors: () => db.instructors.map((i) => ({ value: i.id, label: i.name })),
  courses: () => db.courses.map((c) => ({ value: c.id, label: c.title })),
};
