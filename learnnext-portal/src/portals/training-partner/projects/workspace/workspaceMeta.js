/** Icons, words and colours shared by the program workspace (chapters, step states, journey step types). */
import {
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  Flag,
  LayoutDashboard,
  MapPin,
  Mail,
  MessagesSquare,
  MonitorPlay,
  Rocket,
  Users,
  UsersRound,
  Video,
  BookOpen,
} from 'lucide-react';

export const OVERVIEW_TAB = { value: 'overview', label: 'Overview', icon: LayoutDashboard };
export const CHAPTER_ICONS = {
  foundation: Flag,
  journey: CalendarRange,
  people: Users,
  logistics: MapPin,
  communication: Mail,
  golive: Rocket,
  after: ClipboardCheck,
};

/** The state pill on a step's header */
export const STATE_PILL = {
  done: 'bg-success-soft text-success',
  due: 'bg-warning-soft text-warning',
  overdue: 'bg-danger-soft text-danger',
  todo: 'bg-surface-sunken text-text-secondary',
  locked: 'bg-surface-sunken text-text-muted',
};
/** A step's state in words (its pill and its line in the steps list): Done / Not started / its note */
export const stateLine = (s) => (s.state === 'done' ? 'Done' : s.state === 'todo' ? 'Not started' : s.note);
export const stateText = { due: 'text-warning', overdue: 'text-danger' };

/** Every step of every chapter in order, each with its chapter */
export const allSteps = (chapters) => chapters.flatMap((c) => c.steps.map((s) => ({ ...s, chapter: { key: c.key, label: c.label } })));

/** The step a chapter opens on: the first that's still open (not done / locked), else its first */
export const firstOpenStep = (chapter) => (chapter.steps.find((s) => s.state !== 'done' && s.state !== 'locked') ?? chapter.steps[0]).key;

/** Journey step types: label, short label (in lists), icon, default length in minutes */
export const STEP_TYPES = {
  self: { label: 'Self-learning module', short: 'Self-learning', icon: BookOpen, minutes: 60 },
  virtual: { label: 'Virtual session', short: 'Virtual session', icon: Video, minutes: 120 },
  inperson: { label: 'In-person session', short: 'In-person session', icon: UsersRound, minutes: 360 },
  assessment: { label: 'Assessment', short: 'Assessment', icon: ClipboardList, minutes: 30 },
  feedback: { label: '360 feedback', short: '360 feedback', icon: MessagesSquare, minutes: 20 },
};
export const LIVE_TYPES = ['virtual', 'inperson'];

/** Pre / During / Post module icons */
export const moduleIcon = (name = '') => ({ pre: CalendarClock, during: CalendarRange, post: CalendarCheck })[name.toLowerCase()] ?? MonitorPlay;
/** Manage Content stage for a module (Pre → pre, During → during, Post → post) */
export const moduleStage = (name = '') => ({ pre: 'pre', during: 'during', post: 'post' })[name.toLowerCase()] ?? null;

/** "1h", "1h 30m", "30 min", "6h" */
export function lengthLabel(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
/** "9:30 am" */
export function timeLabel(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

/** What still needs doing on a journey step: "Venue pending", "Needs a start time", "Needs a link" */
export function stepIssues(s) {
  const out = [];
  if (s.type === 'inperson' && !s.venueSet) out.push('Venue pending');
  if (LIVE_TYPES.includes(s.type) && !s.time) out.push('Needs a start time');
  if (s.type === 'virtual' && !s.link) out.push('Needs a link');
  return out;
}

/** A journey step's meta line: "Virtual session · 10:00 am · 2h · Google Meet" */
export function stepMeta(s) {
  const t = STEP_TYPES[s.type];
  if (s.type === 'feedback') return `${t.short} · Open ${s.closesAfter ?? 7} days`;
  return [t.short, LIVE_TYPES.includes(s.type) ? timeLabel(s.time) : null, lengthLabel(s.minutes), s.type === 'virtual' ? s.platform : null].filter(Boolean).join(' · ');
}
