/** Shared wording and numbers for Projects: dates, relative days, program status words and a project's progress. */
import { startOfDay } from '@/utils/formatDate';

const DAY = 86400000;

/** Whole days from today to `date` (negative = in the past) */
export const daysFromToday = (date) => Math.round((startOfDay(date) - startOfDay(new Date())) / DAY);
export const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);

/** "3 Dec" */
export const shortDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
/** "3 Dec 2026" */
export const longDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
/** "3 Dec – 23 Jan"; withYear: "3 Dec – 24 Dec 2026" */
export const rangeLabel = (a, b, withYear = false) => `${shortDate(a)} – ${withYear ? longDate(b) : shortDate(b)}`;
/** "18 Nov 2026, 14:05" */
export const dateTimeLabel = (d) =>
  `${longDate(d)}, ${new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

/** today / tomorrow / in N days (anything in the past reads "today") */
export const relDay = (n) => (n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);
/** Same, with the past too: yesterday / N days ago */
export const relDayBoth = (n) => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : n === -1 ? 'yesterday' : n > 1 ? `in ${n} days` : `${-n} days ago`);

/** A project's stage, as a word */
export const STAGE_LABEL = { 'in-setup': 'In setup', live: 'Live', completed: 'Completed' };
export const STAGES = ['in-setup', 'live', 'completed'];

/** A program's status in the workspace header: word + dot / text colours */
export const PROGRAM_STATUS = {
  upcoming: { label: 'In setup', dot: 'bg-info', text: 'text-info' },
  'in-progress': { label: 'Running', dot: 'bg-chart-1', text: 'text-primary-text' },
  completed: { label: 'Delivered', dot: 'bg-success-main', text: 'text-success' },
};

/** A program dot's hover text: "Starts in 14 days · only 75% set up", "Running · ends 22 Nov", "Delivered · 22 Nov" */
export function programStatusText(pg) {
  if (pg.status === 'completed') return `Delivered · ${shortDate(pg.end)}`;
  if (pg.status === 'in-progress') return `Running · ends ${shortDate(pg.end)}`;
  if (pg.needsAction) return `Starts ${relDay(daysFromToday(pg.start))} · only ${pg.readiness}% set up`;
  return `Starts ${shortDate(pg.start)} · ${pg.readiness}% set up`;
}

/** Setup items done, out of 4 */
export const readyCount = (pg) => pg.setup.filter((s) => s.done).length;

/** Programs in date order */
export const byStart = (programs) => [...programs].sort((a, b) => new Date(a.start) - new Date(b.start));

/**
 * A project's progress: { pct, text, sub, bar }. In setup: how far its setup is ("Starts in 14 days · 75% set up");
 * live: how far through its dates ("Day 10 of 13 · ends 22 Nov"); completed: 100.
 */
export function projectProgress(p) {
  if (p.stage === 'completed') return { pct: 100, text: 'Completed', sub: shortDate(p.end), bar: 'bg-success-main' };
  if (p.stage === 'live') {
    const total = daysBetween(p.start, p.end) + 1;
    const day = Math.min(total, Math.max(1, daysBetween(p.start, new Date()) + 1));
    return { pct: Math.round((day / total) * 100), text: `Day ${day} of ${total}`, sub: `ends ${shortDate(p.end)}`, bar: 'bg-chart-1' };
  }
  return { pct: p.readiness, text: `Starts ${relDay(daysFromToday(p.start))}`, sub: `${p.readiness}% set up`, bar: p.needsAction ? 'bg-warning-main' : 'bg-info' };
}

/** "You" for the signed-in user, else the name */
export const personLabel = (name, userName) => (name && name === userName ? 'You' : name);
